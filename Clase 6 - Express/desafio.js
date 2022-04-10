const express = require("express");
const app = express();
const fs = require("fs");

class Container {
	constructor(path) {
		this.path = path;
		this.products = [];
	}

	fileContentExist = async () => fs.existsSync(this.path);

	readFile = async () => JSON.parse(await fs.promises.readFile(this.path, "utf-8"));

	setProducts = async () => (this.products = await this.readFile());

	randomProduct = async () => {
		if (await this.fileContentExist()) {
			try {
				let ramdomIndex = Math.floor(Math.random() * this.products.length);
				return this.products[ramdomIndex];
			} catch (err) {
				console.log("getRandom ERROR::: ", err);
			}
		} else console.log("File not found");
	};

	getAll = async () => {
		if (await this.fileContentExist()) {
			try {
				return this.products;
			} catch (err) {
				console.log("getAll ERROR::: ", err);
			}
		} else console.log("File not found");
	};
}

const Container1 = new Container("products.txt");
(async () => await Container1.setProducts())();

app.get("/", (req, res) => {
	res.send("Raíz del servidor");
});

app.get("/products", async (req, res) => {
	res.json(await Container1.getAll());
});

app.get("/randomProduct", async (req, res) => {
	res.json(await Container1.randomProduct());
});

const PORT = 8080;
const server = app.listen(PORT, () => {
	console.log(`Servidor escuchando en el puerto ${server.address().port}`);
});

server.on("error", (error) => console.log(`Error en el servidor ${error}`));
