import { Products_controller_local } from "../../controllers/products/products_controller_local.js";

class ProductsDaoLocal extends Products_controller_local {
	constructor(rutaDir) {
		super(`${rutaDir}/products.json`);
	}
}

export default ProductsDaoLocal;
