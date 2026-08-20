import mysql from 'mysql2/promise';

/**
 * Verifies and applies indexes to the MySQL database if they do not already exist.
 * @param {import('mysql2/promise').Pool} pool - The MySQL connection pool
 */
export async function verifyAndCreateIndexes(pool) {
  const indexes = [
    { table: 'products', name: 'idx_products_category', definition: '(category)' },
    { table: 'products', name: 'idx_products_user_id', definition: '(user_id)' },
    { table: 'products', name: 'idx_products_created_at', definition: '(created_at DESC)' },
    { table: 'products', name: 'idx_products_sold', definition: '(sold)' },
    { table: 'products', name: 'idx_products_fulltext', definition: '(title, description)', type: 'FULLTEXT' },
    { table: 'messages', name: 'idx_messages_product_receiver', definition: '(product_id, receiver_id)' },
    { table: 'messages', name: 'idx_messages_product_id', definition: '(product_id)' },
    { table: 'messages', name: 'idx_messages_unread', definition: '(receiver_id, is_read)' },
    { table: 'messages', name: 'idx_messages_sender', definition: '(sender_id)' },
    { table: 'reviews', name: 'idx_reviews_product_id', definition: '(product_id)' },
    { table: 'wishlist', name: 'idx_wishlist_user_id', definition: '(user_id)' },
    { table: 'offers', name: 'idx_offers_product_id', definition: '(product_id)' },
    { table: 'offers', name: 'idx_offers_status', definition: '(status)' },
    { table: 'product_images', name: 'idx_product_images_product_id', definition: '(product_id)' },
    { table: 'users', name: 'idx_users_email', definition: '(email)' },
    { table: 'reports', name: 'idx_reports_product_id', definition: '(product_id)' }
  ];

  let connection;
  try {
    connection = await pool.getConnection();
    const [dbRows] = await connection.query('SELECT DATABASE() AS db_name');
    const dbName = dbRows[0]?.db_name;
    
    if (!dbName) {
      throw new Error('Could not identify active database name');
    }

    console.log(`[INDEX CHECK] Checking indexes for database: ${dbName}`);

    // Create token_blacklist table if not exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS token_blacklist (
        token VARCHAR(500) PRIMARY KEY,
        expires_at TIMESTAMP NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('[INDEX CHECK] Verified token_blacklist table exists.');

    for (const idx of indexes) {
      const [rows] = await connection.query(
        `SELECT INDEX_NAME FROM INFORMATION_SCHEMA.STATISTICS 
         WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND INDEX_NAME = ? LIMIT 1`,
        [dbName, idx.table, idx.name]
      );
      
      if (rows.length === 0) {
        console.log(`[INDEX CHECK] Creating index ${idx.name} on table ${idx.table}...`);
        if (idx.type === 'FULLTEXT') {
          await connection.query(`CREATE FULLTEXT INDEX ${idx.name} ON ${idx.table} ${idx.definition}`);
        } else {
          await connection.query(`CREATE INDEX ${idx.name} ON ${idx.table} ${idx.definition}`);
        }
        console.log(`[INDEX CHECK] Index ${idx.name} created successfully.`);
      } else {
        console.log(`[INDEX CHECK] Index ${idx.name} already exists.`);
      }
    }
    console.log('[INDEX CHECK] Database index verification complete.');
  } catch (error) {
    console.error('[INDEX CHECK ERROR] Failed to verify/create database indexes:', error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
