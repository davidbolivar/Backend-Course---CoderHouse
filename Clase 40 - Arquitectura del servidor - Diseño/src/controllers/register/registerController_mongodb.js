import logger from "../../../logs/logger.js";
function getRegister(req, res) {
	logger.info(`Petición a la ruta: ${req.url} con método ${req.method}`);
	res.redirect("/register");
}

function postRegister(req, res) {
	logger.info(`Petición a la ruta: ${req.url} con método ${req.method}`);
	var user = req.user;
	console.log(user);

	res.json({ message: "registered successfully. You must login with a POST to /login" });
	// res.redirect("/login");
}

function getFailRegister(req, res) {
	logger.info(`Petición a la ruta: ${req.url} con método ${req.method}`);
	console.log("Register error");
	res.json({ error: "Register error" });
}

export default {
	getRegister,
	postRegister,
	getFailRegister,
};
