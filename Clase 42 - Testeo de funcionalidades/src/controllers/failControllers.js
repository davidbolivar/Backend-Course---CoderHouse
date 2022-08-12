import logger from "../../logs/logger.js";
function failRoute(req, res) {
	logger.info(`No se encontró la ruta: ${req.url} con método ${req.method}`);
	logger.warn(`No se encontró la ruta: ${req.url} con método ${req.method}`);
	res.status(404).json({ error: "Route not found" });
}

export default { failRoute };
