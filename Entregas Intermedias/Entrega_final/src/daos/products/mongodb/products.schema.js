import config from "../../../config.js";
import { mongoose } from "mongoose";

await mongoose.connect(config.mongodb.connectionString, config.mongodb.options);

const mongooseProductSchema = mongoose.model("products", {
	id: { type: String, required: true },
	title: { type: String, required: true },
	description: { type: String, required: true },
	thumbnail: { type: String, required: true },
	price: { type: Number, required: true },
	stock: { type: Number, required: true },
});

export default mongooseProductSchema;
