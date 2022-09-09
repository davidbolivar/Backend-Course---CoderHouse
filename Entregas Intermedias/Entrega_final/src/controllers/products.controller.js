import { productsService } from "../services/products.service.js";

class Controller {
	constructor() {}

	create = async (req, res) => {
		try {
			const product = await productsService.create(req);
			res.status(201).json(product);
		} catch (error) {
			res.status(error.status).json(error);
		}
	};

	getAll = async (req, res) => {
		try {
			const products = await productsService.getAll();
			res.status(201).json(products);
		} catch (error) {
			res.status(error.status).json(error);
		}
	};

	getById = async (req, res) => {
		try {
			const product = await productsService.getById(req);
			res.status(201).json(product);
		} catch (error) {
			res.status(error.status).json(error);
		}
	};

	updateById = async (req, res) => {
		try {
			const updatedProduct = await productsService.updateById(req);
			res.status(201).json(updatedProduct);
		} catch (error) {
			res.status(error.status).json(error);
		}
	};

	deleteById = async (req, res) => {
		try {
			await productsService.deleteById(req);
			res.status(204).json();
		} catch (error) {
			console.log({ error });
			res.status(error.status).json(error);
		}
	};
	// -------------------------------------------------
	// TODO: Method for discount stock on create order
	// -------------------------------------------------
}

export const productsController = new Controller();
