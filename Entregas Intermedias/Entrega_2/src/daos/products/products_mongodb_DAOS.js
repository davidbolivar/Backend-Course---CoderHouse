import { Products_controller_mongodb } from "../../controllers/products/products_controller_mongodb.js";

class ProductsDaoMongodb extends Products_controller_mongodb {
	constructor() {
		super("products", {
			title: { type: String, required: true },
			description: { type: String, required: true },
			thumbnail: { type: String, required: true },
			price: { type: Number, required: true },
			stock: { type: Number, required: true },
		});
	}
}

export default ProductsDaoMongodb;
