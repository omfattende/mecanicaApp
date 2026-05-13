const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET: Obtener todas las tareas de una cita
router.get('/cita/:citaId', async (req, res) => {
    try {
        const citaId = req.params.citaId;
        const result = await pool.query(`
      SELECT * FROM tareas_servicio
      WHERE cita_id = $1
      ORDER BY fecha_creacion ASC
    `, [citaId]);
        res.json({ success: true, tareas: result.rows });
    } catch (error) {
        console.error('Error al obtener tareas:', error);
        res.status(500).json({ success: false, message: 'Error al obtener las tareas' });
    }
});

// POST: Crear una nueva tarea para una cita
router.post('/', async (req, res) => {
    try {
        const { cita_id, descripcion } = req.body;

        if (!cita_id || !descripcion) {
            return res.status(400).json({ success: false, message: 'Se requiere cita_id y descripcion' });
        }

        const result = await pool.query(`
      INSERT INTO tareas_servicio (cita_id, descripcion)
      VALUES ($1, $2)
      RETURNING *
    `, [cita_id, descripcion]);

        res.status(201).json({ success: true, tarea: result.rows[0], message: 'Tarea creada exitosamente' });
    } catch (error) {
        console.error('Error al crear tarea:', error);
        res.status(500).json({ success: false, message: 'Error al crear la tarea' });
    }
});

// PUT: Actualizar el estado (completada) de una tarea
router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { completada } = req.body;

        const result = await pool.query(`
      UPDATE tareas_servicio
      SET completada = $1
      WHERE id = $2
      RETURNING *
    `, [completada, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Tarea no encontrada' });
        }

        res.json({ success: true, tarea: result.rows[0], message: 'Tarea actualizada' });
    } catch (error) {
        console.error('Error al actualizar tarea:', error);
        res.status(500).json({ success: false, message: 'Error al actualizar la tarea' });
    }
});

// DELETE: Eliminar una tarea
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const result = await pool.query(`
      DELETE FROM tareas_servicio
      WHERE id = $1
      RETURNING id
    `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Tarea no encontrada' });
        }

        res.json({ success: true, message: 'Tarea eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar tarea:', error);
        res.status(500).json({ success: false, message: 'Error al eliminar la tarea' });
    }
});

module.exports = router;
