import "dotenv/config";
const MONGODB_USER = process.env.MONGODB_USER;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
const SESSION_TIMEOUT = 20000;

const DB_URI = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@cluster0.lm0ks.mongodb.net/coder_backend?retryWrites=true&w=majority`;

export default {
	SESSION_TIMEOUT,
	DB_URI,
};
