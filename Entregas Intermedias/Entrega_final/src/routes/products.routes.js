import { Router } from "express";
import { productsController } from "../controllers/products.controller.js";
import { isAdmin } from "../middlewares/is-admin.middleware.js";

export const productsRouter = new Router();

productsRouter.post("/", isAdmin, productsController.create);

productsRouter.get("/", productsController.getAll);
productsRouter.get("/:id", productsController.getById);
productsRouter.put("/:id", isAdmin, productsController.updateById);
productsRouter.delete("/:id", isAdmin, productsController.deleteById);
