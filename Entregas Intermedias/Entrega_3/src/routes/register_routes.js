import Router from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { registerDao } from "../daos/register/index.js";
import UsersModel from "../models/users.js";
import bcrypt from "bcrypt";
import logger from "../../logs/logger.js";

passport.use(
	"register",
	new LocalStrategy({ passReqToCallback: true }, (req, username, password, done) => {
		// TODO: VER SI HAY QUE MODULARIZAR ESTO
		if (typeof password !== "string") return done(null, false, { message: "Password must be a string" });

		UsersModel.findOne({ username: username }, async function (err, user) {
			if (err) {
				logger.error("Register error: ", err);
				return done(err);
			}

			if (user) return done(null, false, { message: "User already exists" });

			let passwordHash = await bcrypt.hash(password, 10);
			const newUser = {
				username: req.body.username,
				password: passwordHash,
				name: req.body.name,
				address: req.body.address,
				age: req.body.age,
				phone: req.body.phone,
				photo: req.body.photo,
			};

			UsersModel.create(newUser, (err, userWithId) => {
				if (err) {
					logger.error("Error in saving user: ", err);
					return done(err);
				}
				logger.info("User registration succesful", userWithId.username);
				return done(null, userWithId);
			});
		});
	})
);

export const register_router = new Router();

register_router.post("/register", passport.authenticate("register", { failureRedirect: "/api/failRegister", failureMessage: true }), async (req, res) => {
	let response = await registerDao.postRegister(req.user);
	response.error ? res.status(400).json(response.error) : res.redirect("/");
});

register_router.post("/failRegister", async (req, res) => {
	let response = await registerDao.getFailRegister(req.session.messages);
	res.status(400).json(response);
});
