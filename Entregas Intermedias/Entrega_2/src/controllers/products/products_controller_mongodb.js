import fs from "fs";

export const Products_controller_mongodb = class Products_container {
	constructor(path) {
		this.path = path;
		this.products = [];
	}

	fileContentExist = async () => fs.existsSync(this.path);

	readFile = async () => JSON.parse(await fs.promises.readFile(this.path, "utf-8"));

	setProducts = async () => (this.products = await this.readFile());

	// RECIBE UN id Y ENCUENTRA EL indice DEL PRODUCTO
	findIndex = (id) => this.products.findIndex((product) => product.id == id);

	// RECIBE UN OBJETO CON title, price y thumbnail Y LO GUARDA
	save = async ({ title, price, thumbnail, description, stock }) => {
		if (await this.fileContentExist()) {
			try {
				let lastId, newId, new_product;
				lastId = !this.products.length ? 0 : this.products[this.products.length - 1].id;
				newId = lastId + 1;
				new_product = { title, price, thumbnail, id: newId, description, stock };
				this.products.push(new_product);
				await fs.promises.writeFile(this.path, JSON.stringify(this.products));
				return true;
			} catch (err) {
				console.log("save ERROR::: ", err);
				return { error: "Product not saved" };
			}
		} else console.log("File not found.");
	};

	// RETORNA TODOS LOS PRODUCTOS
	getAll = async () => {
		if (await this.fileContentExist()) {
			try {
				return this.products;
			} catch (err) {
				console.log("getAll ERROR::: ", err);
			}
		} else console.log("File not found.");
	};

	// RECIBE UN ID Y RETORNA EL PRODUCTO
	getById = async (id) => {
		if (await this.fileContentExist()) {
			try {
				let product = this.products.find((product) => product.id == id);
				if (product) return product;
				else return { error: "Product not found." };
			} catch (err) {
				console.log("getById ERROR::: ", err);
				return { error: "Error getting product." };
			}
		} else console.log("File not found.");
	};

	// RECIBE UN id POR params y UN OBJETO CON title, price y thumbnail Y ACTUALIZA EL PRODUCTO.
	updateById = async (id, { title, price, thumbnail, description, stock }) => {
		if (await this.fileContentExist()) {
			try {
				let index_to_update = this.findIndex(id);
				if (index_to_update >= 0) {
					const new_product = { id: +id, title, price, thumbnail, description, stock };
					this.products[index_to_update] = new_product;
					await fs.promises.writeFile(this.path, JSON.stringify(this.products));
					return true;
				} else return { error: "Product not found." };
			} catch (err) {
				console.log("updateById ERROR::: ", err);
				return { error: "Product not updated." };
			}
		} else console.log("File not found.");
	};

	// RECIBE UN id POR params Y ELIMINA EL PRODUCTO
	deleteById = async (id) => {
		if (await this.fileContentExist()) {
			try {
				let index_to_delete = this.findIndex(id);
				if (index_to_delete >= 0) {
					this.products.splice(index_to_delete, 1);
					await fs.promises.writeFile(this.path, JSON.stringify(this.products));
					return true;
				} else return { error: "Product not found." };
			} catch (err) {
				console.log("deleteById ERROR::: ", err);
				return { error: "Product not deleted." };
			}
		} else console.log("File not found.");
	};
};
