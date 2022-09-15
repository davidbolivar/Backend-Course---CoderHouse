import dotenv from "dotenv";
dotenv.config();

export default {
	mongodb: {
		connectionString: process.env.MONGO_CONNECT_STRING,
		options: {
			serverSelectionTimeoutMS: 5000,
		},
	},
	persistence: "mongodb",
};
