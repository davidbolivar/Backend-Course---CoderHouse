import Router from "express";
import register_controller from "../controllers/registerControllers.js";
import passport from "passport";
import UsersModel from "../models/index.js";
import { Strategy as LocalStrategy } from "passport-local";

export const register_router = new Router();

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
register_router.get("/register", register_controller.getRegister);
register_router.post(
	"/register",
	passport.authenticate("register", {
		failureRedirect: "/failRegister",
		failureMessage: true,
	}),
	register_controller.postRegister
);

register_router.post("/failRegister", register_controller.getFailRegister);
