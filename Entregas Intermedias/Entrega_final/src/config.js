import dotenv from "dotenv";
dotenv.config();

export default {
	fileSystem: {
		path: "./databases",
	},

	mongodb: {
		connectionString: "mongodb+srv://davidbolivar:asd123@cluster0.lm0ks.mongodb.net/coder_final?retryWrites=true&w=majority",
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
