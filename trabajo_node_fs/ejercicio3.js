/**
 * ejercicio3.js
 *
 * - Maneja contactos.json:
 *   - agregarContacto(nombre, telefono, email)
 *   - mostrarContactos()
 *   - eliminarContacto(nombre)
 *
 * Comentarios: se lee el JSON, se modifica el array y se escribe de nuevo.
 */

const fs = require('fs').promises;
const path = require('path');

const contactosPath = path.join(__dirname, 'contactos.json');

async function readContactos() {
  try {
    const raw = await fs.readFile(contactosPath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

async function writeContactos(arr) {
  await fs.writeFile(contactosPath, JSON.stringify(arr, null, 2), 'utf8');
}

// Agregar contacto
async function agregarContacto(nombre, telefono, email) {
  const contactos = await readContactos();
  // Validación simple: evitar duplicados por nombre
  if (contactos.some(c => c.nombre === nombre)) {
    console.log('Ya existe un contacto con ese nombre:', nombre);
    return;
  }
  contactos.push({ nombre, telefono, email });
  await writeContactos(contactos);
  console.log('Contacto agregado:', nombre);
}

// Mostrar contactos
async function mostrarContactos() {
  const contactos = await readContactos();
  console.log('Contactos actuales (total:', contactos.length + '):');
  contactos.forEach((c, i) => {
    console.log(`${i+1}. ${c.nombre} - ${c.telefono} - ${c.email}`);
  });
}

// Eliminar contacto por nombre
async function eliminarContacto(nombre) {
  const contactos = await readContactos();
  const filtered = contactos.filter(c => c.nombre !== nombre);
  if (filtered.length === contactos.length) {
    console.log('No se encontró contacto con nombre:', nombre);
    return;
  }
  await writeContactos(filtered);
  console.log('Contacto eliminado:', nombre);
}

// Código de prueba cuando se ejecuta directamente
async function main() {
  await agregarContacto('Carlos López', '987-654-3210', 'carlos@example.com');
  await mostrarContactos();
  await eliminarContacto('Juan Pérez');
  await mostrarContactos();
}

if (require.main === module) {
  main().catch(err => console.error(err));
}

module.exports = { agregarContacto, mostrarContactos, eliminarContacto };
