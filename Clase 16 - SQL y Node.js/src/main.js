import express from "express";
import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
import exphbs from "express-handlebars";
import { Products_container } from "./controllers/productsController.js";
import { Messages_container } from "./controllers/messagesController.js";
await Products_container.createTable();
await Messages_container.createTable();

const products = await Products_container.getAll();
const messages = await Messages_container.getAll();

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
node;

const handlebarsConfig = {
	defaultLayout: "index.handlebars",
};

app.engine("handlebars", exphbs(handlebarsConfig));

io.on("connection", (socket) => {
	console.log("Nuevo cliente conectado!");

	/* Envio los productos y mensajes al cliente que se conectó */
	socket.emit("products_list", products);
	socket.emit("messages", messages);

	app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));

	app.post("/products", (req, res) => {
		products.push(req.body);
		Products_container.add([req.body]);
		io.sockets.emit("products_list", products);
		console.log(products);
		res.redirect("/");
	});

	app.post("/messages", (req, res) => {
		messages.push(req.body);
		Messages_container.add(req.body);
		io.sockets.emit("messages", messages);
		console.log(messages);
		res.redirect("/");
	});
});

const PORT = 8080;
const connectedServer = httpServer.listen(PORT, function () {
	console.log(`Servidor Http con Websockets escuchando en el puerto ${connectedServer.address().port}`);
});
connectedServer.on("error", (error) => console.log(`Error en servidor ${error}`));
