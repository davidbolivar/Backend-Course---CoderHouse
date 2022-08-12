import axios from "axios";
import assert from "assert";

describe("Comportamiento del servidor", () => {
	describe("Comportamiento de peticiones GET", () => {
		describe("Si le pido todos los productos", () => {
			it("Devuelve una array de productos", async () => {
				const response = await axios.get("http://localhost:8080/products");
				const productos = response;
				assert.ok(productos);
			});
		});
	});

	describe("Comportamiento de peticiones POST", () => {
		describe("Si envío un producto", () => {
			it("Responde producto agregado", async () => {
				const data = {
					title: "Producto 5",
					price: 100,
					thumbnail: "https://cdn.fakercloud.com/avatars/bobbytwoshoes_128.jpg",
				};
				const productoAgregado = await axios.post("http://localhost:8080/products", data);
				assert.ok(productoAgregado);
			});
		});
	});

	describe("Comportamiento de peticiones PUT", () => {
		describe("Si envío un id por parametros, y un precio en el request body", () => {
			it("Agrega un producto", async () => {
				const data = {
					price: 100,
				};
				const productUpdated = await axios.put("http://localhost:8080/products/1", data);
				assert.ok(productUpdated);
			});
		});
	});

	describe("Comportamiento de peticiones DELETE", () => {
		describe("Si envío un id por parametros", () => {
			it("Borra un producto", async () => {
				const data = {
					price: 100,
				};
				const productUpdated = await axios.delete("http://localhost:8080/products/35", data);
				assert.ok(productUpdated);
			});
		});
	});
});
