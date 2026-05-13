const pool = require('./config/database');
const fs = require('fs');

async function diagnostic() {
    try {
        const schema = await pool.query("SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'vehiculos'");

        // Try insert
        const res = await pool.query(`
      INSERT INTO vehiculos (usuario_id, marca, modelo, anio, placa, color, kilometraje)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [6, 'Toyota', 'Corolla', 2020, 'DIAG-' + Math.floor(Math.random() * 1000), 'Azul', 15000]);

        fs.writeFileSync('diag.txt', "SUCCESS\n" + JSON.stringify(res.rows[0]));
    } catch (err) {
        fs.writeFileSync('diag.txt', "ERROR\n" + err.message);
    } finally {
        process.exit();
    }
}

diagnostic();
