import dotenv from "dotenv";
dotenv.config();

export const new_order_email_template = (order_data) => {
	let products = order_data.products
		.map((product) => {
			return `<p><b>${product.title}</b>: $${product.price}</p>`;
		})
		.join(" ");

	const mailOptions = {
		from: `${process.env.GMAIL_USER_ALIAS} <${process.env.GMAIL_USER}>`,
		to: process.env.ADMIN_EMAIL,
		subject: `Nuevo pedido de: ${order_data.user.name} - ${order_data.user.username}`,
		html: `
			<h1>Nuevo pedido de: ${order_data.user.username}</h1>
			<p><img src="${order_data.user.photo}" width="100px"/></p>
			<p><b>Nombre:</b> ${order_data.user.name}</p>
			<p><b>Dirección:</b> ${order_data.user.address}</p>
			<p><b>Teléfono:</b> ${order_data.user.phone}</p>
			<p><b>Cantidad de productos:</b> ${order_data.products_quantity}</p>
			<p><b>PRODUCTOS:</b> ${products}</p>
			<p><b>Total:</b> $${order_data.total_price}</p>
		`,

		// text: "Este es un mail de prueba desde Node.js",
		// attachments: [
		// 	{
		// 		path: "./nodemailer.png",
		// 	},
		// ],
	};

	return mailOptions;
};
