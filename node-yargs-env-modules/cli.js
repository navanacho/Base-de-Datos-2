import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import * as math from './math.js';
import { leerJson } from './utils/readJson.js';

yargs(hideBin(process.argv))
  .command('saludar', 'Saluda a una persona', {
    nombre: { alias: 'n', demandOption: true, type: 'string' }
  }, (argv) => {
    console.log(`¡Hola ${argv.nombre}!`);
  })
  .command('despedir', 'Despedir a una persona', {
    nombre: { alias: 'n', demandOption: true, type: 'string' }
  }, (argv) => {
    console.log(`Adiós ${argv.nombre}!`);
  })
  .command('calcular', 'Realiza operación aritmética', {
    operacion: { alias: 'o', demandOption: true, type: 'string', choices: ['suma','resta','multiplicacion','division'] },
    n1: { demandOption: true, type: 'number' },
    n2: { demandOption: true, type: 'number' }
  }, (argv) => {
    try {
      const { operacion, n1, n2 } = argv;
      let result;
      switch(operacion){
        case 'suma': result = math.suma(n1,n2); break;
        case 'resta': result = math.resta(n1,n2); break;
        case 'multiplicacion': result = math.multiplicacion(n1,n2); break;
        case 'division': result = math.division(n1,n2); break;
      }
      console.log(`Resultado: ${result}`);
    } catch (err) {
      console.error('Error:', err.message);
    }
  })
  .command('leer-json', 'Lee y muestra un JSON', {
    archivo: { alias: 'a', demandOption: true, type: 'string' }
  }, async (argv) => {
    try {
      const data = await leerJson(argv.archivo);
      console.log('Contenido:', JSON.stringify(data, null, 2));
    } catch (err) {
      console.error('Error leyendo JSON:', err.message);
    }
  })
  .demandCommand(1, 'Debes pasar al menos un comando')
  .help()
  .parse();
