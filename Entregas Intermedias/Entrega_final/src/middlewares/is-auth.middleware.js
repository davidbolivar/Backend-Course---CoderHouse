export const isAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()) next();
	// Must be logged in to access this route
	else res.status(401).json({ error: "You must be logged in to access this route." });
};
