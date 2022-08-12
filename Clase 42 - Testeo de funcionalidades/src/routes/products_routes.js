import Router from "express";
import { Products_container } from "../controllers/products/productsController_mysql.js";

export const products_router = new Router();
products_router.post("/products", Products_container.add2);
products_router.get("/products", Products_container.getAll2);
products_router.put("/products/:id", Products_container.updatePrice);
products_router.delete("/products/:id", Products_container.delete);
products_router.delete("/products", Products_container.deleteAll);
