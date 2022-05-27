import admin from "firebase-admin";
import config from "../../config.js";

admin.initializeApp({
	credential: admin.credential.cert(config.firebase),
});

const db = admin.firestore();

export const Products_controller_firebase = class Products_container {
	constructor(collection) {
		this.collection = db.collection(collection);
	}

	setProducts = async () => await this.getAll();

	// Agrega un producto
	save = async (product) => {
		try {
			let new_product = product;
			await this.collection.add(new_product);
			return true;
		} catch (err) {
			return { error: "Product not saved" };
		}
	};

	// RETORNA TODOS LOS PRODUCTOS
	getAll = async () => {
		try {
			let products = await this.collection.get();
			let allProducts = products.docs.map((doc) => doc.data());
			console.log(allProducts);
			return allProducts;
		} catch (err) {
			return { error: "Error getting products" };
		}
	};
	// RECIBE UN ID Y RETORNA EL PRODUCTO
	getById = async (id) => {
		try {
			let product = await this.collection.doc(id).get();
			if (product.exists) return product.data();
			else throw new Error("Product not found");
		} catch (err) {
			return { error: "Error getting product: " + err };
		}
	};

	// ACTUALIZA UN PRODUCTO POR SU ID
	updateById = async (id, products) => {
		try {
			await this.collection.doc(id).update(products);
			return true;
		} catch (err) {
			return { error: "Product not updated" };
		}
	};

	// ELIMINA UN PRODUCTO POR SU ID
	deleteById = async (id) => {
		try {
			await this.collection.doc(id).delete();
			return true;
		} catch (err) {
			return { error: "Product not deleted" };
		}
	};
};
