// TODO: HAY QUE MOSTRAR LOS ERRORES Y GUARDARLOS CON show_error() Y write_error()

export default class NewProductModel {
	#title;
	#description;
	#thumbnail;
	#price;
	#stock;

	// TODO: Verificar si hay que utilizar un set para address o para country y state

	constructor({ title, description, thumbnail, price, stock }) {
		this.title = title;
		this.description = description;
		this.thumbnail = thumbnail;
		this.price = price;
		this.stock = stock;
	}

	set title(title) {
		const MIN_LENGTH = 10;

		if (!title)
			throw {
				message: "El campo título es requerido.",
				code: "title_required",
				expected: true,
				status: 400,
			};

		if (typeof title !== "string")
			throw {
				message: "El título debe ser un string.",
				code: "title_must_be_string",
				status: 400,
				expected: true,
			};

		if (title.length < MIN_LENGTH)
			throw {
				message: `El título debe tener al menos ${MIN_LENGTH} caracteres.`,
				code: "invalid_title_length",
				expected: true,
				status: 400,
			};

		this.#title = title;
	}

	set description(description) {
		const MIN_LENGTH = 10;
		if (!description)
			throw {
				message: "El campo descripción es requerido.",
				code: "description_required",
				expected: true,
				status: 400,
			};
		if (description.length < MIN_LENGTH)
			throw {
				message: `La descripción debe tener al menos ${MIN_LENGTH} caracteres.`,
				code: "invalid_description_length",
				expected: true,
				status: 400,
			};
		this.#description = description;
	}

	set thumbnail(thumbnail) {
		const MIN_LENGTH = 20;
		if (!thumbnail)
			throw {
				message: "El campo thumbnail es requerido.",
				code: "thumbnail_required",
				expected: true,
				status: 400,
			};
		if (thumbnail.length < MIN_LENGTH)
			throw {
				message: `La ruta de imagen debe tener al menos ${MIN_LENGTH} caracteres.`,
				code: "invalid_thumbnail_length",
				expected: true,
				status: 400,
			};

		// check if thumbnail is jpg, png or gif
		const validExtensions = ["jpg", "jpeg", "png", "gif"];
		const extension = thumbnail.split(".").pop();
		if (!validExtensions.includes(extension))
			throw {
				message: "La imagen debe ser jpg, jpeg, png o gif.",
				code: "invalid_thumbnail_extension",
				expected: true,
				status: 400,
			};

		this.#thumbnail = thumbnail;
	}

	set price(price) {
		const MIN_PRICE = 1;

		if (!price)
			throw {
				message: "El campo precio es requerido.",
				code: "price_required",
				expected: true,
				status: 400,
			};

		if (typeof price !== "number")
			throw {
				message: "El precio debe ser un número.",
				code: "price_must_be_number",
				status: 400,
				expected: true,
			};

		if (price < MIN_PRICE)
			throw {
				message: `El precio debe ser mayor a ${MIN_PRICE}.`,
				code: "invalid_price",
				expected: true,
				status: 400,
			};
		this.#price = price;
	}

	set stock(stock) {
		const MIN_STOCK = 1;

		if (!stock)
			throw {
				message: "El campo stock es requerido.",
				code: "stock_required",
				expected: true,
				status: 400,
			};

		if (typeof stock !== "number")
			throw {
				message: "El stock debe ser un número.",
				code: "stock_must_be_number",
				status: 400,
				expected: true,
			};

		if (stock < MIN_STOCK)
			throw {
				message: `El stock debe ser mayor a ${MIN_STOCK}.`,
				code: "invalid_stock",
				expected: true,
				status: 400,
			};
		this.#stock = stock;
	}

	get dto() {
		const newProduct = {
			title: this.#title,
			description: this.#description,
			thumbnail: this.#thumbnail,
			price: this.#price,
			stock: this.#stock,
		};

		// return deep copy of newUser
		return JSON.parse(JSON.stringify(newProduct));
	}
}
