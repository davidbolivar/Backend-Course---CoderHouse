import { Login_controller_mongodb } from "../../controllers/login/login_controller_mongodb.js";

class LoginDaoMongodb extends Login_controller_mongodb {
	constructor() {
		super("login", {
			username: { type: String, required: true },
			password: { type: String, required: true },
		});
	}
}

export default LoginDaoMongodb;
