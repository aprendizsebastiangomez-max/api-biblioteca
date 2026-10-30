
const express = require('express');
const router = express.Router();

const {
    listarAutores,
    buscarPorNacionalidad,
    buscarAutor,
    registrarAutor,
    actualizarAutor,
    eliminarAutor
} = require('../controllers/autoresController');

// Consultas
router.get('/nacionalidad/:nacionalidad', buscarPorNacionalidad);
router.get('/', listarAutores);
router.get('/:id', buscarAutor);

// Operaciones CRUD
router.post('/', registrarAutor);
router.put('/:id', actualizarAutor);
router.delete('/:id', eliminarAutor);

module.exports = router;
