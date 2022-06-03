import { db, timeStamp } from "../config/firebase.js";

class Messages {
	constructor(collection) {
		this.collection = db.collection(collection);
	}
	// async createTable() {
	// 	try {
	// 		let table_exist = await this.knex.schema.hasTable("messages");
	// 		// Si la tabla existe, retorna para terminar la función.
	// 		if (table_exist) return;

	// 		// Si no existe, la crea.
	// 		return await this.knex.schema.createTable("messages", (table) => {
	// 			table.increments("id").primary();
	// 			table.string("name", 100).notNullable();
	// 			table.string("message", 500).notNullable();
	// 		});
	// 	} catch (err) {
	// 		console.log("createTable error: ", err);
	// 	}
	// }

	add = async ({ id, name, lastName, age, alias, avatar, text }) => {
		let message = {
			id,
			author: { id, name, lastName, age, alias, avatar },
			text,
		};
		await this.collection.add(message);
		return message;
	};

	getAll = async () => {
		let messages = await this.collection.get();
		let allMessages = messages.docs.map((doc) => {
			return { id: doc.id, ...doc.data() };
		});
		// console.log(allMessages);
		return allMessages;
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

export const Messages_container = new Messages("messages");
