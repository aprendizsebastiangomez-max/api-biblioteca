const express = require('express');
const router = express.Router();

const {
    registrarDevolucion,
    listarPrestamos // <--- Asegúrate de tener este controlador o crea uno temporal
} = require('../controllers/prestamosController');

// Ruta GET para listar los préstamos (la que estabas probando en Swagger)
router.get('/', (req, res) => {
    res.json({ mensaje: "Lista de préstamos obtenida con éxito" });
});

// Ruta POST existente para devolución
router.post('/devolucion', registrarDevolucion);

module.exports = router;