import { json, Router } from "express";
import { cartsDao } from "../daos/carts/index.js";
import { isAuthenticated } from "../middlewares/is_authenticated.js";
import { isAdmin } from "../middlewares/is_admin.js";

export const carts_router = new Router();

carts_router.get("/", isAdmin, async (req, res) => {
	let response = await cartsDao.getAll();
	response.error ? res.status(400).json(response) : res.status(200).json(response);
});

carts_router.post("/", isAuthenticated, async (req, res) => {
	let cart_id = await cartsDao.findByUserId(req.user._id);
	if (!cart_id) res.status(201).json({ cart_id: await cartsDao.create() });
	else res.status(200).json({ message: "Carts already exists.", cart_id: cart_id });
});

carts_router.post("/:cart_id/products", isAuthenticated, async (req, res) => {
	let response = await cartsDao.addProduct(req.params.cart_id, req.body.product_id);
	response.error ? res.status(400).json(response) : res.status(201).send();
});

carts_router.get("/:cart_id/products", isAuthenticated, async (req, res) => {
	let response = await cartsDao.getProducts(req.params.cart_id);
	response.error ? res.status(400).json(response) : res.status(200).json(response);
});

carts_router.delete("/:cart_id/products/:product_id", isAuthenticated, async (req, res) => {
	let response = await cartsDao.deleteProduct(req.params.cart_id, req.params.product_id);
	response.error ? res.status(400).json(response) : res.status(200).send();
});

carts_router.delete("/:cart_id", isAuthenticated, async (req, res) => {
	let response = await cartsDao.clearProducts(req.params.cart_id);
	response.error ? res.status(400).json(response) : res.status(200).send();
});

carts_router.post("/:cart_id/create_order", isAuthenticated, async (req, res) => {
	try {
		let order = await cartsDao.createOrder(req.params.cart_id, req.user);
		if (order) await cartsDao.clearProducts(req.params.cart_id);
		// TODO: Discount stock from products
		res.status(201).send();
	} catch (err) {
		res.status(400).json({ error: err });
	}
});
