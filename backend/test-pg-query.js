const { Client } = require('pg');
const client = new Client({ host: 'localhost', port: 5432, user: 'admin123', password: 'admin123', database: 'mecanica' });
client.connect().then(async () => {
  try {
    const res = await client.query(`
      SELECT "public"."usuarios"."id", "public"."usuarios"."username"
      FROM "public"."usuarios" WHERE 1=1 LIMIT 1 OFFSET 0
    `);
    console.log('OK:', res.rows);
  } catch (e) {
    console.error('ERROR:', e.message);
  }
  await client.end();
}).catch(err => { console.error(err.message); process.exit(1); });
