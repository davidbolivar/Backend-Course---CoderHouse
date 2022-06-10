import knex from "knex";
import { mySqlConfig } from "./src/config/mysql2.js";
import { ClienteSql } from "./src/controllers/productsController.js";

const prueba = new ClienteSql(mySqlConfig);

const cliente_knex = knex(mySqlConfig);

prueba.crearTabla();

cliente_knex.schema
	.hasTable("personas")
	.then((exists) => {
		if (!exists) {
			cliente_knex.schema
				.createTable("personas", (tabla) => {
					tabla.increments("id"), tabla.string("nombre"), tabla.integer("edad");
				})
				.then(() => {
					console.log('tabla "personas" creada!');
				});
		} else {
			console.log('la tabla "personas" ya existe. no se realizaron cambios');
		}
	})
	.finally(() => {
		cliente_knex.destroy();
	});
