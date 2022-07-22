import express from "express";
import { products_router } from "./routes/products_routes.js";
import { carts_router } from "./routes/carts_routes.js";
import { register_router } from "./routes/register_routes.js";
import { login_router } from "./routes/login_routes.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import config from "./config.js";
import UsersModel from "./models/users.js";
import cluster from "cluster";
import os from "os";
import dotenv from "dotenv";
import logger from "../logs/logger.js";

dotenv.config();

const numCPUs = os.cpus().length;

// CLUSTER MODE WITH SERVER_MODE ENV VAR ###############################################################
if (process.env.SERVER_MODE === "CLUSTER" && cluster.isPrimary) {
	logger.info(`CLUSTER MODE with ${numCPUs} CPUs. PID Master ${process.pid}`);

	for (let i = 0; i < numCPUs; i++) {
		cluster.fork();
	}

	cluster.on("exit", (worker) => {
		logger.info(`Worker" ${worker.process.pid} died. ${new Date().toLocaleString()}`);
		cluster.fork();
	});
} else {
	const app = express();
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	app.use(
		session({
			store: MongoStore.create({
				mongoUrl: config.mongodb.cnxStr,
				mongoOptions: {
					useNewUrlParser: true,
					useUnifiedTopology: true,
				},
			}),
			secret: "keyboard cat",
			cookie: {
				httpOnly: false,
				secure: false,
				maxAge: config.mongodb.sessionTimeout,
			},
			rolling: true,
			resave: true,
			saveUninitialized: false,
		})
	);

	passport.serializeUser((user, done) => {
		done(null, user._id);
	});

	passport.deserializeUser((id, done) => {
		UsersModel.findById(id, done);
	});

	app.use(passport.initialize());
	app.use(passport.session());

	app.use("/api/products", products_router);
	app.use("/api/carts", carts_router);
	app.use("/api", login_router);
	app.use("/api", register_router);

	app.all("*", (req, res) => {
		res.status(404).json({ error: "404 Not Found", method: req.method, route: req.url });
	});

	const PORT = process.env.PORT || process.env.SERVER_PORT;
	const server = app.listen(PORT, () => {
		logger.info(`Server listening on port ${server.address().port}`);
	});

	server.on("error", (error) => logger.error(`Server error: ${error}`));
}
