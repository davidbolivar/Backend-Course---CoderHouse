import express from "express";
import { Server as HttpServer } from "http";
// import { Server as IOServer } from "socket.io";
import exphbs from "express-handlebars";
import { Products_container } from "./controllers/productsController.js";
import { Messages_container } from "./controllers/messagesController.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongodbConfig from "./config/mongodb.js";
import conectarDB from "./controllers/mongodbController.js";
import UsersModel from "./models/index.js";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import routesFunctions from "./routes_functions.js";
import parse from "yargs/yargs";
import path from "path";
import { fork } from "child_process";
import cluster from "cluster"; /* https://nodejs.org/dist/latest-v14.x/docs/api/cluster.html */
import os from "os";
import compression from "compression";

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

const server_info = {
	arguments: process.argv.slice(2),
	os: process.env.os,
	node_version: process.versions.node,
	memory_usage: process.memoryUsage().rss,
	exec_path: process.execPath,
	process_id: process.pid,
	current_working_directory: process.cwd(),
	numCPUs: numCPUs,
};

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

passport.use(
	"register",
	new LocalStrategy({ passReqToCallback: true }, (req, username, password, done) => {
		UsersModel.findOne({ username: username }, function (err, user) {
			if (err) {
				console.log("Register error: " + err);
				return done(err);
			}

			if (user) {
				console.log("User already exists");
				return done(null, false, { message: "User already exists" });
			}

			const newUser = {
				// username: username,
				// password: createHash(password),
				password: password,
				username: username,
				// firstName: req.body.firstName,
				// lastName: req.body.lastName,
			};

			UsersModel.create(newUser, (err, userWithId) => {
				if (err) {
					console.log("Error in saving user: " + err);
					return done(err);
				}
				console.log("User registration succesful", user);
				return done(null, userWithId);
			});
		});
	})
);

passport.use(
	"login",
	new LocalStrategy({ passReqToCallback: true }, (req, username, password, done) => {
		UsersModel.findOne({ username }, (err, user) => {
			if (err) return done(err);

			if (!user) {
				console.log("User Not Found with username " + username);
				return done(null, false, { message: `User not found: ${username}` });
			}

			if (!isValidPassword(user, password)) {
				console.log("Invalid Password");
				return done(null, false, { message: "Invalid password" });
			}
			console.log("Login ok", user);
			return done(null, user);
		});
	})
);

passport.serializeUser((user, done) => {
	done(null, user._id);
});

passport.deserializeUser((id, done) => {
	UsersModel.findById(id, done);
});

function isValidPassword(user, password) {
	return password == user.password;
}

// function createHash(password) {
// 	return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
// }

// const io = new IOServer(httpServer);

await Products_container.createTable();
await Messages_container.createTable();

const products = await Products_container.getAll();
const messages = await Messages_container.getAll();

// const handlebarsConfig = {
// 	defaultLayout: "index.handlebars",
// };
// app.engine("handlebars", exphbs(handlebarsConfig));

// app.use(express.static("public"));

// io.on("connection", (socket) => {
console.log("--------------------------");
console.log("Nuevo cliente conectado!");

/* Envio los productos y mensajes al cliente que se conectó */
// socket.emit("products_list", products);
// socket.emit("messages", messages);

app.get("/", (req, res) => {
	console.log(req.session);
	if (!req.session.username) res.redirect("/login");
	else {
		console.log("LOGUEADO");
		res.json({ message: `Hola ${req.session.username}` });
	}
});

app.get("/logout", (req, res) => {
	if (!req.session.username) res.json({ error: "No user session to close" });
	else {
		req.session.destroy((err) => {
			if (err) res.json({ error: "Logout error", message: err });
			else res.redirect("/");
		});
	}
});

// const mensaje = "Hola que tal";
// const mensajeLargooo = mensaje.repeat(1000);

app.get("/info", (req, res) => {
	res.json(server_info);
});

app.get("/info_compression", compression(), (req, res) => {
	res.json(server_info);
});

app.get("/api/randoms", (req, res) => {
	const qty = req.query.qty || 100_000_000;
	const calculate = fork(path.resolve(process.cwd(), "src/controllers/randomNumbersController.js"));
	calculate.on("message", (result) => {
		if (result === "random_numbers_ok") calculate.send(qty);
		else res.json(result);
	});
});

app.post("/products", (req, res) => {
	products.push(req.body);
	Products_container.add([req.body]);
	io.sockets.emit("products_list", products);
	// console.log(products);
	res.redirect("/");
});

// app.post("/products-test", (req, res) => {
// 	res.sendFile(__dirname + "/index.html");

// 	// Genero un nuevo producto
// 	const producto = {
// 		name: faker.commerce.productName(),
// 		price: faker.commerce.price(),
// 		image: faker.image.imageUrl(),
// 	};
// });

app.post("/messages", (req, res) => {
	messages.push(req.body);
	Messages_container.add(req.body);
	io.sockets.emit("messages", messages);
	// console.log(messages);
	res.redirect("/");
});

//  LOGIN
app.get("/login", routesFunctions.getLogin);
app.post("/login", passport.authenticate("login", { failureRedirect: "/failLogin", failureMessage: true }), routesFunctions.postLogin);
app.post("/failLogin", routesFunctions.getFailLogin);

//  GET REGISTER
app.get("/register", routesFunctions.getRegister);
//  POST REGISTER
app.post(
	"/register",
	passport.authenticate("register", {
		failureRedirect: "/failRegister",
		failureMessage: true,
	}),
	routesFunctions.postRegister
);
//  POST FAIL REGISTER
app.post("/failRegister", routesFunctions.getFailRegister);

function checkAuthentication(req, res, next) {
	if (req.isAuthenticated()) next();
	else res.redirect("/login");
}

// PROTECTED ROUTE
app.get("/protected-route", checkAuthentication, (req, res) => {
	res.json({ response: "Successful login on protected route", user: req.session.username });
});

//  LOGOUT
app.get("/logout", routesFunctions.getLogout);

//  FAIL ROUTE
app.all("*", routesFunctions.failRoute);

// app.use(express.static("public"));
// });

conectarDB(mongodbConfig.DB_URI, (err) => {
	if (err) return console.log("error en conexión de base de datos", err);
	const PORT = port;
	const connectedServer = httpServer.listen(PORT, function () {
		console.log(`Servidor Http con Websockets escuchando en el puerto ${connectedServer.address().port}`);
		console.log("PID", process.pid);
	});

	connectedServer.on("error", (error) => console.log(`Error en servidor ${error}`));
});
