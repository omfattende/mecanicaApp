const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET: Obtener todos los usuarios (clientes y administradores)
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, username, email, nombre, telefono, tipo, created_at 
            FROM usuarios
            ORDER BY created_at DESC
        `);
        res.json({ success: true, usuarios: result.rows });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ success: false, message: 'Error al obtener usuarios' });
    }
});

// PUT: Actualizar un usuario específico
router.put('/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const { nombre, email, telefono, username, password } = req.body;

        if (!nombre || !email || !telefono || !username) {
            return res.status(400).json({ success: false, message: 'Todos los campos básicos son requeridos' });
        }

        // Check if the new username or email already belongs to another user
        const duplicateCheck = await pool.query(
            'SELECT id FROM usuarios WHERE (username = $1 OR email = $2) AND id != $3',
            [username, email, userId]
        );

        if (duplicateCheck.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'El usuario o email elegido ya está en uso por otra persona' });
        }

        let updateQuery = `UPDATE usuarios SET nombre = $1, email = $2, telefono = $3, username = $4`;
        let queryParams = [nombre, email, telefono, username];

        if (password && password.trim() !== '') {
            const bcrypt = require('bcrypt');
            const hashedPassword = await bcrypt.hash(password, 10);
            updateQuery += `, password = $5`;
            queryParams.push(hashedPassword);
        }

        updateQuery += ` WHERE id = $${queryParams.length + 1} RETURNING id, username, email, nombre, telefono, tipo`;
        queryParams.push(userId);

        const result = await pool.query(updateQuery, queryParams);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        res.json({ success: true, message: 'Usuario actualizado exitosamente', user: result.rows[0] });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ success: false, message: 'Error interno al actualizar usuario' });
    }
});

module.exports = router;
