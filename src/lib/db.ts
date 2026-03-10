import Database from 'better-sqlite3';

const db = new Database('isp.db');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS routers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    host TEXT NOT NULL,
    port INTEGER DEFAULT 8728,
    username TEXT NOT NULL,
    password TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    router_id INTEGER,
    pppoe_user TEXT NOT NULL,
    pppoe_password TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    FOREIGN KEY(router_id) REFERENCES routers(id)
  );

  CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER,
    amount REAL NOT NULL,
    status TEXT DEFAULT 'unpaid',
    due_date TEXT NOT NULL,
    FOREIGN KEY(customer_id) REFERENCES customers(id)
  );
`);

export default db;
