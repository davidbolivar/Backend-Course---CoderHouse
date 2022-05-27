import config from "../../config.js";

let cartsDao;

switch (config.persistence) {
	case "local":
		const { default: CartsDaoLocal } = await import("./carts_local_DAOS.js");
		cartsDao = new CartsDaoLocal(config.fileSystem.path);
		break;
	case "firebase":
		const { default: CartsDaoFirebase } = await import("./carts_firebase_DAOS.js");
		cartsDao = new CartsDaoFirebase();
		break;
	case "mongodb":
		const { default: CartsDaoMongodb } = await import("./carts_mongodb_DAOS.js");
		cartsDao = new CartsDaoMongodb();
		break;
	default:
		const { default: CartsDaoMemory } = await import("./carts_memory_DAOS.js");
		cartsDao = new CartsDaoMemory();
		break;
}

export { cartsDao };
