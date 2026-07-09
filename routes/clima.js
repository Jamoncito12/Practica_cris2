const express = require('express');
const router = express.Router();
const { param, validationResult } = require('express-validator');
const { obtenerClima } = require('../services/clima');

function validar(req, res, next) {
  const errores = validationResult(req);
  if (!errores.isEmpty()) return res.status(400).json({ errores: errores.array() });
  next();
}

// GET /api/clima/:ciudad — devuelve el clima para la ciudad indicada
router.get('/:ciudad', param('ciudad').isString().trim().notEmpty(), validar, async (req, res) => {
  const ciudad = req.params.ciudad;
  try {
    const clima = await obtenerClima(ciudad);
    res.status(200).json(clima);
  } catch (error) {
    res.status(502).json({ error: error.message });
  }
});

module.exports = router;
