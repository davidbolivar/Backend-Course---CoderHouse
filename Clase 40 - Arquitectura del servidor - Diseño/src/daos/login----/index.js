import config from "../../config.js";

let loginDao;

switch (config.persistence) {
	case "mongodb":
		const { default: loginDaoMongodb } = await import("./login_mongodb_DAOS.js");
		loginDao = new loginDaoMongodb();
		break;
}

export { loginDao };
