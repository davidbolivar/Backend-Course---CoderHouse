import { Products_controller_firebase } from "../../controllers/products/products_controller_firebase.js";

class ProductsDaoFirebase extends Products_controller_firebase {
	constructor() {
		super("products");
	}
}

export default ProductsDaoFirebase;
