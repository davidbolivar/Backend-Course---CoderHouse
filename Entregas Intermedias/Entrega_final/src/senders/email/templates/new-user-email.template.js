import dotenv from "dotenv";
dotenv.config();

export const newUserEmailTemplate = (user_data) => {
	const mailOptions = {
		from: `${process.env.GMAIL_USER_ALIAS} <${process.env.GMAIL_USER}>`,
		to: process.env.ADMIN_EMAIL,
		subject: "Nuevo usuario registrado: " + user_data.username,
		// New user registered html template mail
		html: `
        <h1>Nuevo usuario registrado: ${user_data.name}</h1>
        <p><b>Nombre:</b> ${user_data.name}</p>
        <p><b>Email:</b> ${user_data.username}</p>
        <p><b>Edad:</b> ${user_data.age}</p>
        <p><b>Dirección:</b> ${user_data.address}</p>
        <p><b>Teléfono:</b> ${user_data.phone}</p>
        <p><img src="${user_data.photo}" width="100px"/></p>
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
