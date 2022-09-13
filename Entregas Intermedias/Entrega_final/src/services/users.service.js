// import logger from "../../../../../logs/logger.js";
import UserModel from "../models/user.model.js";
import { usersDao } from "../daos/users/index.js";
import { cartsService } from "../services/carts.service.js";
import { tokenGenerator, idGenerator, encryptPassword } from "../utils.js";

// import bcrypt from "bcrypt";

class UsersService {
	#usersDao;
	#cartsService;
	#userModel;
	#tokenGenerator;
	#idGenerator;
	#encryptPassword;

	constructor(usersDao, UserModel, cartsService, idGenerator, tokenGenerator, encryptPassword) {
		this.#usersDao = usersDao;
		this.#userModel = UserModel;
		this.#cartsService = cartsService;
		this.#tokenGenerator = tokenGenerator;
		this.#idGenerator = idGenerator;
		this.#encryptPassword = encryptPassword;
	}

	create = async (req) => {
		try {
			await this.#userExist(req.body.email);

			const userModel = new this.#userModel(this.#idGenerator, this.#encryptPassword, req.body);
			const userDto = await userModel.dto();
			const newUser = await this.#usersDao.create(userDto);

			if (newUser) await this.#cartsService.create(newUser.id);
			const token = this.#tokenGenerator(newUser.id, newUser.email);

			return { id: newUser.id, username: newUser.email, token };
		} catch (error) {
			if (!error.expected)
				error = {
					message: "Error al registrar usuario.",
					code: "register_error",
					status: 500,
				};

			delete error.expected;
			throw error;
		}
	};

	#userExist = async (email) => {
		try {
			const user = await this.#usersDao.getByEmail(email);
			if (user)
				throw {
					message: "Email ya registrado.",
					code: "email_already_registered",
					status: 400,
					expected: true,
				};
			return false;
		} catch (error) {
			throw error;
		}
	};
}

export const usersService = new UsersService(usersDao, UserModel, cartsService, idGenerator, tokenGenerator, encryptPassword);
