const { Pool } = require('pg');
const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'admin123',
    password: 'admin123',
    database: 'mecanica',
});

const run = async () => {
    try {
        await pool.query(`ALTER TABLE citas DROP CONSTRAINT IF EXISTS citas_estado_check;`);
        console.log('Successfully dropped citas_estado_check');
    } catch (e) {
        console.error(e.message);
    }
    process.exit(0);
};

run();
