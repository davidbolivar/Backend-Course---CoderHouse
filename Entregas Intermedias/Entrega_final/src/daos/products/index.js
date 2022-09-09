import config from "../../config.js";

let productsDao;

switch (config.persistence) {
	case "mongodb":
		const { default: ProductsDaoMongodb } = await import("./mongodb/products-mongodb.dao.js");
		const { default: mongooseProductSchema } = await import("./mongodb/products.schema.js");
		productsDao = new ProductsDaoMongodb(mongooseProductSchema);
		break;
	default:
		throw {
			message: `Persistence ${config.persistence} not implemented`,
			code: "persistence_not_implemented",
			expected: true,
			status: 500,
		};
}

export { productsDao };
