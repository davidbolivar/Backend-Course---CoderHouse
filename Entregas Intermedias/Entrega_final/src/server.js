import express from "express";
import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";
import exphbs from "express-handlebars";
// Other imports --------------------------------------
import { productsRouter, cartsRouter, usersRouter, loginRouter, ordersRouter, imagesRouter, chatsRouter, infoRouter } from "./routes/index.js";
import logger from "../logs/logger.js";
import config from "./config.js";

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

dotenv.config();

// Mongo Atlas Connection -----------------------------
if (config.persistence === "mongodb") {
	mongoose.connect(config.mongodb.connectionString, config.mongodb.options);
}

// Middlewares ----------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handlebars -----------------------------------------
app.set("views", dirname(fileURLToPath(import.meta.url)) + "/views");
const hbs = exphbs.create({
	defaultLayout: "index",
	layoutsDir: join(app.get("views"), "layouts"),
	partialsDir: join(app.get("views"), "partials"),
	extname: ".handlebars",
});
app.engine(".handlebars", hbs.engine);
app.set("view engine", ".handlebars");

// socket.io -----------------------------------------
const chatMessages = [];
io.on("connection", (socket) => {
	socket.emit("messages", chatMessages);

	socket.on("message", (data) => {
		data.date = new Date().toLocaleString();
		chatMessages.push(data);
		io.emit("messages", chatMessages);
	});
});

// Routes -----------------------------------------
app.use("/", chatsRouter);
app.use("/login", loginRouter);
app.use("/api/products", productsRouter);
app.use("/api/shoppingcartproducts", cartsRouter);
app.use("/api/users", usersRouter);
app.use("/api/orders", ordersRouter);
app.use("/info", infoRouter);

app.use(express.static("public"));
app.use("/api/images", imagesRouter);

app.all("*", (req, res) => {
	res.status(404).json({ error: "404 Not Found", method: req.method, route: req.url });
});

// Server --------------------------------------------
const server = httpServer.listen(process.env.PORT || 8080, () => {
	logger.info(`Server listening on port ${server.address().port}`);
});

server.on("error", (error) => logger.error(`Server error: ${error}`));
