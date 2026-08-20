import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

async function runMigration() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'collegemart',
    multipleStatements: true
  });

  console.log('Connected to database. Running admin panel migration...\n');

  // 1. Create admin_users table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      role ENUM('super_admin', 'moderator', 'support') DEFAULT 'moderator',
      is_active BOOLEAN DEFAULT TRUE,
      last_login TIMESTAMP NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
  console.log('✅ admin_users table created');

  // 2. Create admin_logs table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS admin_logs (
      id INT PRIMARY KEY AUTO_INCREMENT,
      admin_id INT NOT NULL,
      action VARCHAR(255) NOT NULL,
      target_type VARCHAR(50),
      target_id INT,
      details TEXT,
      ip_address VARCHAR(45),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
  console.log('✅ admin_logs table created');

  // 3. Create site_settings table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS site_settings (
      id INT PRIMARY KEY AUTO_INCREMENT,
      setting_key VARCHAR(100) UNIQUE NOT NULL,
      setting_value TEXT,
      updated_by INT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
  console.log('✅ site_settings table created');

  // 4. Create user_bans table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS user_bans (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT NOT NULL,
      banned_by INT NOT NULL,
      reason TEXT,
      ban_type ENUM('permanent', 'temporary') DEFAULT 'permanent',
      expires_at TIMESTAMP NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (banned_by) REFERENCES admin_users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
  console.log('✅ user_bans table created');

  // 5. Create announcements table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS announcements (
      id INT PRIMARY KEY AUTO_INCREMENT,
      title VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      target ENUM('all', 'college') DEFAULT 'all',
      target_college VARCHAR(255),
      created_by INT NOT NULL,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES admin_users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
  console.log('✅ announcements table created');

  // 6. Add columns to users table
  const addColumnSafe = async (table, column, definition) => {
    const [cols] = await connection.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
      [table, column]
    );
    if (cols.length === 0) {
      await connection.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`);
      console.log(`  ✅ Added ${table}.${column}`);
    } else {
      console.log(`  ⏭️  ${table}.${column} already exists`);
    }
  };

  console.log('\nAdding columns to existing tables...');
  await addColumnSafe('users', 'is_banned', 'BOOLEAN DEFAULT FALSE');
  await addColumnSafe('users', 'ban_reason', 'TEXT');
  await addColumnSafe('users', 'email_verified', 'BOOLEAN DEFAULT FALSE');
  await addColumnSafe('users', 'email_verification_token', 'VARCHAR(255) NULL');
  await addColumnSafe('users', 'otp_code', 'VARCHAR(10) NULL');
  await addColumnSafe('users', 'otp_expires', 'DATETIME NULL');
  await addColumnSafe('users', 'password_reset_token', 'VARCHAR(255) NULL');
  await addColumnSafe('users', 'password_reset_expires', 'DATETIME NULL');
  await addColumnSafe('users', 'accepted_terms_at', 'DATETIME NULL');
  await addColumnSafe('products', 'sold_at', 'TIMESTAMP NULL');
  await addColumnSafe('products', 'is_hidden', 'BOOLEAN DEFAULT FALSE');
  await addColumnSafe('products', 'hidden_reason', 'TEXT');
  await addColumnSafe('reports', 'status', "ENUM('pending','resolved','dismissed') DEFAULT 'pending'");
  await addColumnSafe('reports', 'resolved_by', 'INT NULL');
  await addColumnSafe('reports', 'resolved_at', 'TIMESTAMP NULL');

  // 7. Create indexes (ignore errors if they already exist)
  const indexes = [
    ['idx_admin_logs_admin', 'admin_logs', 'admin_id'],
    ['idx_admin_logs_created', 'admin_logs', 'created_at'],
    ['idx_user_bans_user', 'user_bans', 'user_id'],
    ['idx_products_sold_at', 'products', 'sold_at'],
    ['idx_products_is_hidden', 'products', 'is_hidden'],
    ['idx_reports_status', 'reports', 'status'],
    ['idx_users_is_banned', 'users', 'is_banned'],
    ['idx_products_category', 'products', 'category'],
    ['idx_products_user_id', 'products', 'user_id'],
    ['idx_products_featured', 'products', 'featured'],
    ['idx_products_created_at_desc', 'products', 'created_at DESC'],
    ['idx_messages_product_receiver', 'messages', 'product_id, receiver_id'],
    ['idx_messages_product_id', 'messages', 'product_id'],
    ['idx_messages_unread', 'messages', 'receiver_id, is_read'],
    ['idx_messages_receiver', 'messages', 'receiver_id'],
    ['idx_reviews_product_id', 'reviews', 'product_id'],
    ['idx_wishlist_user', 'wishlist', 'user_id'],
    ['idx_wishlist_user_id', 'wishlist', 'user_id'],
    ['idx_offers_product_id', 'offers', 'product_id'],
    ['idx_offers_status', 'offers', 'status'],
    ['idx_product_images_product_id', 'product_images', 'product_id'],
    ['idx_reports_product_id', 'reports', 'product_id'],
  ];
  console.log('\nCreating indexes...');
  for (const [name, table, col] of indexes) {
    try {
      await connection.query(`CREATE INDEX ${name} ON ${table}(${col})`);
      console.log(`  ✅ Index ${name}`);
    } catch (e) {
      if (e.code === 'ER_DUP_KEYNAME') {
        console.log(`  ⏭️  Index ${name} already exists`);
      } else {
        console.error(`  ❌ Index ${name}: ${e.message}`);
      }
    }
  }

  // 8. Seed super admin
  console.log('\nSeeding admin account...');
  const [existing] = await connection.query('SELECT id FROM admin_users WHERE email = ?', ['admin@collegemart.com']);
  if (existing.length === 0) {
    const hash = await bcrypt.hash('Admin@123456', 10);
    await connection.query(
      'INSERT INTO admin_users (email, password, name, role) VALUES (?, ?, ?, ?)',
      ['admin@collegemart.com', hash, 'Super Admin', 'super_admin']
    );
    console.log('✅ Super admin created (admin@collegemart.com / Admin@123456)');
  } else {
    console.log('⏭️  Admin account already exists');
  }

  // 9. Seed default settings
  console.log('\nSeeding site settings...');
  const settings = [
    ['maintenance_mode', 'false'],
    ['sold_product_hide_days', '7'],
    ['coins_per_sale', '10'],
    ['coins_per_signup', '0'],
    ['max_images_per_product', '6'],
    ['featured_listing_enabled', 'true'],
    ['site_announcement', ''],
    ['rate_limit_window_ms', '900000'],
    ['rate_limit_max_requests', '120'],
  ];
  for (const [key, value] of settings) {
    try {
      await connection.query(
        'INSERT IGNORE INTO site_settings (setting_key, setting_value) VALUES (?, ?)',
        [key, value]
      );
    } catch (e) { /* ignore duplicates */ }
  }
  console.log('✅ Site settings seeded');

  console.log('\n🎉 Admin panel migration complete!');
  await connection.end();
}

runMigration().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
