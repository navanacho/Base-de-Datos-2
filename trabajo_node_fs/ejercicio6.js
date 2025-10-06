/**
 * ejercicio6.js
 *
 * - Crea directorio logs/ si no existe y archivo logs/app.log
 * - Cada ejecución agrega una línea con fecha, hora y 'Ejecución exitosa'
 * - Función para mostrar las últimas 5 ejecuciones
 *
 * Comentarios: uso de fs.appendFileSync y lectura de líneas.
 */

const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, 'logs');
const appLog = path.join(logsDir, 'app.log');

function timestamp() {
  const d = new Date();
  const pad = (n)=> String(n).padStart(2,'0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);

// 1) Agregar línea de ejecución
const line = `[${timestamp()}] - Ejecución exitosa\n`;
fs.appendFileSync(appLog, line, 'utf8');
console.log('Registro agregado a logs/app.log');

// 2) Mostrar últimas 5 ejecuciones
function mostrarUltimas(n = 5) {
  const raw = fs.readFileSync(appLog, 'utf8');
  const lines = raw.split(/\r?\n/).filter(Boolean);
  const last = lines.slice(-n);
  console.log('Últimas ejecuciones:');
  last.forEach(l => console.log(l));
}

if (require.main === module) {
  mostrarUltimas(5);
}

module.exports = { mostrarUltimas };
