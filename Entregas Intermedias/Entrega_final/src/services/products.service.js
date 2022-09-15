import logger from "../../logs/logger.js";
import ProductModel from "../models/product.model.js";
import GetProductModel from "../models/get-product.model.js";
import { productsDao } from "../daos/products/index.js";

// ------------------------------------------------------------
// TODO: SACAR UUID DE AQUÍ Y HACERLO EN EL MODELO DE PRODUCTOS
// ------------------------------------------------------------
import { idGenerator } from "../utils.js";
// ------------------------------------------------------------

class ProductsService {
	#productsDao;
	#getProductModel;
	#newProductModel;
	#idGenerator;

	constructor(productsDao, ProductModel, GetProductModel, idGenerator) {
		this.#productsDao = productsDao;
		this.#newProductModel = ProductModel;
		this.#getProductModel = GetProductModel;
		this.#idGenerator = idGenerator;
	}

	create = async (req) => {
		try {
			const newProduct = new this.#newProductModel(this.#idGenerator, req.body);
			const newProductDto = newProduct.dto;
			return await this.#productsDao.create(newProductDto);
		} catch (error) {
			logger.error(error);
			if (!error.expected)
				error = {
					message: "Error al crear nuevo producto.",
					code: "post_new_product_error",
					status: 500,
				};

			delete error.expected;
			throw error;
		}
	};

	getAll = async () => {
		try {
			const allProducts = await this.#productsDao.getAll();
			const products = new this.#getProductModel(allProducts);
			return products.allProductsDto;
		} catch (error) {
			logger.error(error);
			if (!error.expected)
				error = {
					message: "Error al obtener todos los productos.",
					code: "get_all_products_error",
					status: 500,
				};

			delete error.expected;
			throw error;
		}
	};

	getById = async (req) => {
		try {
			const product = await this.#productsDao.getById(req.params.id);

			if (!product)
				throw {
					message: "Producto no encontrado.",
					code: "product_not_found",
					status: 404,
					expected: true,
				};
			const productDto = new this.#getProductModel(product);
			return productDto.oneProductDto;
		} catch (error) {
			logger.error(error);
			if (!error.expected)
				error = {
					message: "Error al obtener producto por id.",
					code: "get_product_by_id_error",
					status: 500,
				};

			delete error.expected;
			throw error;
		}
	};

	updateById = async (req) => {
		try {
			const product = await this.#productsDao.getById(req.params.id);
			if (!product)
				throw {
					message: "Producto no encontrado.",
					code: "product_not_found",
					status: 404,
					expected: true,
				};
			return await this.#productsDao.updateById(req.params.id, req.body);
		} catch (error) {
			logger.error(error);
			if (!error.expected)
				error = {
					message: "Error al actualizar producto.",
					code: "update_product_by_id_error",
					status: 500,
				};

			delete error.expected;
			throw error;
		}
	};

	deleteById = async (req) => {
		try {
			const product = await this.#productsDao.getById(req.params.id);
			if (!product)
				throw {
					message: "Producto no encontrado.",
					code: "product_not_found",
					status: 404,
					expected: true,
				};
			return await this.#productsDao.deleteById(req.params.id);
		} catch (error) {
			logger.error(error);
			if (!error.expected)
				error = {
					message: "Error al eliminar producto por id.",
					code: "delete_product_by_id_error",
					status: 500,
				};

			delete error.expected;
			throw error;
		}
	};
}

export const productsService = new ProductsService(productsDao, ProductModel, GetProductModel, idGenerator);
