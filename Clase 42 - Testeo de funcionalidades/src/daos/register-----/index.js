import config from "../../config.js";

let registerDao;

switch (config.persistence) {
	case "mongodb":
		const { default: registerDaoMongodb } = await import("./register_mongodb_DAOS.js");
		registerDao = new registerDaoMongodb();
		break;
}

export { registerDao };
