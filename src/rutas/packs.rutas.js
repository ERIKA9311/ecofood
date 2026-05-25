const express = require('express');
const router = express.Router();
const { crearPack, obtenerPacks, obtenerPacksPorUsuario,reservarPack, eliminarPack } = require('../controles/packs.controles');

// Estas rutas se sumarán a /api/packs
router.get('/', obtenerPacks);    
router.put('/reservar/:id', reservarPack);               // GET /api/packs
router.get('/usuario/:usuario_id', obtenerPacksPorUsuario); // GET /api/packs/usuario/:id
router.post('/', crearPack);   
router.delete('/:id', eliminarPack);                 // POST /api/packs


module.exports = router;