import express from "express";

// ROUTES
import { products_router } from "./routes/products_routes.js";
import { Products_controller } from "./controllers/products_controller.js";

// CONTROLLERS
import { carts_router } from "./routes/carts_routes.js";
import { Carts_controller } from "./controllers/carts_controller.js";

const app = express();
app.use(express.json());

export const products_list = new Products_controller("./databases/products.json");
await products_list.setProducts();

export const carts_list = new Carts_controller("./databases/carts.json");
await carts_list.setCarts();

app.use("/api/products", products_router);
app.use("/api/carts", carts_router);

app.all("*", (req, res) => {
	res.json({ error: "404 Not Found", method: req.method });
});

const PORT = 8080;
const server = app.listen(PORT, () => {
	console.log(`Servidor escuchando en el puerto ${server.address().port}`);
});

server.on("error", (error) => console.log(`Error en el servidor ${error}`));
