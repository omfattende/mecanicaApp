const pool = require('./config/database');
pool.query("SELECT id, username, nombre, tipo FROM usuarios WHERE tipo = 'admin'")
  .then(r => {
    console.log('Admins:');
    console.log(JSON.stringify(r.rows, null, 2));
    process.exit(0);
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
