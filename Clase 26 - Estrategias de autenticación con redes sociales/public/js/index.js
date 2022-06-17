document.addEventListener("DOMContentLoaded", async () => {
	const socket = io();

	// const input = document.querySelector("input");
	// document.querySelector("button").addEventListener("click", () => {
	// 	socket.emit("mensaje", input.value);
	// });

	async function getTemplate(url) {
		let res = await fetch(url);
		return await res.text();
	}

	async function createHtml(url, contexto) {
		const template = await getTemplate(url);
		const generarHtml = Handlebars.compile(template);
		return generarHtml(contexto);
	}

	// PRODUCTS ########################################################################
	socket.on("products_list", async (productos) => {
		// console.table(productos);
		let html = await createHtml("templates/products_list.template", productos);
		document.getElementById("products_list").innerHTML = html;
	});

	getTemplate("templates/add_products_form.template").then((response) => {
		document.getElementById("products_form").innerHTML = response;
	});

	// MESSAGES ########################################################################
	socket.on("messages", async (messages) => {
		// console.table(messages);
		let html = await createHtml("templates/chat_messages.template", messages);
		document.getElementById("chat_messages").innerHTML = html;
	});

	getTemplate("templates/chat_form.template").then((response) => {
		document.getElementById("chat_form").innerHTML = response;
	});
});
