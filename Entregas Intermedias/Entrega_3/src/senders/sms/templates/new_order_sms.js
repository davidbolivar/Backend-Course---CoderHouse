export const new_order_sms_template = (user_data) => {
	return `Nuevo pedido de ${user_data.name}: ${user_data.username}.`;
};
