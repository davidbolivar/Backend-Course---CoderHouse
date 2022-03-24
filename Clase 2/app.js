class User {
	constructor(name, lastName, books = [], pets = []) {
		this.name = name;
		this.lastName = lastName;
		this.books = books;
		this.pets = pets;
	}

	getFullName = () => `${this.name} ${this.lastName}`;

	addPet = (name) => this.pets.push(name);

	getPetNames = () => this.pets;

	countPets = () => this.pets.length;

	addBook = (name, autor) => this.books.push({ name, autor });

	getBookNames = () => this.books.map((book) => book.name);
}

const user1 = new User(
	"David",
	"Bolívar",
	[
		{ name: "Aprendiendo Git", autor: "Miguel Angel Durán García (MiduDev)" },
		{ name: "Aprendiendo JavaScript", autor: "Carlos Azaustre" },
	],
	["Thor"]
);
f;
console.log(user1.getFullName());
user1.addPet("Molly");
console.log(user1.getPetNames());
console.log(user1.countPets());
user1.addBook("Libro nuevo", "Autor nuevo");
console.log(user1.getBookNames());
