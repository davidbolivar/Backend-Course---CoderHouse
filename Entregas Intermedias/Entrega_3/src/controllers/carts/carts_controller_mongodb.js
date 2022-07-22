import mongoose from "mongoose";
import config from "../../config.js";
import { transporter } from "../../senders/email/gmail.js";
import { new_order_email_template } from "../../senders/email/templates/new_order_email.js";
import { sendWhatsapp } from "../../senders/whatsapp/index.js";
import { new_order_whatsapp_template } from "../../senders/whatsapp/templates/new_order_whatsapp.js";
import { sendSms } from "../../senders/sms/index.js";
// import { new_order_sms_template } from "../../senders/sms/templates/new_order_sms.js";
import { order_prepare_sms_template } from "../../senders/sms/templates/order_prepare_sms.js";
import { productsDao } from "../../daos/products/index.js";
import logger from "../../../logs/logger.js";
import dotenv from "dotenv";
dotenv.config();

await mongoose.connect(config.mongodb.cnxStr, config.mongodb.options);

export const Carts_controller_mongodb = class Carts_container {
	constructor(collection, schema) {
		this.collection = mongoose.model(collection, schema);
	}

	// Crea un carrito
	create = async (user_id) => {
		try {
			let doc = await this.collection.create({ products: [], user_id });
			return doc._id;
		} catch (err) {
			logger.errror("Cart not created: ", err);
			return { error: "Cart not created: " + err };
		}
	};

	// find cart by user_id
	findByUserId = async (user_id) => {
		try {
			let doc = await this.collection.findOne({ user_id });
			if (cart) return doc._id;
			else return false;
		} catch (err) {
			logger.error("Cart not found: ", err);
			return { error: "Cart not found: " + err };
		}
	};

	// Trae todos los carritos
	getAll = async () => {
		try {
			const carts = await this.collection.find({});
			if (!carts) throw new Error("Carts not found");
			return carts;
		} catch (err) {
			logger.error("Carts not found: ", err);
			return { error: "Carts not found: " + err };
		}
	};

	// Trae un carrito por id
	getById = async (cart_id) => {
		try {
			const cart = await this.collection.findById(cart_id);
			if (!cart) throw new Error("Cart not found");
			return cart;
		} catch (err) {
			logger.error("Cart not found: ", err);
			return { error: "Cart not found: " + err };
		}
	};

	getProducts = async (cart_id) => {
		try {
			const cart = await this.collection.findById(cart_id);
			if (!cart) throw new Error("Cart not found");
			return cart.products;
		} catch (err) {
			logger.error("Products not found: ", err);
			return { error: "Products not found: " + err };
		}
	};

	addProduct = async (cart_id, product_id) => {
		try {
			const cart = await this.getById(cart_id);

			if (!cart) throw new Error("Cart not found");
			const product = await productsDao.getById(product_id);
			if (!product) throw new Error("Product not found");

			const product_index = cart.products.findIndex((product) => product._id == product_id);
			if (product_index === -1) {
				delete product._doc.stock;
				await cart.products.push({ ...product._doc, quantity: 1, id: product_id });
				await cart.save();
			} else {
				if (product.stock < cart.products[product_index].quantity + 1) return { error: "Product out of stock" };
				await this.collection.findByIdAndUpdate(cart_id, { $inc: { [`products.${product_index}.quantity`]: 1 } });
			}

			return true;
		} catch (err) {
			logger.error("Product not added: ", err);
			return { error: "Product not added: " + err };
		}
	};

	//Delete product from cart
	deleteProduct = async (cart_id, product_id) => {
		try {
			const cart = await this.getById(cart_id);
			if (!cart) throw new Error("Cart not found");

			const product_index = cart.products.findIndex((product) => product._id == product_id);
			if (product_index === -1) throw new Error("Product not found");

			await this.collection.findByIdAndUpdate(cart_id, { $pull: { products: { id: product_id } } }, { safe: true, multi: true });
			return true;
		} catch (err) {
			logger.error("Product not deleted: ", err);
			return { error: "Product not deleted: " + err };
		}
	};

	clearProducts = async (cart_id) => {
		try {
			const cart = await this.getById(cart_id);
			if (!cart) throw new Error("Cart not found");

			await this.collection.findByIdAndUpdate(cart_id, { $set: { products: [] } });
			return true;
		} catch (err) {
			logger.error("Products not deleted: ", err);
			return { error: "Products not deleted: " + err };
		}
	};

	// Create order wit user data and cart products
	createOrder = async (cart_id, user_data) => {
		try {
			const products = await this.getProducts(cart_id);
			if (!products) throw new Error("Products not found");

			const total = products.reduce((total, product) => total + product.price * product.quantity, 0);
			const order = { user: user_data, products, products_quantity: products.length, total_price: total };

			let new_order_email_message = new_order_email_template(order);
			const new_order_mail_send = await transporter.sendMail(new_order_email_message);
			logger.info("Mail send:", new_order_mail_send);

			let new_order_whatsapp_message = new_order_whatsapp_template(order.user);
			const new_order_whatsapp_send = await sendWhatsapp(process.env.ADMIN_PHONE, new_order_whatsapp_message);
			logger.info("Whatsapp send:", new_order_whatsapp_send);

			// let new_order_sms_message = new_order_sms_template(order.user);
			// const new_order_sms_send = await sendSms(process.env.ADMIN_PHONE, new_order_sms_message);
			// logger.info("SMS send:", new_order_sms_send);

			let order_prepare_sms_message = order_prepare_sms_template(order.user);
			const order_prepare_sms_send = await sendSms(process.env.ADMIN_PHONE, order_prepare_sms_message);
			logger.info("SMS send:", order_prepare_sms_send);

			return order;
		} catch (err) {
			logger.error("Order not created: ", err);
			return { error: "Order not created: " + err };
		}
	};
};
