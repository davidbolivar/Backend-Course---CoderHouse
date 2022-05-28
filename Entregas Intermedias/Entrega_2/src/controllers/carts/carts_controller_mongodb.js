import mongoose from "mongoose";
import config from "../../config.js";

await mongoose.connect(config.mongodb.cnxStr, config.mongodb.options);

import { productsDao } from "../../daos/products/index.js";

export const Carts_controller_mongodb = class Carts_container {
	constructor(collection, schema) {
		this.collection = mongoose.model(collection, schema);
	}

	// Crea un carrito
	create = async () => {
		try {
			let doc = await this.collection.create({ products: [] });
			return doc._id;
		} catch (err) {
			return { error: "Cart not saved" };
		}
	};

	// Trae todos los carritos
	getAll = async () => {
		try {
			const carts = await this.collection.find({});
			if (!carts) throw new Error("Carts not found");
			return carts;
		} catch (err) {
			return { error: err };
		}
	};

	// Trae un carrito por id
	getById = async (cart_id) => {
		try {
			const cart = await this.collection.findById(cart_id);
			if (!cart) throw new Error("Cart not found");
			return cart;
		} catch (err) {
			return { error: err };
		}
	};

	getProducts = async (cart_id) => {
		try {
			const cart = await this.collection.findById(cart_id);
			if (!cart) throw new Error("Cart not found");
			return cart.products;
		} catch (err) {
			return { error: err };
		}
	};

	addProduct = async (cart_id, product_id) => {
		try {
			const cart = await this.getById(cart_id);
			console.log("------------------");
			console.log(cart.products);

			if (!cart) throw new Error("Cart not found");
			const product = await productsDao.getById(product_id);
			if (!product) throw new Error("Product not found");

			const product_index = cart.products.findIndex((product) => product._id == product_id);
			console.log(product_index);
			if (product_index === -1) {
				delete product._doc.stock;
				await cart.products.push({ ...product._doc, quantity: 1, id: product_id });
				await cart.save();
			} else {
				console.log("ENTRÓ");
				if (product.stock < cart.products[product_index].quantity + 1) return { error: "Product out of stock" };

				console.log("PRODUCTO", cart.products[product_index]);

				await this.collection.findByIdAndUpdate(cart_id, { $inc: { [`products.${product_index}.quantity`]: 1 } });
				console.log("------------------");
			}

			return true;
		} catch (err) {
			return { error: err };
		}
	};

	//Delete product from cart
	deleteProduct = async (cart_id, product_id) => {
		try {
			const cart = await this.getById(cart_id);
			if (!cart) throw new Error("Cart not found");

			const product_index = cart.products.findIndex((product) => product._id == product_id);
			if (product_index === -1) throw new Error("Product not found");

			await this.collection.findByIdAndUpdate(cart_id, { $pull: { products: { id: product_id } } }, { safe: true, multi: true });
			return true;
		} catch (err) {
			return { error: err };
		}
	};

	clearProducts = async (cart_id) => {
		try {
			const cart = await this.getById(cart_id);
			if (!cart) throw new Error("Cart not found");

			await this.collection.findByIdAndUpdate(cart_id, { $set: { products: [] } });
			return true;
		} catch (err) {
			return { error: err };
		}
	};
};
