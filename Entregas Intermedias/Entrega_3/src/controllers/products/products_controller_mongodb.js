import mongoose from "mongoose";
import config from "../../config.js";
import logger from "../../../logs/logger.js";

await mongoose.connect(config.mongodb.cnxStr, config.mongodb.options);

export const Products_controller_mongodb = class Products_container {
	constructor(collection, schema) {
		this.collection = mongoose.model(collection, schema);
	}

	// Agrega un producto
	save = async (product) => {
		try {
			await this.collection.create(product);
			return true;
		} catch (err) {
			logger.error("Product not saved: ", err);
			return { error: "Product not saved" + err };
		}
	};

	getAll = async () => {
		try {
			const products = await this.collection.find({});
			if (!products) throw new Error("Products not found");
			return products;
		} catch (err) {
			logger.error("Products not found: ", err);
			return { error: "Products not found: " + err };
		}
	};

	getById = async (product_id) => {
		try {
			const product = await this.collection.findById(product_id);
			if (!product) throw new Error("Product not found");
			return product;
		} catch (err) {
			logger.error("Product not found: ", err);
			return { error: "Product not found: " + err };
		}
	};

	updateById = async (product_id, product) => {
		try {
			await this.collection.findByIdAndUpdate(product_id, product);
			return true;
		} catch (err) {
			logger.error("Product not updated: ", err);
			return { error: "Product not updated: " + err };
		}
	};

	deleteById = async (product_id) => {
		try {
			await this.collection.findByIdAndDelete(product_id);
			return true;
		} catch (err) {
			logger.error("Product not deleted: ", err);
			return { error: "Product not deleted: " + err };
		}
	};
	// -------------------------------------------------
	// TODO: Method for discount stock on create order
	// -------------------------------------------------
};
