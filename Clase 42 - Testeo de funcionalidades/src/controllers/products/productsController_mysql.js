import knex from "knex";
import { mySqlConfig } from "../../config/mysql2.js";
import logger from "../../../logs/logger.js";
import { io } from "../../main.js";

class Products {
	constructor(config) {
		this.knex = knex(config);
		this.products = [];
	}
	async createTable() {
		try {
			let table_exist = await this.knex.schema.hasTable("products");
			// Si la tabla existe, retorna para terminar la función.
			if (table_exist) return;

			// Si no existe, la crea.
			return await this.knex.schema.createTable("products", (table) => {
				table.increments("id").primary();
				table.string("title", 100).notNullable();
				table.float("price").notNullable();
				table.string("thumbnail", 200).notNullable();
			});
		} catch (err) {
			console.log("createTable error: ", err);
			logger.error("Error al crear la tabla de productos: " + err);
		}
	}

	add = async (req, res) => {
		let product = req.body;
		console.log("PRODUCTS LENGTH: ", this.products.length);
		this.products.push(product);
		console.log("PRODUCTS LENGTH 2: ", this.products.length);
		await this.knex("products").insert([product]);
		io.emit("products_list", this.products);
		res.redirect("/");
	};

	add2 = async (req, res) => {
		let product = req.body;
		// console.log("PRODUCTS LENGTH: ", this.products.length);
		this.products.push(product);
		// console.log("PRODUCTS LENGTH 2: ", this.products.length);
		await this.knex("products").insert([product]);
		res.status(200).json({ message: "Producto agregado" });
	};

	getAll = async () => {
		let products = await this.knex("products").select("*");
		this.products = products;
		return products;
	};

	getAll2 = async (req, res) => {
		let products = await this.knex("products").select("*");
		this.products = products;
		res.status(200).json(products);
	};

	// delete(id) {
	// 	return this.knex.from("products").where("id", id).del();
	// }

	// stockUpdate(stock, id) {
	// 	return this.knex.from("products").where("id", id).update({ stock: stock });
	// }

	updatePrice = async (req, res) => {
		let id = req.params.id;
		let price = req.body.price;
		await this.knex("products").where("id", id).update({ price });
		res.status(200).json({ message: "Precio actualizado" });
	};

	delete = async (req, res) => {
		let id = req.params.id;
		await this.knex("products").where("id", id).del();
		res.status(200).json({ message: "Producto eliminado" });
	};

	deleteAll = async (req, res) => {
		// delete all products
		await this.knex("products").del();
		res.status(200).json({ message: "Todos los productos eliminados" });
	};

	// close() {
	// 	this.knex.destroy();
	// }
}

export const Products_container = new Products(mySqlConfig);
