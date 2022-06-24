function ramdom_numbers(numbers) {
	// genera números aleatorios entre 1 y 1000
	let random_numbers = [];
	for (let i = 0; i < numbers; i++) {
		random_numbers.push(Math.floor(Math.random() * 1000) + 1);
	}
	return random_numbers.reduce((acc, curr) => {
		acc[curr] = (acc[curr] || 0) + 1;
		return acc;
	}, {});
}

process.on("exit", () => {
	console.log(`Worker ${process.pid} exit`);
});

process.on("message", (qty) => {
	let random_numbers = ramdom_numbers(qty);
	// Proceso iniciado
	console.log(`Worker ${process.pid} started`);
	// Envio los números al proceso padre
	process.send(random_numbers);
	// Proceso terminado
	console.log(`Worker ${process.pid} finished`);
	process.exit();
});
process.send("random_numbers_ok");
