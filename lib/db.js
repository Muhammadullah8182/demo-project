// MySQL connection (mysql2/promise). Credentials come from environment
// variables ONLY — never hardcode them here:
//   DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
// On cPanel these are set in "Setup Node.js App" > Environment variables.
import mysql from 'mysql2/promise';

let pool = null;

export function dbConfigured() {
  return Boolean(process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME);
}

export function getPool() {
  if (pool) return pool;
  if (!dbConfigured()) return null;
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 5, // shared hosting: keep the pool small
    queueLimit: 0,
    // Fail fast: a dead database must never hang a page load.
    connectTimeout: 3000,
  });
  return pool;
}

// Run a parameterised query (prevents SQL injection). Throws on error;
// callers catch it and fall back to the hardcoded site data.
export async function dbQuery(sql, params = []) {
  const p = getPool();
  if (!p) throw new Error('Database not configured');
  const [rows] = await p.execute(sql, params);
  return rows;
}

// Quick health check used by the admin page.
export async function dbPing() {
  await dbQuery('SELECT 1 AS ok');
  return true;
}
