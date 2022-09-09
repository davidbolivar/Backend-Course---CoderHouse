import NewProductModel from "../models/new-product.model.js";
import GetProductModel from "../models/get-product.model.js";
import { productsDao } from "../daos/products/index.js";

class Repository {
	#productsDao;
	#getProductModel;
	#newProductModel;

	constructor(productsDao, NewProductModel, GetProductModel) {
		this.#productsDao = productsDao;
		this.#newProductModel = NewProductModel;
		this.#getProductModel = GetProductModel;
	}

	// create = async (req, uuid) => {
	// 	try {
	// 		const newProduct = new this.#newProductModel(req.body);
	// 		const newProductDto = newProduct.dto;
	// 		console.log("PRODUCTO NUEVO", { ...newProductDto, uuid });
	// 		return await this.#productsDao.create({ ...newProductDto, id: uuid });
	// 	} catch (error) {
	// 		throw error;
	// 	}
	// };

	// getAll = async () => {
	// 	try {
	// 		const allProducts = await this.#productsDao.getAll();
	// 		const products = new this.#getProductModel(allProducts);
	// 		return products.allProductsDto;
	// 	} catch (error) {
	// 		throw error;
	// 	}
	// };

	// getById = async (req) => {
	// 	try {
	// 		const product = await this.#productsDao.getById(req.params.id);

	// 		if (!product)
	// 			throw {
	// 				message: "Producto no encontrado.",
	// 				code: "product_not_found",
	// 				status: 404,
	// 				expected: true,
	// 			};

	// 		const productDto = new this.#getProductModel(product);
	// 		return productDto.oneProductDto;
	// 	} catch (error) {
	// 		throw error;
	// 	}
	// };

	// updateById = async (req) => {
	// 	try {
	// 		return await this.#productsDao.updateById(req.params.id, req.body);
	// 	} catch (error) {
	// 		throw error;
	// 	}
	// };

	deleteById = async (req) => {
		try {
			return await this.#productsDao.deleteById(req.params.id);
		} catch (error) {
			throw error;
		}
	};
}

export const ProductsRepository = new Repository(productsDao, NewProductModel, GetProductModel);
