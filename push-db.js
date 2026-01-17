const { createClient } = require('@libsql/client');
const initSqlJs = require('./sql-wasm.js');
const fs = require('fs');

async function pushDatabase() {
  const authToken = process.env.TURSO_AUTH_TOKEN;
  const dbUrl = 'libsql://ip-to-asndb-avirads.aws-ap-south-1.turso.io';

  if (!authToken) {
    console.error('Please set TURSO_AUTH_TOKEN environment variable');
    console.error('Get it from Turso dashboard → Your database → Connection → Authentication Token');
    process.exit(1);
  }

  console.log('Reading local database...');
  const SQL = await initSqlJs({ locateFile: file => file });
  const localDb = new SQL.Database(fs.readFileSync('ip-to-asn.db'));
  
  const tables = localDb.exec("SELECT name FROM sqlite_master WHERE type='table'");
  const mainTable = tables[0]?.values.find(v => v[0] === 'ip_to_asn');
  
  if (!mainTable) {
    console.error('ip_to_asn table not found');
    process.exit(1);
  }

  const rows = localDb.exec('SELECT * FROM ip_to_asn');
  const data = rows[0]?.values || [];
  console.log(`Found ${data.length} rows`);

  const client = createClient({
    url: dbUrl,
    authToken: authToken
  });

  console.log('Creating remote table...');
  await client.batch([
    'DROP TABLE IF EXISTS ip_to_asn',
    `CREATE TABLE ip_to_asn (
      id INTEGER PRIMARY KEY,
      network TEXT,
      asn TEXT,
      country_code TEXT,
      name TEXT,
      org TEXT,
      domain TEXT
    )`
  ], 'write');

  console.log('Inserting data (this may take a while for 46459 rows)...');

  const batchSize = 500;
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    const placeholders = batch.map(() => '(?, ?, ?, ?, ?, ?, ?)').join(', ');
    const sql = `INSERT INTO ip_to_asn VALUES ${placeholders}`;
    const flatParams = batch.flat();
    await client.batch([{ sql, args: flatParams }], 'write');
    console.log(`Progress: ${Math.min(i + batchSize, data.length)}/${data.length}`);
  }

  console.log('Database pushed to Turso!');
}

pushDatabase().catch(console.error);
