import "dotenv/config";
const MYSQL_USER = process.env.MYSQL_USER;
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
const configObject = {
	host: "localhost",
	port: 3306,
	user: MYSQL_USER,
	password: MYSQL_PASSWORD,
	database: "coder_clase16",
};

// const configString = "mysql://coder:house@localhost:3306/coder_clase16";

export const mySqlConfig = {
	client: "mysql2",
	connection: configObject, //Se puede usar configObject o configString;
};
