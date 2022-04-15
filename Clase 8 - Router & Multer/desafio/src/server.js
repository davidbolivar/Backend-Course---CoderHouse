const express = require("express");
const { productsRouter } = require("./router/products");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/api/products", productsRouter);

const PORT = 8080;
const server = app.listen(PORT, () => console.log(`Server ready. PORT: ${server.address().port}`));
server.on("error", (error) => console.log(`Server ERROR: ${error}`));
