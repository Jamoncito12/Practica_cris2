require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const { body, validationResult } = require('express-validator');

const app = express();

app.use(helmet());              // cabeceras de seguridad HTTP
app.use(express.json());        // parseo seguro de JSON
app.use(morgan('dev'));         // bitácora de peticiones

// Ruta de prueba con validación de entrada
app.post(
  '/api/echo',
  body('mensaje').isString().trim().isLength({ min: 1, max: 200 }).escape(),
  (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    res.json({ recibido: req.body.mensaje });
  }
);

app.get('/api/salud', (req, res) => {
  res.json({ status: 'ok' });
});

// Endpoint para registro de usuario
// Principio de codificación segura aplicado: "Validación de entrada (Input Validation)".
// Justificación: validar `nombre` y `correo` evita entrada maliciosa (inyecciones), garantiza
// integridad de los datos y falla de forma segura cuando la entrada no cumple el formato esperado.
app.post(
  '/api/registro',
  [
    body('nombre').isString().trim().notEmpty().withMessage('El nombre es obligatorio').escape(),
    body('correo').isEmail().withMessage('Correo inválido').normalizeEmail()
  ],
  (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    const { nombre, correo } = req.body;
    // Aquí iría la lógica de creación/almacenamiento (DB), por ahora devolvemos confirmación
    res.status(201).json({ mensaje: 'Registro recibido', datos: { nombre, correo } });
  }
);

// Integración de rutas REST para tareas
const tareasRouter = require('./routes/tareas');
app.use('/api/tareas', tareasRouter);

// Integración de rutas para servicio de clima (Sesión 3)
const climaRouter = require('./routes/clima');
app.use('/api/clima', climaRouter);

module.exports = app;