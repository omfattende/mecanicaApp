const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET: Migrar BD temporal (estado y tareas)
router.get('/migrate', async (req, res) => {
    try {
        await pool.query(`ALTER TABLE citas ADD COLUMN IF NOT EXISTS estado VARCHAR(50) DEFAULT 'Pendiente';`);
        await pool.query(`
          CREATE TABLE IF NOT EXISTS tareas_servicio (
            id SERIAL PRIMARY KEY,
            cita_id INTEGER REFERENCES citas(id) ON DELETE CASCADE,
            descripcion VARCHAR(255) NOT NULL,
            completada BOOLEAN DEFAULT false,
            fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `);
        res.json({ success: true, message: 'DB migrada exitosamente' });
    } catch (error) {
        console.error('Error in mig', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET: Obtener vehículos por usuario
router.get('/usuario/:usuarioId', async (req, res) => {
    try {
        const { usuarioId } = req.params;
        const result = await pool.query(
            'SELECT * FROM vehiculos WHERE usuario_id = $1 ORDER BY created_at DESC',
            [usuarioId]
        );
        res.json({ success: true, vehiculos: result.rows });
    } catch (error) {
        console.error('Error al obtener vehículos:', error);
        res.status(500).json({ success: false, message: 'Error al obtener vehículos' });
    }
});

// POST: Registrar un nuevo vehículo
router.post('/', async (req, res) => {
    try {
        const { usuario_id, marca, modelo, anio, placa, color, kilometraje } = req.body;

        // Verificar si la placa ya existe
        const placaCheck = await pool.query('SELECT * FROM vehiculos WHERE placa = $1', [placa]);
        if (placaCheck.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'La placa ya está registrada' });
        }

        const result = await pool.query(`
      INSERT INTO vehiculos (usuario_id, marca, modelo, anio, placa, color, kilometraje)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [usuario_id, marca, modelo, anio, placa, color || null, kilometraje || null]);

        res.status(201).json({ success: true, vehiculo: result.rows[0], message: 'Vehículo registrado exitosamente' });
    } catch (error) {
        console.error('Error al registrar vehículo:', error);
        res.status(500).json({ success: false, message: 'Error de BD: ' + error.message });
    }
});

module.exports = router;
