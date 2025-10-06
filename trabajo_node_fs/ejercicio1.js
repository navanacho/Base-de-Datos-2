/**
 * ejercicio1.js
 *
 * - Escribe en log.txt un mensaje de inicio con timestamp cada vez que se ejecute.
 * - Simula una tarea de 5 segundos (setTimeout), durante la cual escribe "Ejecutando tarea..."
 * - Al finalizar, escribe "Tarea completada".
 *
 * Comentarios: uso de fs.appendFile para añadir líneas al log.
 */

const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, 'log.txt');

function timestamp() {
  const d = new Date();
  const pad = (n)=> String(n).padStart(2,'0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function appendLog(line) {
  fs.appendFileSync(logPath, line + '\n', 'utf8');
}

// Inicio del programa
appendLog(`[${timestamp()}] - Inicio del programa`);

// Simulamos tarea de 5 segundos, y escribimos durante la ejecución:
appendLog(`[${timestamp()}] - Ejecutando tarea...`);

setTimeout(() => {
  appendLog(`[${timestamp()}] - Tarea completada`);
  console.log('Ejercicio 1 finalizado. Revisá log.txt');
}, 5000);
