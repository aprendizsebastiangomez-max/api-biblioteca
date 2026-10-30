// middlewares/validators.js
const { body, validationResult } = require('express-validator');

// Middleware genérico para procesar y responder si hay errores de validación
const validarCampos = (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ 
            mensaje: 'Datos de entrada no válidos',
            errores: errores.array() 
        });
    }
    next();
};

// Validaciones para Autores (POST y PUT)
const validarAutor = [
    body('nombre')
        .notEmpty().withMessage('El nombre del autor es obligatorio')
        .isString().withMessage('El nombre debe ser una cadena de texto')
        .trim(),
    body('nacionalidad')
        .optional()
        .isString().withMessage('La nacionalidad debe ser una cadena de texto')
        .trim(),
    validarCampos
];

// Validaciones para Libros (POST y PUT)
const validarLibro = [
    body('titulo')
        .notEmpty().withMessage('El título del libro es obligatorio')
        .trim(),
    body('autor_id')
        .notEmpty().withMessage('El ID del autor es obligatorio')
        .isInt({ min: 1 }).withMessage('El autor_id debe ser un número entero válido'),
    body('anio')
        .optional()
        .isInt({ min: 1000, max: new Date().getFullYear() })
        .withMessage(`El año debe ser un número entre 1000 y ${new Date().getFullYear()}`),
    validarCampos
];

// Validaciones para Registro / Login
const validarUsuario = [
    body('correo')
        .isEmail().withMessage('Debe proporcionar un correo electrónico válido')
        .normalizeEmail(),
    body('clave')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    validarCampos
];

module.exports = {
    validarAutor,
    validarLibro,
    validarUsuario
};