//Ejercicio 3 importar variables de entorno
import dotenv from 'dotenv';
dotenv.config();

const dbHost = process.env.DB_HOST || 'localhost';
const dbUser = process.env.DB_USER || 'root';

console.log(`Conectando a la base de datos en ${dbHost} con el usuario ${dbUser}`);