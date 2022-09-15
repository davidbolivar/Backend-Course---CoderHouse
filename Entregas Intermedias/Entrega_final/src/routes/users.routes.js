import { Router } from "express";
import { usersController } from "../controllers/users.controller.js";

export const usersRouter = new Router();

usersRouter.post("/", usersController.create);
