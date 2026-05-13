const bcryptjs = require('bcryptjs');
const pool = require('./config/database');

async function resetPassword() {
  const password = 'admin1';
  const hashedPassword = await bcryptjs.hash(password, 10);
  
  try {
    await pool.query(
      'UPDATE usuarios SET password = $1 WHERE username = $2',
      [hashedPassword, 'admin']
    );
    console.log('Contraseña actualizada. Nueva contraseña: admin1');
    process.exit(0);
  } catch (error) {
    console.error('Error al actualizar contraseña:', error);
    process.exit(1);
  }
}

resetPassword();
