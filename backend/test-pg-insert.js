const pool = require('./config/database');
const fs = require('fs');

async function testInsert() {
    try {
        const usuario_id = 6;
        const marca = "TestMarca";
        const modelo = "TestModelo";
        const anio = 2020;
        const placa = "TEST-" + Math.floor(Math.random() * 10000);
        const color = "Rojo";
        const kilometraje = 50000;

        const result = await pool.query(`
      INSERT INTO vehiculos (usuario_id, marca, modelo, anio, placa, color, kilometraje)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [usuario_id, marca, modelo, anio, placa, color || null, kilometraje || null]);

        fs.writeFileSync('out.log', "Success: " + JSON.stringify(result.rows[0]));
    } catch (e) {
        fs.writeFileSync('out.log', "DB Error: " + e.message);
    } finally {
        process.exit();
    }
}

testInsert();
