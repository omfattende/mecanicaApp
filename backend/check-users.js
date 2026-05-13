const pool = require('./config/database');

async function checkUsers() {
  try {
    const result = await pool.query(
      'SELECT id, username, email, nombre, tipo, created_at FROM usuarios ORDER BY id'
    );
    
    console.log('\n📋 Usuarios en la base de datos:\n');
    
    if (result.rows.length === 0) {
      console.log('⚠️  No hay usuarios registrados');
    } else {
      result.rows.forEach(user => {
        console.log(`ID: ${user.id}`);
        console.log(`Usuario: ${user.username}`);
        console.log(`Email: ${user.email}`);
        console.log(`Nombre: ${user.nombre}`);
        console.log(`Tipo: ${user.tipo}`);
        console.log(`Creado: ${user.created_at}`);
        console.log('---');
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkUsers();
