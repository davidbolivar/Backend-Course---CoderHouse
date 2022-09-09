import express from "express";
import { productsRouter } from "./routes/products.routes.js";
import dotenv from "dotenv";
import logger from "../logs/logger.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productsRouter);

app.all("*", (req, res) => {
	res.status(404).json({ error: "404 Not Found", method: req.method, route: req.url });
});

const server = app.listen(process.env.PORT || process.env.SERVER_PORT, () => {
	logger.info(`Server listening on port ${server.address().port}`);
});

server.on("error", (error) => logger.error(`Server error: ${error}`));
