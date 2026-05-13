const pool = require('./config/database');

const runMigration = async () => {
    try {
        console.log('Migrating citas table to add estado...');
        await pool.query(`
      ALTER TABLE citas
      ADD COLUMN IF NOT EXISTS estado VARCHAR(50) DEFAULT 'Pendiente';
    `);
        console.log('✅ successfully added estado column to citas');

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
        console.log('✅ successfully created tareas_servicio table');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error during migration:', error);
        process.exit(1);
    }
};

runMigration();
