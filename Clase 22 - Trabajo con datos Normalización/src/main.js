import express from "express";
import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
import exphbs from "express-handlebars";
import path from "path";
const __dirname = path.resolve();
import { Products_container } from "./controllers/productsController.js";
import { Messages_container } from "./controllers/messagesController.js";
import { normalize, denormalize, schema } from "normalizr";

await Products_container.createTable();
// await Messages_container.createTable();

const messages = await Messages_container.getAll();

// Definimos un esquema de usuarios (autores y comentadores)
const authorSchema = new schema.Entity("authors", {}, { idAttribute: "id" });
// Definimos un esquema de comentadores
// const textSchema = new schema.Entity("texts");
// Definimos un esquema de artículos
const messageSchema = new schema.Entity("messages", {
	author: authorSchema,
	// texts: [textSchema],
});

import util from "util";

function print(objeto) {
	console.log(util.inspect(objeto, false, 12, true));
}

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const handlebarsConfig = {
	defaultLayout: "index.handlebars",
};

app.engine("handlebars", exphbs(handlebarsConfig));

io.on("connection", async (socket) => {
	const products = await Products_container.getAll();
	console.log("Nuevo cliente conectado!");

	/* Envio los productos y mensajes al cliente que se conectó */
	socket.emit("products_list", products);
	socket.emit("messages", messages);

	app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));

	app.get("/api/products-test", (req, res) => {
		res.json(products);
	});

	app.post("/products", (req, res) => {
		products.push(req.body);
		Products_container.add([req.body]);

		io.sockets.emit("products_list", products);
		console.log(products);
		res.redirect("/");
	});

	app.post("/messages", async (req, res) => {
		messages.push(req.body);
		let object = await Messages_container.add(req.body);
		// console.log(object);
		console.log("-------------normalize---------------");
		let normalized = normalize(object, messageSchema);
		print(normalized);
		console.log("-------------denormalize---------------");
		console.log(denormalize(normalized.result, messageSchema, normalized.entities));

		io.sockets.emit("messages", normalized, messageSchema);
		// console.log(messages);
		res.redirect("/");
	});
});

const PORT = 8080;
const connectedServer = httpServer.listen(PORT, function () {
	console.log(`Servidor Http con Websockets escuchando en el puerto ${connectedServer.address().port}`);
});
connectedServer.on("error", (error) => console.log(`Error en servidor ${error}`));
