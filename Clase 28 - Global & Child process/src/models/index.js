import mongoose from "mongoose";

export default mongoose.model("Users", {
	// username: String,
	password: String,
	username: String,
	// firstName: String,
	// lastName: String,
});
