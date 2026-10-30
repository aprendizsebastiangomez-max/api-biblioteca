// 1. CARGAR DOTENV AL INICIO ABSOLUTO
require('dotenv').config();

const express = require('express');
const mysql = require('mysql2/promise');
const app = express();

app.use(express.json());

// 2. CONFIGURAR EL POOL USANDO process.env
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT) || 3306
});

// ==========================================
// 1. ENDPOINTS DE AUTORES (POST, PUT, DELETE)
// ==========================================

// --- CREAR AUTOR (POST) ---
app.post('/api/autores', async (req, res) => {
  const { nombre, nacionalidad } = req.body;

  // Validación de campos obligatorios
  if (!nombre) {
    return res.status(400).json({ mensaje: 'El nombre del autor es obligatorio.' });
  }

  try {
    const [resultado] = await pool.execute(
      'INSERT INTO autores (nombre, nacionalidad) VALUES (?, ?)',
      [nombre, nacionalidad || null]
    );
    res.status(201).json({
      id: resultado.insertId,
      nombre,
      nacionalidad
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- ACTUALIZAR AUTOR (PUT) ---
app.put('/api/autores/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, nacionalidad } = req.body;

  // Validación de campos obligatorios
  if (!nombre) {
    return res.status(400).json({ mensaje: 'El nombre del autor es obligatorio.' });
  }

  try {
    const [resultado] = await pool.execute(
      'UPDATE autores SET nombre = ?, nacionalidad = ? WHERE id = ?',
      [nombre, nacionalidad, id]
    );

    // Si affectedRows es 0, significa que no existe un autor con ese ID
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Autor no encontrado.' });
    }

    res.json({ mensaje: 'Autor actualizado correctamente.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- ELIMINAR AUTOR (DELETE) ---
app.delete('/api/autores/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [resultado] = await pool.execute(
      'DELETE FROM autores WHERE id = ?',
      [id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'El autor no existe.' });
    }

    res.json({ mensaje: 'Autor eliminado correctamente.' });
  } catch (error) {
    // Manejo del error si el autor tiene libros asignados (Llave Foránea)
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({
        mensaje: 'No se puede eliminar el autor: tiene libros asociados.'
      });
    }
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});


// ===================================================
// 2. TRANSACCIÓN: DEVOLUCIÓN DE PRÉSTAMO (POST)
// ===================================================

app.post('/api/prestamos/devolucion', async (req, res) => {
  const { prestamo_id } = req.body;

  // Validación de campos obligatorios
  if (!prestamo_id) {
    return res.status(400).json({ mensaje: 'El ID del préstamo es obligatorio.' });
  }

  // Se pide una conexión exclusiva para la transacción
  const conexion = await pool.getConnection();

  try {
    // 1. Iniciar la transacción
    await conexion.beginTransaction();

    // 2. Verificar si el préstamo existe y si aún no se ha devuelto (fecha_devolucion en NULL)
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

    // 3. Guardar la fecha actual de devolución
    await conexion.execute(
      'UPDATE prestamos SET fecha_devolucion = NOW() WHERE id = ?',
      [prestamo_id]
    );

    // 4. Volver a colocar el libro como disponible (disponible = TRUE)
    await conexion.execute(
      'UPDATE libros SET disponible = TRUE WHERE id = ?',
      [prestamo.libro_id]
    );

    // 5. Confirmar y guardar todos los cambios en la base de datos
    await conexion.commit();

    res.status(200).json({
      mensaje: 'Devolución registrada con éxito y libro marcado como disponible.'
    });

  } catch (error) {
    // Si algo falló en cualquiera de los pasos, deshacer todo
    await conexion.rollback();
    res.status(400).json({ mensaje: error.message });
  } finally {
    // Liberar la conexión para que otros usuarios la puedan usar
    conexion.release();
  }
});

// ===================================================
// 3. INICIO DEL SERVIDOR
// ===================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});