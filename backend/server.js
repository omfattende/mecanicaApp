const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ====== START AUTO MIGRATION ======
const pool = require('./config/database');
pool.query(`
  DO $$
  BEGIN
    -- Caso 1: Existen AMBAS columnas año y anio (migración parcial anterior)
    -- Copiar datos de año a anio y luego eliminar año
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='vehiculos' AND column_name='año')
    AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='vehiculos' AND column_name='anio') THEN
      UPDATE vehiculos SET anio = "año" WHERE anio IS NULL;
      ALTER TABLE vehiculos DROP COLUMN "año";

    -- Caso 2: Solo existe año → renombrarlo a anio
    ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='vehiculos' AND column_name='año') THEN
      ALTER TABLE vehiculos RENAME COLUMN "año" TO anio;
    END IF;

    -- Agregar anio si no existe (BD nueva sin ninguno de los dos)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='vehiculos' AND column_name='anio') THEN
      ALTER TABLE vehiculos ADD COLUMN anio INTEGER;
    END IF;
    -- Agregar color si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='vehiculos' AND column_name='color') THEN
      ALTER TABLE vehiculos ADD COLUMN color VARCHAR(50);
    END IF;
    -- Agregar kilometraje si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='vehiculos' AND column_name='kilometraje') THEN
      ALTER TABLE vehiculos ADD COLUMN kilometraje INTEGER;
    END IF;
    -- Agregar estado a citas si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='citas' AND column_name='estado') THEN
      ALTER TABLE citas ADD COLUMN estado VARCHAR(50) DEFAULT 'Pendiente';
    END IF;
    -- Agregar repuestos_solicitados a citas si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='citas' AND column_name='repuestos_solicitados') THEN
      ALTER TABLE citas ADD COLUMN repuestos_solicitados TEXT;
    END IF;
    -- Agregar repuestos_propios a citas si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='citas' AND column_name='repuestos_propios') THEN
      ALTER TABLE citas ADD COLUMN repuestos_propios TEXT;
    END IF;
  END$$;
`)
  .then(() => pool.query(`
    CREATE TABLE IF NOT EXISTS tareas_servicio (
      id SERIAL PRIMARY KEY,
      cita_id INTEGER REFERENCES citas(id) ON DELETE CASCADE,
      descripcion VARCHAR(255) NOT NULL,
      completada BOOLEAN DEFAULT false,
      fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `))
  .then(() => console.log('✅ Migraciones de BD automáticas completadas exitosamente'))
  .catch(e => console.error('❌ Error en auto-migración:', e.message));
// ====== END AUTO MIGRATION ======

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const vehiculosRoutes = require('./routes/vehiculos');
const citasRoutes = require('./routes/citas');
const tareasRoutes = require('./routes/tareas');
const usuariosRoutes = require('./routes/usuarios');

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); // Keep existing userRoutes
app.use('/api/vehiculos', vehiculosRoutes);
app.use('/api/citas', citasRoutes);
app.use('/api/tareas', tareasRoutes);
app.use('/api/usuarios', usuariosRoutes);


// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: 'API TallerPro funcionando correctamente',
    version: '1.0.0'
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 Base de datos: ${process.env.DB_NAME}`);
});
