// commonjs/saludo.js
function saludar(nombre) {
  console.log(`Hola ${nombre} (CommonJS)!`);
}
module.exports = { saludar };

// esm/saludo.js
export function saludar(nombre) {
  console.log(`Hola ${nombre} (ESM)!`);
}
