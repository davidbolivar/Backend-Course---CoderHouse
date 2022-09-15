import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import os from "os";
dotenv.config();

export const tokenGenerator = ({ id, email, name, lastname, phone, image }) => {
	return jwt.sign({ id, email, name, lastname, phone, image }, process.env.JWT_SECRET, {
		expiresIn: process.env.TOKEN_EXPIRATION_TIME,
	});
};

export const idGenerator = () => {
	return uuidv4();
};

export const encryptPassword = async (password) => {
	return await bcrypt.hash(password, 10);
};

export const passwordChecker = async (password, hash) => {
	return await bcrypt.compare(password, hash);
};

export const serverInfo = {
	os: process.env.os,
	arguments: process.argv.slice(2),
	node_version: process.versions.node,
	memory_usage: process.memoryUsage().rss,
	exec_path: process.execPath,
	process_id: process.pid,
	current_working_directory: process.cwd(),
	numOfCPUs: os.cpus().length,
};
