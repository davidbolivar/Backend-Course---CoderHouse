import knex from "knex";
import { mySqlConfig } from "../config/mysql2.js";
import faker from "faker";
faker.locale = "es";

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
		// Generar 5 productos aleatorios con faker
		let products = [];
		for (let i = 0; i < 5; i++) {
			products.push({
				title: faker.commerce.productName(),
				price: faker.commerce.price(),
				thumbnail: faker.image.imageUrl(),
			});
		}

		return products;
	};

	// delete(id) {
	// 	return this.knex.from("products").where("id", id).del();
	// }

	// stockUpdate(stock, id) {
	// 	return this.knex.from("products").where("id", id).update({ stock: stock });
	// }

	// close() {
	// 	this.knex.destroy();
	// }
}

export const Products_container = new Products(mySqlConfig);
