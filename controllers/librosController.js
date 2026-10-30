
const pool = require('../config/db');

// Consultar todos los libros
async function listarLibros(req, res) {
    try {
        const [libros] = await pool.execute(`
            SELECT libros.id, libros.titulo, libros.anio,
                   libros.autor_id, autores.nombre AS autor,
                   libros.disponible
            FROM libros
            INNER JOIN autores ON libros.autor_id = autores.id
            ORDER BY libros.titulo
        `);

        res.json(libros);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Consultar un libro por ID
async function buscarLibro(req, res) {
    const { id } = req.params;

    try {
        const [libros] = await pool.execute(
            'SELECT * FROM libros WHERE id = ?',
            [id]
        );

        if (libros.length === 0) {
            return res.status(404).json({
                mensaje: 'Libro no encontrado'
            });
        }

        res.json(libros[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Registrar un libro
async function registrarLibro(req, res) {
    const { titulo, anio, autor_id } = req.body;

    if (!titulo || !titulo.trim() || !autor_id) {
        return res.status(400).json({
            mensaje: 'El título y el ID del autor son obligatorios'
        });
    }

    try {
        const [resultado] = await pool.execute(
            'INSERT INTO libros (titulo, anio, autor_id) VALUES (?, ?, ?)',
            [titulo.trim(), anio || null, autor_id]
        );

        res.status(201).json({
            mensaje: 'Libro registrado correctamente',
            id: resultado.insertId,
            titulo: titulo.trim(),
            anio: anio || null,
            autor_id
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Actualizar un libro
async function actualizarLibro(req, res) {
    const { id } = req.params;
    const { titulo, anio, autor_id, disponible } = req.body;

    if (!titulo || !titulo.trim() || !autor_id) {
        return res.status(400).json({
            mensaje: 'El título y el ID del autor son obligatorios'
        });
    }

    try {
        const [resultado] = await pool.execute(
            `UPDATE libros
             SET titulo = ?, anio = ?, autor_id = ?, disponible = ?
             WHERE id = ?`,
            [titulo.trim(), anio || null, autor_id,
             disponible === undefined ? 1 : disponible, id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: 'Libro no encontrado'
            });
        }

        res.json({
            mensaje: 'Libro actualizado correctamente'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Eliminar un libro
async function eliminarLibro(req, res) {
    const { id } = req.params;

    try {
        const [resultado] = await pool.execute(
            'DELETE FROM libros WHERE id = ?',
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: 'Libro no encontrado'
            });
        }

        res.json({
            mensaje: 'Libro eliminado correctamente'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    listarLibros,
    buscarLibro,
    registrarLibro,
    actualizarLibro,
    eliminarLibro
};
