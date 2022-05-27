import express from "express";
import { products_router } from "./routes/products_routes.js";
import { carts_router } from "./routes/carts_routes.js";
const app = express();
app.use(express.json());

app.use("/api/products", products_router);
app.use("/api/carts", carts_router);

app.all("*", (req, res) => {
	res.json({ error: "404 Not Found", method: req.method });
});

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
	console.log(`Servidor escuchando en el puerto ${server.address().port}`);
});

server.on("error", (error) => console.log(`Error en el servidor ${error}`));
