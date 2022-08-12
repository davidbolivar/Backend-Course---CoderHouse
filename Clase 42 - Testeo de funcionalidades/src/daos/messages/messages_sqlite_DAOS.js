import { Messages_container } from "../../controllers/messages/messagesController_sqlite.js";
class MessagesDaoSqlite extends Messages_container {
	constructor(config) {
		super(config);
	}
}
export default MessagesDaoSqlite;
