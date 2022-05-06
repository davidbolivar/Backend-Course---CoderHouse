import { Router } from "express";
import { products_list } from "../server.js";
import { isAdmin } from "../middlewares/is_admin.js";

export const products_router = new Router();

products_router.get("/", async (req, res) => {
	res.json(await products_list.getAll());
});

products_router.get("/:id", async (req, res) => {
	let response = await products_list.getById(req.params.id);
	response.error ? res.status(400).json(response) : res.json(response);
});

products_router.post("/", isAdmin, async (req, res) => {
	let response = await products_list.save(req.body);
	response.error ? res.status(400).json(response) : res.status(200).send();
});

products_router.put("/:id", isAdmin, async (req, res) => {
	let response = products_list.updateById(req.params.id, req.body);
	response.error ? res.status(400).json(response) : res.status(200).send();
});

products_router.delete("/:id", isAdmin, async (req, res) => {
	let response = await products_list.deleteById(req.params.id);
	response.error ? res.status(400).json(response) : res.status(200).send();
});
