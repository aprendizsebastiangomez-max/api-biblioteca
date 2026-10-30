
const express = require('express');
const router = express.Router();

const {
    listarLibros,
    buscarLibro,
    registrarLibro,
    actualizarLibro,
    eliminarLibro
} = require('../controllers/librosController');

router.get('/', listarLibros);
router.get('/:id', buscarLibro);
router.post('/', registrarLibro);
router.put('/:id', actualizarLibro);
router.delete('/:id', eliminarLibro);

module.exports = router;
