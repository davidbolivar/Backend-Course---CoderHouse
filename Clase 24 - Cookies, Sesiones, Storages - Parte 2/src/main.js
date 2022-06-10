import express from "express";
import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
import exphbs from "express-handlebars";
import { Products_container } from "./controllers/productsController.js";
import { Messages_container } from "./controllers/messagesController.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import path from "path";
const __dirname = path.resolve();

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

await Products_container.createTable();
await Messages_container.createTable();

const products = await Products_container.getAll();
const messages = await Messages_container.getAll();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const handlebarsConfig = {
	defaultLayout: "index.handlebars",
};
app.engine("handlebars", exphbs(handlebarsConfig));

app.use(
	session({
		store: MongoStore.create({
			//En Atlas connect App :  Make sure to change the node version to 2.2.12:
			mongoUrl: `mongodb+srv://davidbolivar:asd123@cluster0.lm0ks.mongodb.net/sessions?retryWrites=true&w=majority`,
			mongoOptions: {
				useNewUrlParser: true,
				useUnifiedTopology: true,
			},
		}),

		secret: "shhhhhhhhhhhhhhhhhhhhh",
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 60000,
		},
	})
);

io.on("connection", (socket) => {
	console.log("--------------------------");
	console.log("Nuevo cliente conectado!");

	/* Envio los productos y mensajes al cliente que se conectó */
	socket.emit("products_list", products);
	socket.emit("messages", messages);

	app.get("/", (req, res) => {
		console.log(req.session.email);
		// req.session.email = req.body.email;
		if (!req.session.email) res.redirect("/login");
		else res.json({ message: `Hola ${req.session.email}` });
	});

	app.get("/login", (req, res) => {
		res.json({ message: "Debes iniciar sesión." });
	});

	app.post("/login", (req, res) => {
		// console.log(req.query);
		if (!req.session.contador) {
			req.session.email = req.body.email;
			req.session.contador = 1;
			res.json({ message: `Bienvenido ${req.body.email}` });
		} else {
			req.session.contador++;
			res.send(`${req.session.email} ha visitado el sitio ${req.session.contador} veces.`);
		}

		// res.redirect("/");
	});

	app.get("/logout", (req, res) => {
		if (!req.session.email) res.json({ status: "No estabas logueado." });
		else {
			let email = req.session.email;
			req.session.destroy((err) => {
				if (!err) res.json({ status: `Has cerrado sesión ${email}. Redirigiendo al login...` });
				else res.json({ status: "ERROR al cerrar sesión", body: err });
			});
		}
	});

	app.post("/products", (req, res) => {
		products.push(req.body);
		Products_container.add([req.body]);
		io.sockets.emit("products_list", products);
		// console.log(products);
		res.redirect("/");
	});

	app.post("/products-test", (req, res) => {
		res.sendFile(__dirname + "/index.html");

		// Genero un nuevo producto
		const producto = {
			name: faker.commerce.productName(),
			price: faker.commerce.price(),
			image: faker.image.imageUrl(),
		};
	});

	app.post("/messages", (req, res) => {
		messages.push(req.body);
		Messages_container.add(req.body);
		io.sockets.emit("messages", messages);
		// console.log(messages);
		res.redirect("/");
	});

	app.use(express.static("public"));
});

const PORT = 8080;
const connectedServer = httpServer.listen(PORT, function () {
	console.log(`Servidor Http con Websockets escuchando en el puerto ${connectedServer.address().port}`);
});
connectedServer.on("error", (error) => console.log(`Error en servidor ${error}`));
