import { Router } from "express";
import { infoController } from "../controllers/info.controller.js";

export const infoRouter = new Router();

infoRouter.get("/", infoController.serverInfo);
