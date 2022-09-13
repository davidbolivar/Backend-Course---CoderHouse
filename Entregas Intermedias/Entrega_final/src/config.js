import dotenv from "dotenv";
dotenv.config();

export default {
	fileSystem: {
		path: "./databases",
	},

	mongodb: {
		connectionString: process.env.MONGO_CONNECT_STRING,
		options: {
			// useNewUrlParser: true,
			// useUnifiedTopology: true,
			// useCreateIndex: true,
			serverSelectionTimeoutMS: 5000,
		},
		sessionTimeout: 500000,
	},
	persistence: "mongodb",
};
