const { Router } = require("express");

const productsRouter = Router();

class Container {
	constructor() {
		this.products = [
			{ title: "Logitech MX Series Keyboard", price: 11000, thumbnail: "logitech_mx_keyboard.jpg", id: 1 },
			{ title: "Logitech MX Series Mouse", price: 5000, thumbnail: "logitech_mx_mouse.jpg", id: 2 },
			{ title: "Notebook ASUS X515 i7 20gb 1TB SSD", price: 185000, thumbnail: "asus_x515_i7.jpg", id: 3 },
		];
	}

	// RECIBE UN id Y ENCUENTRA EL indice DEL PRODUCTO
	findIndex = (id) => this.products.findIndex((product) => product.id == id);

	// RECIBE UN OBJETO CON title, price y thumbnail Y LO GUARDA
	save = async ({ title, price, thumbnail }) => {
		try {
			let lastId, newId, newProduct;
			lastId = !this.products.length ? 1 : this.products[this.products.length - 1].id;
			newId = lastId + 1;
			newProduct = { title, price, thumbnail, id: newId };
			this.products.push(newProduct);
			return newProduct;
		} catch (err) {
			console.log("save ERROR::: ", err);
		}
	};

	// RETORNA TODOS LOS PRODUCTOS
	getAll = async () => {
		try {
			return this.products;
		} catch (err) {
			console.log("getAll ERROR::: ", err);
		}
	};

	// RECIBE UN ID Y RETORNA EL PRODUCTO
	getById = async (id) => {
		try {
			let product = this.products.find((product) => product.id == id);
			if (product) return product;
			else return { error: "Product not found." };
		} catch (err) {
			console.log("getById ERROR::: ", err);
		}
	};

	// RECIBE UN id POR params y UN OBJETO CON title, price y thumbnail Y ACTUALIZA EL PRODUCTO.
	updateById = async (id, { title, price, thumbnail }) => {
		try {
			let indexToUpdate = this.findIndex(id);
			if (indexToUpdate >= 0) {
				const newProduct = { id: +id, title, price, thumbnail };
				this.products[indexToUpdate] = newProduct;
				return this.products;
			} else return { error: "Product not found." };
		} catch (err) {
			console.log("updateById ERROR::: ", err);
		}
	};

	// RECIBE UN id POR params Y ELIMINA EL PRODUCTO
	deleteById = async (id) => {
		try {
			let indexToDelete = this.findIndex(id);
			if (indexToDelete >= 0) {
				this.products.splice(indexToDelete, 1);
				return this.products;
			} else return { error: "Product not found." };
		} catch (err) {
			console.log("deleteById ERROR::: ", err);
		}
	};
}

const Container1 = new Container();

productsRouter.get("/", async (req, res) => {
	res.json(await Container1.getAll());
});

productsRouter.get("/:id", async (req, res) => {
	res.json(await Container1.getById(req.params.id));
});

productsRouter.post("/", async (req, res) => {
	res.json(await Container1.save(req.body));
});

productsRouter.put("/:id", async (req, res) => {
	res.json(await Container1.updateById(req.params.id, req.body));
});

productsRouter.delete("/:id", async (req, res) => {
	res.json(await Container1.deleteById(req.params.id));
});

exports.productsRouter = productsRouter;
