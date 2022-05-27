import admin from "firebase-admin";
import { db, timeStamp } from "../../firebase_init.js";
import { productsDao } from "../../daos/products/index.js";
export const Carts_controller_firebase = class Carts_container {
	constructor(collection) {
		this.collection = db.collection(collection);
	}

	// RETORNA TODOS LOS CARRITOS
	// getAll = async () => {
	// 	try {
	// 		let carts = await this.collection.get();
	// 		let allCarts = carts.docs.map((doc) => doc.data());
	// 		console.log(allCarts);
	// 		return allCarts;
	// 	} catch (err) {
	// 		return { error: "Error getting carts" };
	// 	}
	// };

	// CREA UN CARRITO Y RETORNA EL ID
	create = async () => {
		try {
			let new_cart = await this.collection.add({ createAt: timeStamp, products: [] });
			return new_cart.id;
		} catch (err) {
			return { error: "cart not saved" };
		}
	};

	// TRAE EL CARRITO POR SU ID
	get = async (cart_id) => {
		try {
			let cart = await this.collection.doc(cart_id).get();
			if (cart.exists) return cart.data();
			else throw new Error("Cart not found");
		} catch (err) {
			return { error: "Error getting cart: " + err };
		}
	};

	// RECIBE UN ID DE CARRITO Y RETORNA LOS PRODUCTOS DEL CARRITO
	getProducts = async (cart_id) => {
		try {
			let cart = await this.collection.doc(cart_id).get();
			if (cart.exists) return cart.data().products;
			else throw new Error("Cart not found");
		} catch (err) {
			return { error: "Error getting cart: " + err };
		}
	};

	// AGREGA UN PRODUCTO AL CARRITO
	addProduct = async (cart_id, product_id) => {
		try {
			// Trae el producto desde la colección products
			let product = await productsDao.getById(product_id);

			// Trae los productos actuales del carrito a actualizar
			let cart_products = await this.getProducts(cart_id);

			// Encuentra el indice del producto en el carrito
			let product_index = cart_products.findIndex((product) => product.id === product_id);

			//Si el Producto NO ESTÁ en el carrito
			if (product_index === -1) {
				// Si el producto no está en el carrito, lo agrega con cantidada 1
				delete product.stock;

				await this.collection.doc(cart_id).update({
					products: admin.firestore.FieldValue.arrayUnion({ ...product, id: product_id, quantity: 1 }),
				});

				// Si el producto ESTÁ en el carrito
			} else {
				// Verifica que el producto tenga sufuciente stock
				if (product.stock < cart_products[product_index].quantity + 1) {
					throw new Error("Product out of stock");
				} else {
					// Elimina la propiedad stock antes de actualizar el carrito
					delete cart_products[product_index].stock;

					// Borra el producto del carrito
					await this.collection.doc(cart_id).update({
						products: admin.firestore.FieldValue.arrayRemove(cart_products[product_index]),
					});

					// Agrega el producto al carrito con la cantidad actualizada
					await this.collection.doc(cart_id).update({
						products: admin.firestore.FieldValue.arrayUnion({ ...cart_products[product_index], quantity: cart_products[product_index].quantity + 1 }),
					});
				}
			}
			return true;
		} catch (err) {
			return { error: "Error adding product: " + err };
		}
	};

	// RESTA CANTIDAD DE PRODUCTOS DEL CARRITO
	decrementProductQuantity = async (cart_id, product_id) => {
		try {
			// Trae los productos actuales del carrito a actualizar
			let cart_products = await this.getProducts(cart_id);

			// Encuentra el indice del producto en el carrito
			let product_index = cart_products.findIndex((product) => product.id === product_id);

			//Si el Producto NO ESTÁ en el carrito
			if (product_index === -1) {
				throw new Error("Product not found in cart");
				// Si el producto ESTÁ en el carrito
			} else {
				// Borra el producto del carrito
				await this.collection.doc(cart_id).update({
					products: admin.firestore.FieldValue.arrayRemove(cart_products[product_index]),
				});

				if (cart_products[product_index].quantity - 1 > 0) {
					await this.collection.doc(cart_id).update({
						products: admin.firestore.FieldValue.arrayUnion({ ...cart_products[product_index], quantity: cart_products[product_index].quantity - 1 }),
					});
				}
			}
			return true;
		} catch (err) {
			return { error: "Error decrementing product quantity" + err };
		}
	};

	// ELIMINA UN PRODUCTO AL CARRITO
	deleteProduct = async (cart_id, product_id) => {
		try {
			// Trae los productos actuales del carrito a actualizar
			let cart_products = await this.getProducts(cart_id);

			// Encuentra el indice del producto en el carrito
			let product_index = cart_products.findIndex((product) => product.id === product_id);

			//Si el Producto NO ESTÁ en el carrito
			if (product_index === -1) {
				throw new Error("Product not found in cart");
				// Si el producto ESTÁ en el carrito
			} else {
				// Borra el producto del carrito
				await this.collection.doc(cart_id).update({
					products: admin.firestore.FieldValue.arrayRemove(cart_products[product_index]),
				});
			}
			return true;
		} catch (err) {
			return { error: "Error deleting product: " + err };
		}
	};

	// ELIMINA TODOS LOS PRODUCTOS DE UN CARRITO
	clearProducts = async (cart_id) => {
		try {
			await this.collection.doc(cart_id).update({ products: [] });
			return true;
		} catch (err) {
			return { error: "Error clearing products: " + err };
		}
	};
};
