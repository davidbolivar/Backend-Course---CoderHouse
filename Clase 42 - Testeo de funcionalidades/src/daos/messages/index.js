import config from "../../config.js";
import { sqliteConfig } from "../../config/sqlite3.js";
import MessagesDaoSqlite from "../../daos/messages/messages_sqlite_DAOS.js";

let messagesDao;

switch (config.messages_persistence) {
	case "sqlite":
		try {
			// const { default: MessagesDaoSqlite } = await import("./messages_sqlite_DAOS.js");
			messagesDao = new MessagesDaoSqlite(sqliteConfig);
			break;
		} catch (err) {
			console.log("Error al importar el DAO de mensajes: ", err);
		}

	default:
		console.log("No se ha definido una persistencia para los mensajes");
		break;
}

export { messagesDao };
