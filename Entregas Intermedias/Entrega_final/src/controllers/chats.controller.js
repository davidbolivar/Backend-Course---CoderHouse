class Controller {
	constructor() {}

	show = async (req, res) => {
		try {
			res.render("chat_messages");
		} catch (error) {
			res.status(500).json(error);
		}
	};
}

export const chatsController = new Controller();
