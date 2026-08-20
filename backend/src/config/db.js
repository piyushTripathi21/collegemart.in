import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'collegemart',
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '50', 10),
  queueLimit: 100, // Hard limit database queue size to prevent OOM / hanging
});

pool.on('connection', (connection) => {
  connection.on('error', (err) => {
    console.error('[DATABASE PROTOCOL ERROR]', err);
  });
});

export default pool;
