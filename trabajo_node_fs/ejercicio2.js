/**
 * ejercicio2.js
 *
 * 1) Crea datos.txt con Nombre, Edad, Carrera (editar variables USER_NAME, AGE, CAREER)
 * 2) Lee datos.txt y lo muestra en consola.
 * 3) Agrega fecha de modificación.
 * 4) Renombra a informacion.txt
 * 5) Elimina informacion.txt tras 10 segundos
 *
 * Comentarios: usamos promesas con fs.promises para manejo claro.
 */

const fs = require('fs').promises;
const path = require('path');

const USER_NAME = 'Ignacio';
const AGE = '30';
const CAREER = 'Programación';

const datosPath = path.join(__dirname, 'datos.txt');
const infoPath = path.join(__dirname, 'informacion.txt');

function nowTimestamp() {
  const d = new Date();
  const pad = (n)=> String(n).padStart(2,'0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

async function main() {
  // 1) Crear datos.txt
  const content = `Nombre: ${USER_NAME}\nEdad: ${AGE}\nCarrera: ${CAREER}\n`;
  await fs.writeFile(datosPath, content, 'utf8');
  console.log('datos.txt creado.');

  // 2) Leer e imprimir
  const read = await fs.readFile(datosPath, 'utf8');
  console.log('Contenido de datos.txt:\n', read);

  // 3) Agregar fecha y hora actuales
  await fs.appendFile(datosPath, `\nFecha de modificación: ${nowTimestamp()}\n`, 'utf8');
  console.log('Fecha de modificación agregada.');

  // 4) Renombrar a informacion.txt
  await fs.rename(datosPath, infoPath);
  console.log('Archivo renombrado a informacion.txt');

  // 5) Eliminar tras 10 segundos
  console.log('El archivo informacion.txt será eliminado en 10 segundos...');
  setTimeout(async () => {
    try {
      await fs.unlink(infoPath);
      console.log('informacion.txt eliminado.');
    } catch (err) {
      console.error('Error al eliminar:', err.message);
    }
  }, 10000);
}

main().catch(err => {
  console.error('Error en ejercicio2:', err);
});
