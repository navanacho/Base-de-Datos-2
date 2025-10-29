const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let conadorPeticiones = 0;

//registro fecha,url, ip
app.use((req, res, next) => {
  contador++;
  const fecha = new Date().toISOString();
  const metodo = req.method;
  const url = req.originalUrl;
  const ip = req.ip;

  console.log(`[${fecha}] ${metodo} ${url} - IP: ${ip} (Petición #${contador})`);
  next();
});


//mensaje bienvenida
app.get('/', (req, res) => {
    res.status(200).send('Bienvenido a la API del tp n2');
});

//saludo personalizado
app.get('/saludo/:nombre', (req, res) => {
    const {nombre} = req.params;
    res.status(200).send(`Hola, ${nombre}`);
});

//suma con query
app.get('/suma', (req, res) => {
    const {num1, num2} = req.query;

    if (num1 == undefined || num2 == undefined){
        return res.status(400).send('Faltan parámetros numero 1 o numero 2');
    }

    const a = parseFloat(num1);
    const b = parseFloat(num2);

    if (isNaN(a) || isNaN(b)) {
        return res.status(400).send('num1 y num2 deben ser números válidos');
    }

  res.status(200).json({ num1: a, num2: b, suma: a + b });
});

//devuelve la fecha actual en formato ISO
app.get('/fecha', (req, res) => {
    res.status(200).json({fecha: new Date().toISOString()});
});

//validacion de edad
function validarEdad(req, rea, next){
    const {edad} = req.query;

    if (edad === undefined){
        return res.status(400).send('Falta el parámetro edad');
    }

    const edadNum = Number(edad);
    if (isNaN(edadNum)){
        return res.status(400).send('la edad debe ser un numero');
    }

    if (edadNum < 18){
        return res.status(400).send('Acceso denegado')
    }

    next();
}

//middleware para validar edad
app.get('/edad', validarEdad, (req, res) => {
  res.status(200).send('Acceso permitido');
});

//validar que el id sea numero entero 
app.get('/producto/:id', (req, res) => {
  const { id } = req.params;
  const idNum = Number(id);

  if (isNaN(idNum) || !Number.isInteger(idNum)) {
    return res.status(400).send('El id debe ser un número entero válido');
  }

  res.status(200).json({ mensaje: `Producto solicitado con id ${idNum}`, id: idNum });
});

//recibe notas por query y devuelve promedio 
app.get('/promedio', (req, res) => {
  const { n1, n2, n3 } = req.query;

  if (n1 === undefined || n2 === undefined || n3 === undefined) {
    return res.status(400).send('Faltan notas: n1, n2 y n3 son requeridas');
  }

  const notas = [n1, n2, n3].map(n => parseFloat(n));
  if (notas.some(isNaN)) {
    return res.status(400).send('n1, n2 y n3 deben ser números válidos');
  }

  const promedio = (notas[0] + notas[1] + notas[2]) / 3;
  res.status(200).json({ n1: notas[0], n2: notas[1], n3: notas[2], promedio });
});

//devuelve hora actual del servidor
app.get('/hora', (req, res) => {
  const hora = new Date().toLocaleTimeString();
  res.status(200).json({ hora });
});

// 404: Ruta no definida
app.use((req, res) => {
  res.status(404).send('Ruta no encontrada');
});

// 500: Error interno (middleware de error)
app.use((err, req, res, next) => {
  console.error('Error interno del servidor:', err);
  res.status(500).send('Error interno del servidor');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});