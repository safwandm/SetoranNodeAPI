const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

// Create a table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS motors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    model TEXT NOT NULL,
    tahun INTEGER NOT NULL,
    owner TEXT
  )
`);

module.exports = db;