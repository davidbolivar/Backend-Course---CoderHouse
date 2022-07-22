import { Router } from "express";
import { productsDao } from "../daos/products/index.js";
import { isAdmin } from "../middlewares/is_admin.js";

export const products_router = new Router();

products_router.get("/", async (req, res) => {
	res.json(await productsDao.getAll());
});

products_router.get("/:id", async (req, res) => {
	let response = await productsDao.getById(req.params.id);
	response.error ? res.status(400).json(response) : res.status(200).json(response);
});

products_router.post("/", isAdmin, async (req, res) => {
	let response = await productsDao.save(req.body);
	response.error ? res.status(400).json(response) : res.status(200).send();
});

products_router.put("/:id", isAdmin, async (req, res) => {
	let response = productsDao.updateById(req.params.id, req.body);
	response.error ? res.status(400).json(response) : res.status(200).send();
});

products_router.delete("/:id", isAdmin, async (req, res) => {
	let response = await productsDao.deleteById(req.params.id);
	response.error ? res.status(400).json(response) : res.status(200).send();
});
