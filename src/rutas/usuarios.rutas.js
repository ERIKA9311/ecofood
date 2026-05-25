const express = require('express');
const router = express.Router();
const { registrarUsuario, loginUsuario } = require('../controles/usuarios.control');

// Ruta para registrar un nuevo restaurante
router.post('/registro', registrarUsuario);
router.post('/login', loginUsuario);

module.exports = router;