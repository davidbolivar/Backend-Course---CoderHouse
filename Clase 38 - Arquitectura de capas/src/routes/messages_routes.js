import Router from "express";
import { Messages_container } from "../controllers/messagesController.js";

export const messages_router = new Router();
messages_router.post("/messages", Messages_container.add);
