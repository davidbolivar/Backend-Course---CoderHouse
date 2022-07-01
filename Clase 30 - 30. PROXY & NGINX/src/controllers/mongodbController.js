import mongoose from "mongoose";

var baseDeDatosConectada = false;

function conectarDB(url, cb) {
	// mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, authSource: "admin", auth: { username: "root", password: "mongopassword" } }, (err) => {
	mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
		if (!err) {
			baseDeDatosConectada = true;
		}
		if (cb != null) {
			cb(err);
		}
	});
}

export default conectarDB;
