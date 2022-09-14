import express from "express";
import { productsRouter } from "./routes/products.routes.js";
import { cartsRouter } from "./routes/carts.routes.js";
import { usersRouter } from "./routes/users.routes.js";
import { loginRouter } from "./routes/login.routes.js";
import { ordersRouter } from "./routes/orders.routes.js";
import dotenv from "dotenv";
import logger from "../logs/logger.js";
import config from "./config.js";
import mongoose from "mongoose";
import multer from "multer";
import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
import { engine } from "express-handlebars";

dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.json());
app.use(express.static("public/"));
app.use(express.urlencoded({ extended: true }));

const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.engine(
	"handlebars",
	engine({
		defaultLayout: "index.html",
	})
);

io.on("connection", (socket) => {
	app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));
	console.log("Nuevo cliente conectado!");
});

const upload = multer({
	storage: multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, "public/images");
		},
		filename: (req, file, cb) => {
			const extension = file.mimetype.split("/")[1];
			cb(null, `${file.fieldname}-${Date.now()}.${extension}`);
		},
	}),
	fileFilter: (req, file, cb) => {
		const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
		if (allowedMimeTypes.includes(file.mimetype)) {
			cb(null, true);
		} else {
			cb(null, false);
		}
	},
});

// TODO: VER SI ESTO QUEDA AQUÍ O NO
if (config.persistence === "mongodb") {
	mongoose.connect(config.mongodb.connectionString, config.mongodb.options);
}

app.use("/login", loginRouter);

app.use("/api/products", productsRouter);
app.use("/api/shoppingcartproducts", cartsRouter);
app.use("/api/users", usersRouter);
app.use("/api/orders", ordersRouter);

app.post("/api/images", upload.single("image"), (req, res) => {
	res.status(200).json({ status: 200, code: "upload_success", public_url: `http://localhost:${PORT}/images/${req.file.filename}` });
});

app.all("*", (req, res) => {
	res.status(404).json({ error: "404 Not Found", method: req.method, route: req.url });
});

const server = httpServer.listen(process.env.PORT || PORT, () => {
	logger.info(`Server listening on port ${server.address().port}`);
});

server.on("error", (error) => logger.error(`Server error: ${error}`));
