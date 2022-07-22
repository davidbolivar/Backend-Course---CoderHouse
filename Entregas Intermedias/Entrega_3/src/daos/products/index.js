import config from "../../config.js";

let productsDao;

switch (config.persistence) {
	case "local":
		const { default: productsDaoLocal } = await import("./products_local_DAOS.js");
		productsDao = new productsDaoLocal(config.fileSystem.path);
		productsDao.setProducts();
		break;
	case "firebase":
		const { default: productsDaoFirebase } = await import("./products_firebase_DAOS.js");
		productsDao = new productsDaoFirebase();
		break;
	case "mongodb":
		const { default: productsDaoMongodb } = await import("./products_mongodb_DAOS.js");
		productsDao = new productsDaoMongodb();
		break;
	default:
		const { default: productsDaoMemory } = await import("./products_memory_DAOS.js");
		productsDao = new productsDaoMemory();
		break;
}

export { productsDao };
