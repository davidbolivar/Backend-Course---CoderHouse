import Router from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { loginDao } from "../daos/login/index.js";
import UsersModel from "../models/users.js";
import bcrypt from "bcrypt";
import logger from "../../logs/logger.js";

passport.use(
	"login",
	new LocalStrategy({ passReqToCallback: true }, (req, username, password, done) => {
		// TODO: VER SI HAY QUE MODULARIZAR ESTO
		if (typeof password !== "string") return done(null, false, { message: "Password must be a string" });

		UsersModel.findOne({ username }, async (err, user) => {
			if (err) return done(err);

			if (!user) {
				return done(null, false, { message: `User not found: ${username}` });
			}

			if ((await isValidPassword(user, password)) == false) {
				return done(null, false, { message: "Invalid password" });
			}
			logger.info("Login ok", user);
			return done(null, user);
		});
	})
);

async function isValidPassword(user, password) {
	return await bcrypt.compare(password, user.password);
}

export const login_router = new Router();
login_router.get("/login", async (req, res) => {
	let response = loginDao.getLogin(req.isAuthenticated());
	response.error ? res.status(400).json(response.error) : res.redirect("/");
});

login_router.post("/login", passport.authenticate("login", { failureRedirect: "/api/failLogin", failureMessage: true }), async (req, res) => {
	let response = await loginDao.postLogin(req.session, req.user.username);
	response.error ? res.status(400).json(response.error) : res.redirect("/");
});

login_router.post("/failLogin", async (req, res) => {
	let response = loginDao.getFailLogin(req.session.messages);
	res.status(400).json(response);
});

login_router.delete("/logout", async (req, res) => {
	let response = loginDao.deleteLogout(req.session);
	response.error ? res.status(400).json(response.error) : res.status(200).json(response);
});
