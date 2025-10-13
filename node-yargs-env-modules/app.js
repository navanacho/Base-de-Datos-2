import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

//Ejercicio 1   
const argv= yargs(hideBin(process.argv))
    .option('nombre', {type: 'string', describe: 'Nombre del usuario', demandOption: true})
    .option ('edad', {type: 'number', describe: 'Edad del usuario', demandOption: true})
    .help()
//Ejercicio 2
    .check ((argv)=>{
        if (typeof argv.nombre !== 'string'){
            throw new Error ('El nombre debe ser un string');
        }
        if (typeof argv.edad !== 'number'){
            throw new Error ('La edad debe ser un número');
        }
        return true;
    })
    .argv;

console.log(`Hola ${argv.nombre}, tienes ${argv.edad} años.`);

//Ejercicio 5 
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { config } from './config.js';

const argv = yargs(hideBin(process.argv))
  .option('saludo', { type: 'string', describe: 'Texto de saludo', demandOption: true, alias: 's' })
  .help()
  .argv;

console.log(`Servidor corriendo en el puerto ${config.port} (modo ${config.mode}): ${argv.saludo}`);


