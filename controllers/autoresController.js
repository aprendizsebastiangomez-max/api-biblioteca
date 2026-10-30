
const pool = require('../config/db');

// Consultar todos los autores
async function listarAutores(req, res) {
    try {
        const [autores] = await pool.execute(
            'SELECT * FROM autores ORDER BY nombre'
        );

        res.json(autores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Buscar autores por nacionalidad
async function buscarPorNacionalidad(req, res) {
    const { nacionalidad } = req.params;

    try {
        const [autores] = await pool.execute(
            'SELECT * FROM autores WHERE nacionalidad = ?',
            [nacionalidad]
        );

        res.json(autores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Buscar un autor por ID
async function buscarAutor(req, res) {
    const { id } = req.params;

    try {
        const [autores] = await pool.execute(
            'SELECT * FROM autores WHERE id = ?',
            [id]
        );

        if (autores.length === 0) {
            return res.status(404).json({
                mensaje: 'Autor no encontrado'
            });
        }

        res.json(autores[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Registrar un autor
async function registrarAutor(req, res) {
    const { nombre, nacionalidad } = req.body;

    if (!nombre || !nombre.trim()) {
        return res.status(400).json({
            mensaje: 'El nombre del autor es obligatorio'
        });
    }

    try {
        const [resultado] = await pool.execute(
            'INSERT INTO autores (nombre, nacionalidad) VALUES (?, ?)',
            [nombre.trim(), nacionalidad || null]
        );

        res.status(201).json({
            mensaje: 'Autor registrado correctamente',
            id: resultado.insertId,
            nombre: nombre.trim(),
            nacionalidad: nacionalidad || null
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Actualizar un autor
async function actualizarAutor(req, res) {
    const { id } = req.params;
    const { nombre, nacionalidad } = req.body;

    if (!nombre || !nombre.trim()) {
        return res.status(400).json({
            mensaje: 'El nombre del autor es obligatorio'
        });
    }

    try {
        const [resultado] = await pool.execute(
            'UPDATE autores SET nombre = ?, nacionalidad = ? WHERE id = ?',
            [nombre.trim(), nacionalidad || null, id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: 'Autor no encontrado'
            });
        }

        res.json({
            mensaje: 'Autor actualizado correctamente'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Eliminar un autor
async function eliminarAutor(req, res) {
    const { id } = req.params;

    try {
        const [resultado] = await pool.execute(
            'DELETE FROM autores WHERE id = ?',
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: 'El autor no existe'
            });
        }

        res.json({
            mensaje: 'Autor eliminado correctamente'
        });
    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({
                mensaje: 'No se puede eliminar el autor porque tiene libros asociados'
            });
        }

        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    listarAutores,
    buscarPorNacionalidad,
    buscarAutor,
    registrarAutor,
    actualizarAutor,
    eliminarAutor
};
