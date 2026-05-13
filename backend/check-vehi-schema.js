const pool = require('./config/database');
const fs = require('fs');

async function testQuery() {
    try {
        const res = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'vehiculos'
    `);
        fs.writeFileSync('schema-vehiculos.json', JSON.stringify(res.rows, null, 2));
        process.exit(0);
    } catch (e) {
        fs.writeFileSync('schema-vehiculos.json', JSON.stringify({ error: e.message }));
        process.exit(1);
    }
}

testQuery();
