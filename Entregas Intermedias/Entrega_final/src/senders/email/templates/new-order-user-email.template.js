import dotenv from "dotenv";
dotenv.config();

export const newOrderUserEmailTemplate = (order) => {
	let products = order.products
		.map((product) => {
			return `<li><b>${product.name}</b>: $${product.price}</li>`;
		})
		.join(" ");

	const fullName = `${order.name} ${order.lastname}`;

	const mailOptions = {
		from: `${process.env.GMAIL_USER_ALIAS} <${process.env.GMAIL_USER}>`,
		to: order.email,
		subject: `✅ Confirmación de compra #${order.id}`,
		html: `
			<h1 style="margin-bottom: 0px;">Detalles de la compra ${order.id}</h1>
			<hr>
			<p style="margin: 0px;"><img src="${order.image}" width="100px"/></p>
			<p style="margin: 0px;"><b>Nombre:</b> ${fullName}</p>
			<p style="margin: 0px;"><b>Correo:</b> ${order.email}</p>
			<p style="margin: 0px;"><b>Teléfono:</b> ${order.phone}</p>
			<p style="margin: 0px;"><b>Productos:</b></p>
			<ol>
				${products}
			</ol>
		`,
	};

	return mailOptions;
};
