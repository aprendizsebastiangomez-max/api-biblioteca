
const pool = require('../config/db');

async function registrarDevolucion(req, res) {
    const { prestamo_id } = req.body;

    if (!prestamo_id) {
        return res.status(400).json({
            mensaje: 'El ID del préstamo es obligatorio.'
        });
    }

    let conexion;

    try {
        conexion = await pool.getConnection();

        await conexion.beginTransaction();

        const [prestamos] = await conexion.execute(
            'SELECT id, libro_id, fecha_devolucion FROM prestamos WHERE id = ? FOR UPDATE',
            [prestamo_id]
        );

        if (prestamos.length === 0) {
            throw new Error('El préstamo especificado no existe.');
        }

        const prestamo = prestamos[0];

        if (prestamo.fecha_devolucion !== null) {
            throw new Error('Este préstamo ya fue devuelto con anterioridad.');
        }

        await conexion.execute(
            'UPDATE prestamos SET fecha_devolucion = NOW() WHERE id = ?',
            [prestamo_id]
        );

        await conexion.execute(
            'UPDATE libros SET disponible = TRUE WHERE id = ?',
            [prestamo.libro_id]
        );

        await conexion.commit();

        res.status(200).json({
            mensaje: 'Devolución registrada con éxito y libro marcado como disponible.'
        });

    } catch (error) {
        if (conexion) {
            await conexion.rollback();
        }

        res.status(400).json({
            mensaje: error.message
        });

    } finally {
        if (conexion) {
            conexion.release();
        }
    }
}

module.exports = {
    registrarDevolucion
};
