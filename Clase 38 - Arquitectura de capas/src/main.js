import express from "express";
import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
import exphbs from "express-handlebars";
import { Products_container } from "./controllers/productsController.js";
import { Messages_container } from "./controllers/messagesController.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongodbConfig from "./config/mongodb.js";
import conectarDB from "./controllers/mongodbController.js";
import passport from "passport";
import parse from "yargs/yargs";
import path from "path";
import cluster from "cluster"; /* https://nodejs.org/dist/latest-v14.x/docs/api/cluster.html */
import os from "os";
import { login_router, register_router, fail_router, products_router, messages_router } from "./routes/index.js";
import { checkAuthentication } from "./middlewares/checkAuthentication.js";

const numCPUs = os.cpus().length;
const yargs = parse(process.argv.slice(2));
const { port, mode, _ } = yargs
	.boolean("debug")
	.alias({
		m: "mode",
		p: "port",
		// d: 'debug'
	})
	.default({
		mode: "FORK",
		port: 8080,
		// debug: false
	}).argv;

/* MASTER ---------------------------------------*/
if (mode === "CLUSTER" && cluster.isPrimary) cluster_mode();

function cluster_mode() {
	console.log(numCPUs);
	console.log(`PID MASTER ${process.pid}`);

	for (let i = 0; i < numCPUs; i++) {
		cluster.fork();
	}

	cluster.on("exit", (worker) => {
		console.log("Worker", worker.process.pid, "died", new Date().toLocaleString());
		cluster.fork();
	});

	return false;
}

const __dirname = path.resolve();

const app = express();
const httpServer = new HttpServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
	session({
		store: MongoStore.create({
			mongoUrl: mongodbConfig.DB_URI,
			mongoOptions: {
				useNewUrlParser: true,
				useUnifiedTopology: true,
			},
		}),
		secret: "keyboard cat",
		cookie: {
			httpOnly: false,
			secure: false,
			maxAge: mongodbConfig.SESSION_TIMEOUT,
		},
		rolling: true,
		resave: true,
		saveUninitialized: false,
	})
);

app.use(passport.initialize());
app.use(passport.session());

export const io = new IOServer(httpServer);

await Products_container.createTable();
await Messages_container.createTable();

const products = await Products_container.getAll();
const messages = await Messages_container.getAll();

const handlebarsConfig = {
	defaultLayout: "index.handlebars",
};
app.engine("handlebars", exphbs(handlebarsConfig));

// app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
	console.log("--------------------------");
	console.log("Nuevo cliente conectado!");

	socket.emit("products_list", products);
	socket.emit("messages", messages);
});

app.get("/", (req, res) => {
	// res.json({ message: "Hello World!" });
	console.log("SESION::::::::", req.session);
	res.sendFile(__dirname + "/public/index.html");

	// if (!req.session.username) res.redirect("/login");
	// else {
	// 	res.sendFile(__dirname + "/public/index.html");
	// 	console.log("LOGUEADO");
	// 	res.json({ message: `Hola ${req.session.username}` });
	// }
});

app.use("/", login_router);
app.use("/", login_router);
app.use("/", register_router);
app.use("/", products_router);
app.use("/", messages_router);

app.use(express.static("public"));

// PROTECTED ROUTE
app.get("/protected-route", checkAuthentication, (req, res) => {
	res.json({ response: "Successful login on protected route", user: req.session.username });
});

app.use("*", fail_router);

conectarDB(mongodbConfig.DB_URI, (err) => {
	if (err) return console.log("error en conexión de base de datos", err);
	const PORT = port;
	const connectedServer = httpServer.listen(process.env.PORT || 8080, function () {
		console.log(`Servidor Http con Websockets escuchando en el puerto ${connectedServer.address().port}`);
		console.log("PID", process.pid);
	});

	connectedServer.on("error", (error) => console.log(`Error en servidor ${error}`));
});
