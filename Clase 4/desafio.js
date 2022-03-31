const fs = require("fs");

class Container {
	constructor(path) {
		this.path = path;
		this.products = [];
	}

	fileContentExist = async () => fs.existsSync(this.path);

	readFile = async () => JSON.parse(await fs.promises.readFile(this.path, "utf-8"));

	writeFile = async () => await fs.promises.writeFile(this.path, JSON.stringify(this.products));

	save = async (title, price, thumbnail) => {
		if (await this.fileContentExist()) {
			let fileContent, lastId;
			try {
				fileContent = await this.readFile();

				lastId = !fileContent.length ? 1 : fileContent[fileContent.length - 1].id;

				this.products = [...fileContent, { title, price, thumbnail, id: lastId++ }];
				await this.writeFile();

				console.log("Product saved");

				return lastId++;
			} catch (err) {
				console.log("save ERROR::: ", err);
			}
		} else console.log("File not found");
	};

	getById = async (productId) => {
		if (await this.fileContentExist()) {
			try {
				let fileContent = await this.readFile();
				let product = fileContent.find((product) => product.id === productId);

				if (product) return product;
				else return null;
			} catch (err) {
				console.log("getById ERROR::: ", err);
			}
		} else console.log("File not found");
	};

	getAll = async () => {
		if (await this.fileContentExist()) {
			try {
				let fileContent = await this.readFile();
				return fileContent;
			} catch (err) {
				console.log("getAll ERROR::: ", err);
			}
		} else console.log("File not found");
	};

	deleteById = async (productId) => {
		if (await this.fileContentExist()) {
			try {
				let fileContent = await this.readFile();
				let indexToDelete = fileContent.findIndex((product) => product.id === productId);
				if (indexToDelete) {
					fileContent.splice(indexToDelete, 1);
					this.products = [...fileContent];
					await this.writeFile();
					console.log("Deleted product.");
				} else console.log("product not found.");
			} catch (err) {
				console.log("deleteById ERROR::: ", err);
			}
		} else console.log("File not found");
	};

	deleteAll = async () => {
		if (await this.fileContentExist()) {
			try {
				this.products = [];
				await this.writeFile();
				console.log("All products deleted...");
			} catch (err) {
				console.log("deleteAll ERROR::: ", err);
			}
		} else console.log("File not found");
	};
}

const start = async () => {
	const Container1 = new Container("products.txt");
	console.log("Original products => ", await Container1.readFile());
	await Container1.save("Logitech MX Series Keyboard", 11000, "logitech_mx_keyboard.jpg");
	console.log(await Container1.getById(1));
	console.log("Products => ", await Container1.getAll());
	await Container1.deleteById(4);
	await Container1.deleteAll();
};

start();
