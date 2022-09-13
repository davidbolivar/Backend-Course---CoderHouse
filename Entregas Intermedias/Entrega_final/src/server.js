import express from "express";
import { productsRouter } from "./routes/products.routes.js";
import { cartsRouter } from "./routes/carts.routes.js";
import { usersRouter } from "./routes/users.routes.js";
import { loginRouter } from "./routes/login.routes.js";
import dotenv from "dotenv";
import logger from "../logs/logger.js";
import config from "./config.js";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";

dotenv.config();

const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

if (config.persistence === "mongodb") {
	mongoose.connect(config.mongodb.connectionString, config.mongodb.options);

	app.use(
		session({
			store: MongoStore.create({
				mongoUrl: config.mongodb.connectionString,
				mongoOptions: config.mongodb.options,
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
}

app.use(passport.initialize());
app.use(passport.session());

app.use("/login", loginRouter);

app.use("/api/products", productsRouter);
app.use("/api/shoppingcartproducts", cartsRouter);
app.use("/api/users", usersRouter);

app.all("*", (req, res) => {
	res.status(404).json({ error: "404 Not Found", method: req.method, route: req.url });
});

const server = app.listen(process.env.PORT || process.env.SERVER_PORT, () => {
	logger.info(`Server listening on port ${server.address().port}`);
});

server.on("error", (error) => logger.error(`Server error: ${error}`));
