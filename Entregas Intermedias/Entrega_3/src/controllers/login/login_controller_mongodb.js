import logger from "../../../logs/logger.js";
export const Login_controller_mongodb = class Login_container {
	constructor() {}

	getLogin(is_logged) {
		if (is_logged) return true;
		else res.json({ error: "You must login with a POST to /login" });
	}

	postLogin = (session, username) => {
		session.username = username;
		logger.info("Login successful", session.username);
		return true;
	};

	getFailLogin(errors) {
		logger.warn("Login error: ", errors);
		return { error: errors.pop() };
	}

	deleteLogout(session) {
		try {
			let user = session.username;
			if (!user) res.json({ error: "No user session to close" });
			else {
				req.logOut((err) => {
					if (err) res.json({ error: "Logout error", message: err });
					session.destroy();
					return { message: "Logout successful", user };
				});
			}
		} catch (error) {
			logger.error("Logout error: ", error);
			return { error: "Logout error:" + error };
		}
	}
};
