import { Carts_controller_mongodb } from "../../controllers/carts/carts_controller_mongodb.js";
import mongoose from "mongoose";

class CartsDaoMongodb extends Carts_controller_mongodb {
	constructor() {
		super("carts", {
			// products: { type: Array, default: [] },
			products: [
				{
					title: { type: String, required: true },
					description: { type: String, required: true },
					price: { type: Number, required: true },
					thumbnail: { type: String, required: true },
					quantity: { type: Number, required: true },
					id: { type: String, required: true },
				},
			],
			timestamps: {
				createdAt: { type: Date, default: Date.now },
				updatedAt: { type: Date, default: Date.now },
			},
		});
	}
}

export default CartsDaoMongodb;
