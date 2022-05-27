import admin from "firebase-admin";
import config from "../../config.js";

admin.initializeApp({
	credential: admin.credential.cert(config.firebase),
});

const db = admin.firestore();

export const Products_controller_firebase = class Products_container {
	constructor(collection) {
		this.collection = db.collection(collection);
		this.products = [];
	}

	setProducts = async () => await this.getAll();

	// Agrega un producto
	addProduct = async (product) => {
		try {
			await this.collection.add(product);
			return true;
		} catch (err) {
			console.log("add ERROR::: ", err);
			return { error: "Product not added" };
		}
	};

	// RETORNA TODOS LOS PRODUCTOS
	getAll = async () => {
		try {
			let products = await this.collection.get();
			let allProducts = products.docs.map((doc) => doc.data());
			this.products = allProducts;
			console.log(this.products);
			return this.products;
		} catch (err) {
			console.log("getAll ERROR::: ", err);
			return { error: "Error getting products" };
		}
	};
};
