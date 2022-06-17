import knex from "knex";
import { sqliteConfig } from "../config/sqlite3.js";

class Messages {
	constructor(config) {
		this.knex = knex(config);
	}
	async createTable() {
		try {
			let table_exist = await this.knex.schema.hasTable("messages");
			// Si la tabla existe, retorna para terminar la función.
			if (table_exist) return;

			// Si no existe, la crea.
			return await this.knex.schema.createTable("messages", (table) => {
				table.increments("id").primary();
				table.string("name", 100).notNullable();
				table.string("message", 500).notNullable();
			});
		} catch (err) {
			console.log("createTable error: ", err);
		}
	}

	add = async (messages) => await this.knex("messages").insert(messages);

	getAll = async () => {
		let messages = await this.knex("messages").select("*");
		// console.log(messages);
		return messages;
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

export const Messages_container = new Messages(sqliteConfig);
