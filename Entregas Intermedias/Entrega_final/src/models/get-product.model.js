// TODO: HAY QUE MOSTRAR LOS ERRORES Y GUARDARLOS CON show_error() Y write_error()

export default class GetProductModel {
	constructor(products) {
		this.products = products;
	}

	get allProductsDto() {
		const products = this.products.map((product) => {
			const { title, description, thumbnail, price, stock, id } = product;
			return { id, title, description, thumbnail, price, stock };
		});
		return JSON.parse(JSON.stringify(products));
	}

	get oneProductDto() {
		const { title, description, thumbnail, price, stock, id } = this.products;
		const product = { id, title, description, thumbnail, price, stock };
		return JSON.parse(JSON.stringify(product));
	}
}
