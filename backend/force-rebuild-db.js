const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'tallerpro_db',
    password: 'superuser',
    port: 5432
});

const forceReset = async () => {
    try {
        await client.connect();
        console.log('Connected to PostgreSQL...');

        // Drop tables if they exist to force a clean slate for dev
        console.log('Dropping old tables...');
        await client.query('DROP TABLE IF EXISTS facturas CASCADE');
        await client.query('DROP TABLE IF EXISTS servicios CASCADE');
        await client.query('DROP TABLE IF EXISTS citas CASCADE');
        await client.query('DROP TABLE IF EXISTS vehiculos CASCADE');
        await client.query('DROP TABLE IF EXISTS usuarios CASCADE');

        console.log('Re-creating tables from scratch...');

        // Usuarios
        await client.query(`
      CREATE TABLE usuarios (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        nombre VARCHAR(100) NOT NULL,
        telefono VARCHAR(20) NOT NULL,
        tipo VARCHAR(20) DEFAULT 'cliente' CHECK (tipo IN ('admin', 'cliente')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

        // Vehículos
        await client.query(`
      CREATE TABLE vehiculos (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
        marca VARCHAR(50) NOT NULL,
        modelo VARCHAR(50) NOT NULL,
        anio INTEGER NOT NULL,
        placa VARCHAR(20) UNIQUE NOT NULL,
        color VARCHAR(30),
        kilometraje INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

        // Citas (incluyendo los repuestos)
        await client.query(`
      CREATE TABLE citas (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
        vehiculo_id INTEGER REFERENCES vehiculos(id) ON DELETE CASCADE,
        fecha DATE NOT NULL,
        hora TIME NOT NULL,
        servicio VARCHAR(100) NOT NULL,
        descripcion TEXT,
        repuestos_solicitados TEXT,
        repuestos_propios TEXT,
        estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmada', 'en_proceso', 'completada', 'cancelada')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

        // Servicios
        await client.query(`
      CREATE TABLE servicios (
        id SERIAL PRIMARY KEY,
        cita_id INTEGER REFERENCES citas(id) ON DELETE CASCADE,
        descripcion TEXT NOT NULL,
        costo DECIMAL(10, 2) NOT NULL,
        estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_proceso', 'completado')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

        // Admin user
        const bcrypt = require('bcrypt');
        const hashedPassword = await bcrypt.hash('admin', 10);
        await client.query(`
      INSERT INTO usuarios (username, email, password, nombre, telefono, tipo)
      VALUES ('admin', 'admin@tallerpro.com', $1, 'Administrador', '123456789', 'admin')
    `, [hashedPassword]);

        console.log('✅ DATABASE FULLY RESET AND READY');
        process.exit(0);

    } catch (err) {
        console.error('❌ FATAL ERROR REBUILDING DB:', err);
        process.exit(1);
    } finally {
        await client.end();
    }
};

forceReset();
