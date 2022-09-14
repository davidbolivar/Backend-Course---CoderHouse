import { Router } from "express";
import { ordersController } from "../controllers/orders.controller.js";
import { isAuthenticated } from "../middlewares/is-auth.middleware.js";

export const ordersRouter = new Router();

ordersRouter.post("/", isAuthenticated, ordersController.create);
ordersRouter.get("/", isAuthenticated, ordersController.getAll);
