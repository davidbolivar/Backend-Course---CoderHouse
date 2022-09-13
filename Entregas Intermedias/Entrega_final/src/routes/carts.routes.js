import { Router } from "express";
import { cartsController } from "../controllers/carts.controller.js";
import { isAuthenticated } from "../middlewares/is-auth.middleware.js";
export const cartsRouter = new Router();

cartsRouter.post("/", isAuthenticated, cartsController.addProduct);
cartsRouter.get("/", isAuthenticated, cartsController.getProducts);
cartsRouter.delete("/:productId", isAuthenticated, cartsController.deleteProduct);
