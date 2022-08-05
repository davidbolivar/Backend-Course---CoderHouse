import Router from "express";
import { Products_container } from "../controllers/products/productsController_mysql.js";

export const products_router = new Router();
products_router.post("/products", Products_container.add);
