const pool = require('./config/database');

async function testVehiculos() {
    try {
        const res = await pool.query("SELECT * FROM vehiculos LIMIT 1");
        console.log('Sample Vehiculo:', res.rows[0]);

        const schema = await pool.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'vehiculos'
    `);
        console.log('Schema:', schema.rows);
    } catch (err) {
        console.error('Error fetching vehiculos schema:', err);
    } finally {
        process.exit();
    }
}

testVehiculos();
