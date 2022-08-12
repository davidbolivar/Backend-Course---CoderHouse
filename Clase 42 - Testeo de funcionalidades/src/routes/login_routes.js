import Router from "express";
import login_controller from "../controllers/login/loginController_mongodb.js";
import passport from "passport";
import UsersModel from "../models/index.js";
import { Strategy as LocalStrategy } from "passport-local";

export const login_router = new Router();

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
			// console.log("Login ok", user);
			return done(null, user);
		});
	})
);

function isValidPassword(user, password) {
	return password == user.password;
}

passport.serializeUser((user, done) => {
	done(null, user._id);
});

passport.deserializeUser((id, done) => {
	UsersModel.findById(id, done);
});

login_router.get("/login", login_controller.getLogin);
login_router.post("/login", passport.authenticate("login", { failureRedirect: "/failLogin", failureMessage: true }), login_controller.postLogin);
login_router.get("/failLogin", login_controller.getFailLogin);
login_router.get("/logout", login_controller.getLogout);
