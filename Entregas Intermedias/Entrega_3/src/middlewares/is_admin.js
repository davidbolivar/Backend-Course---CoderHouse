export const isAdmin = (req, res, next) => {
	const admin = true;
	if (admin) next();
	else res.status(401).json({ error: "Not authorized." });
};
