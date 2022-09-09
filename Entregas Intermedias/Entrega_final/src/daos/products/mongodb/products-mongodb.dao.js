class ProductsDaoMongodb {
	#mongooseProductSchema;

	constructor(mongooseProductSchema) {
		this.#mongooseProductSchema = mongooseProductSchema;
	}

	create = async (product) => {
		try {
			const newProduct = new this.#mongooseProductSchema(product);
			console.log({ newProduct });

			return await this.#mongooseProductSchema.create(newProduct);
		} catch (error) {
			throw error;
		}
	};

	getAll = async () => {
		try {
			return await this.#mongooseProductSchema.find();
		} catch (error) {
			throw error;
		}
	};

	getById = async (productId) => {
		try {
			return await this.#mongooseProductSchema.findOne({ id: productId });
		} catch (error) {
			throw error;
		}
	};

	updateById = async (productId, productData) => {
		try {
			return await this.#mongooseProductSchema.findOneAndUpdate({ id: productId }, productData, { new: true });
		} catch (error) {
			throw error;
		}
	};

	deleteById = async (productId) => {
		try {
			return await this.#mongooseProductSchema.findOneAndDelete({ id: productId });
		} catch (error) {
			throw error;
		}
	};
}

export default ProductsDaoMongodb;
