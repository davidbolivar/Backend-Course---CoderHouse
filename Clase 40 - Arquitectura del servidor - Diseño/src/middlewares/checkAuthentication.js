export const checkAuthentication = (req, res, next) => {
	console.log("ENTRA A CHECK AUTHENTICATION");
	if (req.isAuthenticated()) next();
	else res.redirect("/login");
};
