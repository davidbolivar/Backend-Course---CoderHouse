const configObject = {
	host: "localhost",
	port: 3306,
	user: "coder",
	password: "house",
	database: "coder_clase16",
};

const configString = "mysql://coder:house@localhost:3306/coder_clase16";

export const mySqlConfig = {
	client: "mysql2",
	connection: configObject, //Se puede usar configObject o configString;
};
