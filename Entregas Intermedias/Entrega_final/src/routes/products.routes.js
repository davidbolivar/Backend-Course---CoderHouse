import { Router } from "express";
import { productsController } from "../controllers/products.controller.js";
import { isAuthenticated } from "../middlewares/is-auth.middleware.js";
import { isAdmin } from "../middlewares/is-admin.middleware.js";

export const productsRouter = new Router();

productsRouter.get("/", productsController.getAll);
productsRouter.get("/:id", productsController.getById);

productsRouter.post("/", isAuthenticated, isAdmin, productsController.create);
productsRouter.put("/:id", isAuthenticated, isAdmin, productsController.updateById);
productsRouter.delete("/:id", isAuthenticated, isAdmin, productsController.deleteById);
