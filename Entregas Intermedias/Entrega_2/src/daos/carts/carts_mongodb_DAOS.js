import { Carts_controller_mongodb } from "../../controllers/carts/carts_controller_mongodb.js";

class CartsDaoMongodb extends Carts_controller_mongodb {
	constructor() {
		super("carts", {
			id: { type: String, required: true },
			products: { type: Ar, required: true },
		});
	}
}

export default CartsDaoMongodb;
