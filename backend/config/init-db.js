const pool = require('./database');

const createTables = async () => {
  try {
    // Tabla de usuarios
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
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

    // Tabla de vehículos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vehiculos (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
        marca VARCHAR(50) NOT NULL,
        modelo VARCHAR(50) NOT NULL,
        año INTEGER NOT NULL,
        placa VARCHAR(20) UNIQUE NOT NULL,
        color VARCHAR(30),
        kilometraje INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabla de citas
    await pool.query(`
      CREATE TABLE IF NOT EXISTS citas (
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

    // Tabla de servicios
    await pool.query(`
      CREATE TABLE IF NOT EXISTS servicios (
        id SERIAL PRIMARY KEY,
        cita_id INTEGER REFERENCES citas(id) ON DELETE CASCADE,
        descripcion TEXT NOT NULL,
        costo DECIMAL(10, 2) NOT NULL,
        estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_proceso', 'completado')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabla de facturas
    await pool.query(`
      CREATE TABLE IF NOT EXISTS facturas (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
        servicio_id INTEGER REFERENCES servicios(id) ON DELETE CASCADE,
        total DECIMAL(10, 2) NOT NULL,
        estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'pagada', 'cancelada')),
        fecha_emision DATE DEFAULT CURRENT_DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Crear usuario admin por defecto
    const adminExists = await pool.query(
      "SELECT * FROM usuarios WHERE username = 'admin'"
    );

    if (adminExists.rows.length === 0) {
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash('admin', 10);
      
      await pool.query(`
        INSERT INTO usuarios (username, email, password, nombre, telefono, tipo)
        VALUES ('admin', 'admin@tallerpro.com', $1, 'Administrador', '123456789', 'admin')
      `, [hashedPassword]);
      
      console.log('✅ Usuario admin creado');
    }

    console.log('✅ Tablas creadas exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear tablas:', error);
    process.exit(1);
  }
};

createTables();
