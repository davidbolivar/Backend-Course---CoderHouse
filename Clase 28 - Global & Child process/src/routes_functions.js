import path from "path";
const __dirname = path.resolve();

// ------------------------------------------------------------------------------
//  ROUTING
// ------------------------------------------------------------------------------

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//  INDEX
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function getRoot(req, res) {}

function getRegister(req, res) {
	res.redirect("/register");
}

function postRegister(req, res) {
	var user = req.user;
	console.log(user);

	//grabo en user fecha y hora logueo
	res.redirect("/login");
}

function getFailRegister(req, res) {
	console.log("Register error");
	res.json({ error: "Register error" });
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//  LOGIN
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function getLogin(req, res) {
	if (req.isAuthenticated()) res.redirect("/");
	else res.json({ error: "You must login with a POST to /login" });
}

function postLogin(req, res) {
	req.session.username = req.user.username;
	res.json({ response: "Login successful", user: req.session.username });
}

function getFailLogin(req, res) {
	res.json({ error: req.session.messages[0] });
}

function getLogout(req, res) {
	req.logout();
	res.json({ status: "Logout successful" });
}

function failRoute(req, res) {
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
