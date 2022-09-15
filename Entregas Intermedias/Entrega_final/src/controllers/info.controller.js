import { serverInfo } from "../serverInfo.js";

class Controller {
	constructor() {}

	serverInfo = async (req, res) => {
		try {
			res.render("server_info", { layout: "server", data: serverInfo });
		} catch (error) {
			res.status(500).json(error);
		}
	};
}

export const infoController = new Controller();
