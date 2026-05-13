// chk-veh.js
const pool = require('./config/database');
pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'vehiculos';")
    .then(res => {
        console.log(JSON.stringify(res.rows, null, 2));
        process.exit(0);
    })
    .catch(e => {
        console.error(e);
        process.exit(1);
    });
