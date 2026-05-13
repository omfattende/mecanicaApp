const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET: Obtener todas las citas
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT c.*, u.nombre as cliente_nombre, u.telefono as cliente_telefono, 
             v.marca, v.modelo, v.placa 
      FROM citas c
      JOIN usuarios u ON c.usuario_id = u.id
      LEFT JOIN vehiculos v ON c.vehiculo_id = v.id
      ORDER BY c.fecha, c.hora
    `);
        res.json({ success: true, citas: result.rows });
    } catch (error) {
        console.error('Error al obtener citas:', error);
        res.status(500).json({ success: false, message: 'Error al obtener las citas' });
    }
});

// GET: Obtener citas por cliente
router.get('/cliente/:usuarioId', async (req, res) => {
    try {
        const userId = req.params.usuarioId;
        const result = await pool.query(`
      SELECT c.*, v.marca, v.modelo, v.placa 
      FROM citas c
      LEFT JOIN vehiculos v ON c.vehiculo_id = v.id
      WHERE c.usuario_id = $1
      ORDER BY c.fecha DESC, c.hora DESC
    `, [userId]);
        res.json({ success: true, citas: result.rows });
    } catch (error) {
        console.error('Error al obtener citas del cliente:', error);
        res.status(500).json({ success: false, message: 'Error al obtener las citas del cliente' });
    }
});

// POST: Crear una nueva cita
router.post('/', async (req, res) => {
    try {
        const {
            usuario_id, vehiculo_id, fecha, hora, servicio, descripcion,
            repuestos_solicitados, repuestos_propios
        } = req.body;

        const result = await pool.query(`
      INSERT INTO citas (
        usuario_id, vehiculo_id, fecha, hora, servicio, descripcion, 
        repuestos_solicitados, repuestos_propios
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
            usuario_id, vehiculo_id, fecha, hora, servicio, descripcion,
            repuestos_solicitados || null, repuestos_propios || null
        ]);

        res.status(201).json({ success: true, cita: result.rows[0], message: 'Cita creada exitosamente' });
    } catch (error) {
        console.error('Error al crear cita:', error);
        res.status(500).json({ success: false, message: 'Error detallado de BD: ' + error.message });
    }
});

// PUT: Actualizar el estado de una cita
router.put('/:id/estado', async (req, res) => {
    try {
        const id = req.params.id;
        const { estado } = req.body;

        if (!estado) {
            return res.status(400).json({ success: false, message: 'El estado es requerido' });
        }

        const result = await pool.query(`
      UPDATE citas
      SET estado = $1
      WHERE id = $2
      RETURNING *
    `, [estado, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Cita no encontrada' });
        }

        res.json({ success: true, cita: result.rows[0], message: 'Estado actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar estado:', error);
        res.status(500).json({ success: false, message: 'Error al actualizar el estado' });
    }
});

module.exports = router;
