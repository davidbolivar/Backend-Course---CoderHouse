import logger from "../logs/logger.js";

// ------------------------------------------------------------------------------
//  ROUTING
// ------------------------------------------------------------------------------

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//  INDEX
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// function getRoot(req, res) {}

function getRegister(req, res) {
	logger.info(`Petición a la ruta: ${req.url} con método ${req.method}`);
	res.redirect("/register");
}

function postRegister(req, res) {
	logger.info(`Petición a la ruta: ${req.url} con método ${req.method}`);
	var user = req.user;
	console.log(user);

	//grabo en user fecha y hora logueo
	res.redirect("/login");
}

function getFailRegister(req, res) {
	logger.info(`Petición a la ruta: ${req.url} con método ${req.method}`);
	console.log("Register error");
	res.json({ error: "Register error" });
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//  LOGIN
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
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
	res.json({ status: "Logout successful" });
}

function failRoute(req, res) {
	logger.info(`No se encontró la ruta: ${req.url} con método ${req.method}`);
	logger.warn(`No se encontró la ruta: ${req.url} con método ${req.method}`);
	res.status(404).json({ error: "Route not found" });
}

export default {
	// getRoot,
	getLogin,
	postLogin,
	getFailLogin,
	getLogout,
	failRoute,
	getRegister,
	postRegister,
	getFailRegister,
};
