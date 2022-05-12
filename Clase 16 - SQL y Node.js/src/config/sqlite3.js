export const sqliteConfig = {
	client: "sqlite3",
	connection: {
		filename: process.cwd() + "/src/db/messages.sqlite",
	},
	useNullAsDefault: true,
};
