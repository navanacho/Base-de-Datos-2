/**
 * demo.js

 Ejecuta secuencialmente algunos ejercicios para verificar comportamiento.
 ejercicio1 (logging)
 ejercicio2 (crea y renombra archivo)
 ejercicio3 (manejo contactos)
 ejercicio6 (logs)
 ejercicio2 elimina informacion.txt después de 10s, demo espera esos 11s antes de finalizar.
 */

const { execSync } = require('child_process');
console.log('Ejecutando ejercicio1...');
execSync('node ejercicio1.js', { stdio: 'inherit' });

console.log('\nEjecutando ejercicio2...');
execSync('node ejercicio2.js', { stdio: 'inherit' });

console.log('\nEjecutando ejercicio3...');
execSync('node ejercicio3.js', { stdio: 'inherit' });

console.log('\nEjecutando ejercicio6...');
execSync('node ejercicio6.js', { stdio: 'inherit' });

console.log('\nDemo finalizado. Recordá que ejercicio2 borra informacion.txt tras 10s.');
