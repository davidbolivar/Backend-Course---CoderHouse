const express = require("express");
const exphbs = require("express-handlebars");

const productos = [];
let sinProductos = true;

const app = express();

const handlebarsConfig = {
  defaultLayout: "index.handlebars",
};

app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", exphbs(handlebarsConfig));

app.set("view engine", "handlebars");

app.set("views", "./views");

app.get("/", (req, res) => {
  res.render("formulario");
});

app.post("/productos", (req, res) => {
  productos.push(req.body);
  // solo funciona porque no existe el metodo delete, en ese caso debo mirar el .length de productos
  sinProductos = false;
  console.log(productos);
  res.redirect("/");
});

app.get("/productos", (req, res) => {
  res.render("historial", { productos, sinProductos });
});

const PORT = 8080;
const server = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${server.address().port}`);
});
server.on("error", (error) => console.log(`Error en servidor ${error}`));
