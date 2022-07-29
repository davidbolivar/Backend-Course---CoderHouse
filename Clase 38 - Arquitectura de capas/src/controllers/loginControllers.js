import logger from "../../logs/logger.js";

function getLogin(req, res) {
	logger.info(`Petición a la ruta: ${req.url} con método ${req.method}`);
	if (req.isAuthenticated()) res.redirect("/");
	else res.json({ error: "You must login with a POST to /login" });
}

function postLogin(req, res) {
	logger.info(`Petición a la ruta: ${req.url} con método ${req.method}`);
	req.session.username = req.user.username;
	res.json({ response: "Login successful", user: req.session.username });
}

function getFailLogin(req, res) {
	logger.info(`Petición a la ruta: ${req.url} con método ${req.method}`);
	res.json({ error: req.session.messages[0] });
}

function getLogout(req, res) {
	logger.info(`Petición a la ruta: ${req.url} con método ${req.method}`);
	req.logout();
	req.session.destroy();
	res.json({ status: "Logout successful" });
}

export default { getLogin, postLogin, getFailLogin, getLogout };
