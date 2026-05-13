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
        const result = await pool.query(`UPDATE citas SET estado = 'En reparación' WHERE id = 1 RETURNING *`);
        console.log('Update OK:', result.rows);
    } catch (e) {
        console.error('Update ERROR:', e.message);
    }
    process.exit(0);
};

run();
