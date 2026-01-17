const initSqlJs = require('sql-wasm.js');

async function checkDb() {
  const SQL = await initSqlJs({ locateFile: file => file });
  const db = new SQL.Database(new Uint8Array(require('fs').readFileSync('ip-to-asn.db')));
  
  const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table'");
  console.log('Tables:', tables[0]?.values?.map(r => r[0]) || 'none');
  
  const sample = db.exec("SELECT * FROM networks LIMIT 1");
  console.log('Sample columns:', sample[0]?.columns || 'not found');
}

checkDb().catch(console.error);
