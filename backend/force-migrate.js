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
        console.log('Migrating citas table to add estado...');
        await pool.query(`ALTER TABLE citas ADD COLUMN IF NOT EXISTS estado VARCHAR(50) DEFAULT 'Pendiente';`);

        console.log('Creating tareas_servicio table...');
        await pool.query(`
          CREATE TABLE IF NOT EXISTS tareas_servicio (
            id SERIAL PRIMARY KEY,
            cita_id INTEGER REFERENCES citas(id) ON DELETE CASCADE,
            descripcion VARCHAR(255) NOT NULL,
            completada BOOLEAN DEFAULT false,
            fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `);
        console.log('Migration SUCCESS');
        process.exit(0);
    } catch (e) {
        console.error('Migration ERROR', e);
        process.exit(1);
    }
};

run();
