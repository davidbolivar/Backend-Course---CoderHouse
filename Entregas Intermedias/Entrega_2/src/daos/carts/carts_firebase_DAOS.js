import { Carts_controller_firebase } from "../../controllers/carts/carts_controller_firebase.js";

class CartsDaoFirebase extends Carts_controller_firebase {
	constructor() {
		super("carts");
	}
}

export default CartsDaoFirebase;
