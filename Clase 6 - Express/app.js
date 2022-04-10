const express = require("express");
const app = express();

app.get("/", (req, res) => {
	res.send("Raíz del servidor");
});

app.get("/saludo", (req, res) => {
	res.send("Hola mundo");
});

const PORT = 8080;
const server = app.listen(PORT, () => {
	console.log(`Servidor escuchando en el puerto ${server.address().port}`);
});

server.on("error", (error) => console.log(`Error en el servidor ${error}`));
