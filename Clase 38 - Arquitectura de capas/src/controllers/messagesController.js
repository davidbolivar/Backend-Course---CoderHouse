import knex from "knex";
import { sqliteConfig } from "../config/sqlite3.js";
import logger from "../../logs/logger.js";
import { io } from "../main.js";

class Messages {
	constructor(config) {
		this.knex = knex(config);
		this.messages = [];
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
			logger.error("Error al crear la tabla de mensajes: " + err);
		}
	}

	add = async (req, res) => {
		let message = req.body;
		console.log("MESSAGES LENGTH: ", this.messages.length);
		this.messages.push(message);
		console.log("MESSAGES LENGTH 2: ", this.messages.length);
		await this.knex("messages").insert([message]);
		io.emit("messages_list", this.messages);
		res.redirect("/");
	};

	getAll = async () => {
		let messages = await this.knex("messages").select("*");
		this.messages = messages;
		return messages;
	};

	// add = async (messages) => await this.knex("messages").insert(messages);

	// getAll = async () => {
	// 	let messages = await this.knex("messages").select("*");
	// 	// console.log(messages);
	// 	return messages;
	// };

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
