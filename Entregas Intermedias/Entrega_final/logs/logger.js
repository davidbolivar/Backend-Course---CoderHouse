import log4js from "log4js";
import dotenv from "dotenv";
dotenv.config();

log4js.configure({
	appenders: {
		consola: { type: "console" },
		archivoError: { type: "file", filename: "./logs/error.log" },
		archivoWarn: { type: "file", filename: "./logs/warn.log" },
		loggerConsola: {
			type: "logLevelFilter",
			appender: "consola",
			level: "info",
		},
		loggerArchivoError: {
			type: "logLevelFilter",
			appender: "archivoError",
			level: "error",
		},
		loggerArchivoWarn: {
			type: "logLevelFilter",
			appender: "archivoWarn",
			level: "warn",
		},
	},
	categories: {
		default: {
			appenders: ["loggerConsola"],
			level: "all",
		},
		prod: {
			appenders: ["loggerArchivoError", "loggerArchivoWarn"],
			level: "all",
		},
	},
});

let logger = null;
if (process.env.NODE_ENV === "production") logger = log4js.getLogger("prod");
else logger = log4js.getLogger();

export default logger;
