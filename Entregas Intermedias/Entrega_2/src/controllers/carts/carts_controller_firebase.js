export const Carts_controller_firebase = class Carts_container {
	constructor() {
		this.carts = [];
	}

	findIndex = (id) => this.carts.findIndex((cart) => cart.id == id);

	findProductIndex = (cart_id, product_id) => {
		let cart_index = this.findIndex(cart_id);
		let product_index = this.carts[cart_index].products.findIndex((product) => product.id == product_id);
		return product_index;
	};

	create = async () => {
		try {
			let last_id, new_id, new_cart;
			last_id = !this.carts.length ? 0 : this.carts[this.carts.length - 1].id;
			new_id = last_id + 1;
			new_cart = { id: new_id, products: [] };
			this.carts.push(new_cart);
			return { cart_id: new_cart.id };
		} catch (err) {
			console.log("create ERROR::: ", err);
			return { error: "Cart not created." };
		}
	};

	getProducts = async (cart_id) => {
		try {
			let cart = this.carts.find((cart) => cart.id == cart_id);
			if (cart) return cart.products;
			else return { error: "Cart not found." };
		} catch (err) {
			console.log("get ERROR::: ", err);
			return { error: "Error getting products." };
		}
	};

	get = async (cart_id) => {
		try {
			let cart = this.carts.find((cart) => cart.id == cart_id);
			if (cart) return cart;
			else return { error: "Cart not found." };
		} catch (err) {
			console.log("get ERROR::: ", err);
			return { error: "Error getting cart." };
		}
	};

	addProduct = async (cart_id, product_id) => {
		try {
			const product_to_add = await products_list.getById(product_id);
			let index_to_update = this.findIndex(cart_id);
			if (index_to_update >= 0 && product_to_add.id) {
				this.carts[index_to_update].products.push(product_to_add);
				return true;
			} else return { error: "Product or cart not exist" };
		} catch (err) {
			console.log("addProduct ERROR::: ", err);
			return { error: "Product not added." };
		}
	};

	deleteProduct = async (cart_id, product_id) => {
		try {
			let cart_index = this.findIndex(cart_id);
			let product_index = this.findProductIndex(cart_id, product_id);
			if (cart_index >= 0 && product_index >= 0) {
				this.carts[cart_index].products.splice(product_index, 1);
				return true;
			} else return { error: "Product or cart not exist" };
		} catch (err) {
			console.log("delete ERROR::: ", err);
			return { error: "Product not deleted." };
		}
	};

	clearProducts = async (cart_id) => {
		try {
			let cart_index = this.findIndex(cart_id);
			if (cart_index >= 0) {
				this.carts[cart_index].products = [];
				return true;
			} else return { error: "Cart not exist" };
		} catch (err) {
			console.log("delete ERROR::: ", err);
			return { error: "Cart not cleared." };
		}
	};
};
