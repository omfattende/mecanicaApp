const pool = require('./config/database');
const fs = require('fs');

async function check() {
    try {
        const res = await pool.query("SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'vehiculos'");
        fs.writeFileSync('schema.json', JSON.stringify(res.rows, null, 2));

        const res2 = await pool.query("SELECT * FROM vehiculos LIMIT 1");
        fs.writeFileSync('sample.json', JSON.stringify(res2.rows, null, 2));

    } catch (e) {
        fs.writeFileSync('error.txt', e.message);
    } finally {
        process.exit();
    }
}
check();
