// middlewares/errorHandler.js
const manejadorErrores = (err, req, res, next) => {
    console.error(' Error capturado:', err.stack || err.message);

    // Error por conflicto de integridad en MySQL (Ej: registro duplicado en campo UNIQUE)
    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
            mensaje: 'El registro ya existe en la base de datos'
        });
    }

    // Error por clave foránea referenciada (Ej: borrar un autor con libros)
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(400).json({
            mensaje: 'No se puede eliminar el recurso porque tiene otros datos asociados'
        });
    }

    // Respuesta genérica para errores no controlados
    res.status(err.statusCode || 500).json({
        mensaje: err.mensaje || 'Error interno del servidor'
    });
};

module.exports = manejadorErrores;