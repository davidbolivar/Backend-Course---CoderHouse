import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const sendSms = async (phone, message) => {
	// If phone not contains "+", add it
	if (phone.charAt(0) != "+") phone = `+${phone}`;

	let post_object = {
		secret: process.env.SMS_MASIVO_API_KEY,
		mode: "devices",
		device: process.env.SMS_MASIVO_DEVICE_ID,
		sim: 1,
		priority: 1,
		phone: phone,
		message: message,
	};

	let data_string = new URLSearchParams(post_object).toString();

	let send = await axios.post("https://smsmasivo.online/api/send/sms", data_string);
	return send;
};
