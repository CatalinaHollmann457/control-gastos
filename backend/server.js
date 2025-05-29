const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PUERTO = 3000;

app.use(cors());
app.use(bodyParser.json());

let usuarios = [];
let gastos = [];
let sesiones = {}; 

app.post('/api/registro', (req, res) => {
  const { nombre, apellido, email, contrasena, confirmar_contrasena } = req.body;

  if (!email.includes('@')) {
    return res.status(400).json({ mensaje: "El email no es válido." });
  }

  if (contrasena !== confirmar_contrasena) {
    return res.status(400).json({ mensaje: "Las contraseñas no coinciden." });
  }

  const yaExiste = usuarios.find(usuario => usuario.email === email);
  if (yaExiste) {
    return res.status(400).json({ mensaje: "El correo electrónico ya está registrado." });
  }

  usuarios.push({ nombre, apellido, email, contrasena });
  res.json({ mensaje: "Registro exitoso." });
});

app.post('/api/login', (req, res) => {
  const { email, contrasena } = req.body;

  const usuario = usuarios.find(u => u.email === email && u.contrasena === contrasena);
  if (!usuario) {
    return res.status(401).json({ mensaje: "Credenciales incorrectas." });
  }

  const token = Math.random().toString(36).substring(2);
  sesiones[token] = email;

  res.json({ mensaje: "Inicio de sesión exitoso.", token });
});

function autenticar(req, res, next) {
  const token = req.headers.authorization;

  if (!token || !sesiones[token]) {
    return res.status(401).json({ mensaje: "Usuario no autenticado." });
  }

  req.usuario = sesiones[token];
  next();
}

app.post('/api/gastos', autenticar, (req, res) => {
  const { monto, categoria, fecha, descripcion } = req.body;

  if (isNaN(monto) || monto <= 0) {
    return res.status(400).json({ mensaje: "El monto ingresado no es válido." });
  }

  if (!categoria || !fecha) {
    return res.status(400).json({ mensaje: "Faltan campos obligatorios." });
  }

  const gasto = {
    id: gastos.length + 1,
    email: req.usuario,
    monto,
    categoria,
    fecha,
    descripcion
  };

  gastos.push(gasto);
  res.json({ mensaje: "Gasto registrado correctamente." });
});

app.get('/api/gastos', autenticar, (req, res) => {
  const gastosUsuario = gastos.filter(g => g.email === req.usuario);
  res.json({ mis_gastos: gastosUsuario });
});

app.delete('/api/gastos/:id', autenticar, (req, res) => {
  const id = parseInt(req.params.id);
  const indice = gastos.findIndex(g => g.id === id && g.email === req.usuario);

  if (indice === -1) {
    return res.status(404).json({ mensaje: "Gasto no encontrado o no pertenece al usuario." });
  }

  gastos.splice(indice, 1);
  res.json({ mensaje: "Gasto eliminado correctamente." });
});

module.exports = app;
if (require.main === module) {
  app.listen(PUERTO, () => {
    console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
  });
}
