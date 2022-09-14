const socket = io();

// MESSAGES ########################################################################
socket.on("messages", async (messages) => {
	console.table(messages);
	let html = await createHtml("templates/chat_messages.template", messages);
	document.getElementById("chat_messages").innerHTML = html;
});

getTemplate("templates/chat_form.template").then((response) => {
	document.getElementById("chat_form").innerHTML = response;
});

async function getTemplate(url) {
	let res = await fetch(url);
	return await res.text();
}

async function createHtml(url, contexto) {
	const template = await getTemplate(url);
	const generarHtml = Handlebars.compile(template);
	return generarHtml(contexto);
}
