import knex from "knex";
import { mySqlConfig } from "../config/mysql2.js";

class Products {
	constructor(config) {
		this.knex = knex(config);
		// this.products = [];
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
		}
	}

	add = async (products) => await this.knex("products").insert(products);

	getAll = async () => {
		let products = await this.knex("products").select("*");
		return products;
	};
	// borrarArticuloPorId(id) {
	// 	return this.knex.from("articulos").where("id", id).del();
	// }

	// actualizarStockPorId(stock, id) {
	// 	return this.knex.from("articulos").where("id", id).update({ stock: stock });
	// }

	close() {
		this.knex.destroy();
	}
}

export const Products_container = new Products(mySqlConfig);
