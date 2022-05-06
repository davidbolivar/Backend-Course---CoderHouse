import { Router } from "express";
import { carts_list } from "../server.js";

export const carts_router = new Router();

carts_router.post("/", async (req, res) => {
	res.json(await carts_list.create());
});

carts_router.post("/:cart_id/products", async (req, res) => {
	let response = await carts_list.addProduct(req.params.cart_id, req.body.product_id);
	response.error ? res.status(400).json(response) : res.status(200).send();
});

carts_router.get("/:cart_id/products", async (req, res) => {
	let response = await carts_list.getProducts(req.params.cart_id);
	response.error ? res.status(400).json(response) : res.status(200).json(response);
});

carts_router.delete("/:cart_id/products/:product_id", async (req, res) => {
	let response = await carts_list.deleteProduct(req.params.cart_id, req.params.product_id);
	response.error ? res.status(400).json(response) : res.status(200).send();
});

carts_router.delete("/:cart_id", async (req, res) => {
	let response = await carts_list.clearProducts(req.params.cart_id);
	response.error ? res.status(400).json(response) : res.status(200).send();
});
