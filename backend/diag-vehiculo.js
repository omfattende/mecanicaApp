// Script de diagnóstico: inserta un vehículo directo a la BD
const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'admin123',
    password: 'admin123',
    database: 'mecanica',
});

async function main() {
    try {
        // 1. Verificar que la tabla vehiculos existe y ver sus columnas
        const cols = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'vehiculos'
      ORDER BY ordinal_position;
    `);
        console.log('=== COLUMNAS DE LA TABLA vehiculos ===');
        console.log(JSON.stringify(cols.rows, null, 2));

        // 2. Verificar constraints
        const constraints = await pool.query(`
      SELECT conname, contype, pg_get_constraintdef(oid) as definition
      FROM pg_constraint
      WHERE conrelid = 'vehiculos'::regclass;
    `);
        console.log('\n=== CONSTRAINTS DE vehiculos ===');
        console.log(JSON.stringify(constraints.rows, null, 2));

        // 3. Intentar insertar un vehículo de prueba
        const testUsuarioId = await pool.query(`SELECT id FROM usuarios LIMIT 1;`);
        if (testUsuarioId.rows.length === 0) {
            console.log('\n❌ No hay usuarios en la BD!');
        } else {
            const uid = testUsuarioId.rows[0].id;
            console.log(`\n✅ Usando usuario_id: ${uid}`);
            const insert = await pool.query(`
        INSERT INTO vehiculos (usuario_id, marca, modelo, anio, placa, color, kilometraje)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `, [uid, 'TestMarca', 'TestModelo', 2020, 'TEST-' + Date.now(), 'Rojo', 10000]);
            console.log('\n✅ Inserción exitosa:');
            console.log(JSON.stringify(insert.rows[0], null, 2));

            // Limpiar la prueba
            await pool.query('DELETE FROM vehiculos WHERE placa LIKE $1', ['TEST-%']);
            console.log('\n🧹 Vehículo de prueba eliminado');
        }

    } catch (err) {
        console.error('\n❌ ERROR:', err.message);
        console.error('Detalle:', err);
    } finally {
        await pool.end();
    }
}

main();
