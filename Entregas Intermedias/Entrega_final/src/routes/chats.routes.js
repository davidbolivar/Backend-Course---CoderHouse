import { Router } from "express";
import { chatsController } from "../controllers/chats.controller.js";

export const chatsRouter = new Router();

chatsRouter.get("/", chatsController.show);
