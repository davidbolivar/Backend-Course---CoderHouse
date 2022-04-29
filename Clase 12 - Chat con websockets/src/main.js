const express = require("express");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const exphbs = require("express-handlebars");

const products = [];
const messages = [];

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const handlebarsConfig = {
	defaultLayout: "index.handlebars",
};

app.engine("handlebars", exphbs(handlebarsConfig));
// app.set("view engine", "handlebars");
// app.set("views", "./views");

io.on("connection", (socket) => {
	console.log("Nuevo cliente conectado!");

	/* Envio los productos y mensajes al cliente que se conectó */
	socket.emit("products_list", products);
	socket.emit("messages", messages);

	app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));

	app.post("/products", (req, res) => {
		products.push(req.body);
		io.sockets.emit("products_list", products);
		console.log(products);
		res.redirect("/");
	});

	app.post("/messages", (req, res) => {
		messages.push(req.body);
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
