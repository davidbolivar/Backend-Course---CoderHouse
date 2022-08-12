import { Register_controller_mongodb } from "../../controllers/register/register_controller_mongodb.js";

class RegisterDaoMongodb extends Register_controller_mongodb {
	constructor() {
		super("users", {
			username: { type: String, required: true },
			password: { type: String, required: true },
			name: { type: String, required: true },
			address: { type: String, required: true },
			age: { type: Number, required: true },
			phone: { type: Number, required: true },
			photo: { type: String, required: true },
		});
	}
}

export default RegisterDaoMongodb;
