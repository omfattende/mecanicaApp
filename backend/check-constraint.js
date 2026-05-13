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
        const result = await pool.query(`
            SELECT pg_get_constraintdef(c.oid) AS constraint_def
            FROM pg_constraint c
            JOIN pg_class t ON c.conrelid = t.oid
            WHERE c.conname = 'citas_estado_check' AND t.relname = 'citas';
        `);
        console.log(result.rows);
    } catch (e) {
        console.error(e.message);
    }
    process.exit(0);
};

run();
