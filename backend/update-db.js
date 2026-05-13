const pool = require('./config/database');

const runMigration = async () => {
    try {
        console.log('Validating and migrating citas table...');
        await pool.query(`
      ALTER TABLE citas
      ADD COLUMN IF NOT EXISTS repuestos_solicitados TEXT,
      ADD COLUMN IF NOT EXISTS repuestos_propios TEXT;
    `);
        console.log('✅ successfully added columns resupuestos_solicitados and repuestos_propios');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during migration:', error);
        process.exit(1);
    }
};

runMigration();
