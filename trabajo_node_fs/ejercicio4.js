/**
 * ejercicio4.js
 *
 * Uso:
 *   node ejercicio4.js archivo.txt palabra
 *
 * - Lee el archivo pasado por argumento
 * - Cuenta cuántas veces aparece la palabra (case-insensitive)
 * - Imprime el resultado
 *
 * Comentarios: se normaliza texto y se cuenta con split/regExp
 */

const fs = require('fs');
const path = require('path');

const [,, fileArg, wordArg] = process.argv;

if (!fileArg || !wordArg) {
  console.error('Uso: node ejercicio4.js archivo.txt palabra');
  process.exit(1);
}

const filePath = path.join(__dirname, fileArg);
if (!fs.existsSync(filePath)) {
  console.error('El archivo no existe:', fileArg);
  process.exit(1);
}

const text = fs.readFileSync(filePath, 'utf8');
// Normalizamos: sacamos signos de puntuación básicos y hacemos lower case
const normalized = text.replace(/[.,;:!?()\[\]\"']/g, ' ').toLowerCase();
const words = normalized.split(/\s+/).filter(Boolean);
const target = wordArg.toLowerCase();

const count = words.reduce((acc, w) => acc + (w === target ? 1 : 0), 0);

console.log(`La palabra "${wordArg}" aparece ${count} veces en el archivo "${fileArg}".`);
