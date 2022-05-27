import { Router } from "express";
import { cartsDao } from "../daos/carts/index.js";

export const carts_router = new Router();

carts_router.post("/", async (req, res) => {
	res.json(await cartsDao.create());
});

carts_router.post("/:cart_id/products", async (req, res) => {
	let response = await cartsDao.addProduct(req.params.cart_id, req.body.product_id);
	response.error ? res.status(400).json(response) : res.status(200).send();
});

carts_router.get("/:cart_id/products", async (req, res) => {
	let response = await cartsDao.getProducts(req.params.cart_id);
	response.error ? res.status(400).json(response) : res.status(200).json(response);
});

carts_router.delete("/:cart_id/products/:product_id", async (req, res) => {
	let response = await cartsDao.deleteProduct(req.params.cart_id, req.params.product_id);
	response.error ? res.status(400).json(response) : res.status(200).send();
});

carts_router.delete("/:cart_id", async (req, res) => {
	let response = await cartsDao.clearProducts(req.params.cart_id);
	response.error ? res.status(400).json(response) : res.status(200).send();
});
