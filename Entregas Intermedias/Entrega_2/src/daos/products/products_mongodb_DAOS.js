import { Products_controller_mongodb } from "../../controllers/products/Products_controller_mongodb.js";

class ProductsDaoMongodb extends Products_controller_mongodb {
	constructor() {
		super("products", {
			id: { type: String, required: true },
			products: { type: Ar, required: true },
		});
	}
}

export default ProductsDaoMongodb;
