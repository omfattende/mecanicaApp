const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'postgres', // Conectar a la base de datos por defecto primero
});

async function testConnection() {
  try {
    console.log('🔍 Probando conexión a PostgreSQL...');
    console.log('Host:', process.env.DB_HOST);
    console.log('Port:', process.env.DB_PORT);
    console.log('User:', process.env.DB_USER);
    console.log('Password:', process.env.DB_PASSWORD ? '***configurada***' : '***vacía***');
    
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Conexión exitosa!');
    console.log('Hora del servidor:', result.rows[0].now);
    
    // Verificar si existe la base de datos mecanica
    const dbCheck = await pool.query(
      "SELECT 1 FROM pg_database WHERE datname = 'mecanica'"
    );
    
    if (dbCheck.rows.length > 0) {
      console.log('✅ La base de datos "mecanica" existe');
    } else {
      console.log('⚠️  La base de datos "mecanica" NO existe');
      console.log('Creando base de datos...');
      await pool.query('CREATE DATABASE mecanica');
      console.log('✅ Base de datos "mecanica" creada');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.log('\n💡 Posibles soluciones:');
    console.log('1. Verifica que PostgreSQL esté corriendo');
    console.log('2. Verifica que la contraseña en .env sea correcta');
    console.log('3. Intenta cambiar la contraseña de postgres:');
    console.log('   psql -U postgres');
    console.log('   ALTER USER postgres WITH PASSWORD \'tu_nueva_contraseña\';');
    process.exit(1);
  }
}

testConnection();
