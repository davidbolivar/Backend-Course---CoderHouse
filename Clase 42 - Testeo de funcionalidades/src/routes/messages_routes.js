import Router from "express";
// import { Messages_container } from "../controllers/messages/messagesController_sqlite.js";
import { messagesDao } from "../daos/messages/index.js";
export const messages_router = new Router();
try {
	messages_router.post("/messages", messagesDao.add);
} catch (error) {
	console.log(error);
}
