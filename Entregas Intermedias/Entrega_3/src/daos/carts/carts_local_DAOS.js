import { Carts_controller_local } from "../../controllers/carts/carts_controller_local.js";

class CartsDaoLocal extends Carts_controller_local {
	constructor(rutaDir) {
		super(`${rutaDir}/carts.json`);
	}
}

export default CartsDaoLocal;
