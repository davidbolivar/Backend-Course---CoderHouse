import mongoose from "mongoose";
import logger from "../../../logs/logger.js";
import config from "../../config.js";
import { cartsDao } from "../../daos/carts/index.js";
import { transporter } from "../../senders/email/gmail.js";
import { new_user_email_template } from "../../senders/email/templates/new_user_email.js";

await mongoose.connect(config.mongodb.cnxStr, config.mongodb.options);

export const Register_controller_mongodb = class Register_container {
	constructor(collection, schema) {
		this.collection = mongoose.model(collection, schema);
	}

	postRegister = async (user_data) => {
		try {
			await cartsDao.create(user_data._id);
			const mail_info = await transporter.sendMail(new_user_email_template(user_data));
			logger.info(mail_info);
			return true;
		} catch (error) {
			logger.error("Error al crear el usuario: " + error);
			return { error: "Register error:" + error };
		}
	};

	getFailRegister(errors) {
		logger.warn("Fail register: " + errors);
		return { error: "Fail register:" + errors.pop() };
	}
};
