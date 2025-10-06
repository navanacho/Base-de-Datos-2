/**
 * ejercicio5.js
 *
 * Uso:
 *   node ejercicio5.js origen.txt destino.txt
 *
 * - Verifica existencia de origen
 * - Copia contenido a destino
 * - Mensaje de confirmación
 *
 * Comentarios: uso de fs.copyFileSync para operación simple.
 */

const fs = require('fs');
const path = require('path');

const [,, origen, destino] = process.argv;
if (!origen || !destino) {
  console.error('Uso: node ejercicio5.js origen.txt destino.txt');
  process.exit(1);
}

const origenPath = path.join(__dirname, origen);
const destinoPath = path.join(__dirname, destino);

if (!fs.existsSync(origenPath)) {
  console.error('Archivo origen no existe:', origen);
  process.exit(1);
}

try {
  fs.copyFileSync(origenPath, destinoPath);
  console.log(`Copia completada: ${origen} -> ${destino}`);
} catch (err) {
  console.error('Error copiando archivo:', err.message);
}
