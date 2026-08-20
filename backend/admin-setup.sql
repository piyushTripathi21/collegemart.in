-- ============================================================
-- CollegeMart Admin Panel — Database Migration
-- Run this ONCE against your existing collegemart database
-- ============================================================

USE collegemart;

-- ─── 1. Admin Users Table ───────────────────────────────────
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── 2. Admin Activity Logs ─────────────────────────────────
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── 3. Site Settings (key-value store) ─────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  updated_by INT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── 4. User Bans Tracking ─────────────────────────────────
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── 5. Announcements ──────────────────────────────────────
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── 6. Add columns to existing users table ─────────────────
-- Use stored procedure to safely add columns
DELIMITER //
CREATE PROCEDURE AddColumnIfNotExists(
  IN tableName VARCHAR(64),
  IN columnName VARCHAR(64),
  IN columnDef VARCHAR(255)
)
BEGIN
  IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = tableName
      AND COLUMN_NAME = columnName
  ) THEN
    SET @sql = CONCAT('ALTER TABLE `', tableName, '` ADD COLUMN `', columnName, '` ', columnDef);
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
  END IF;
END //
DELIMITER ;

CALL AddColumnIfNotExists('users', 'is_banned', 'BOOLEAN DEFAULT FALSE');
CALL AddColumnIfNotExists('users', 'ban_reason', 'TEXT');

-- ─── 7. Add columns to existing products table ──────────────
CALL AddColumnIfNotExists('products', 'sold_at', 'TIMESTAMP NULL');
CALL AddColumnIfNotExists('products', 'is_hidden', 'BOOLEAN DEFAULT FALSE');
CALL AddColumnIfNotExists('products', 'hidden_reason', 'TEXT');

-- ─── 8. Add columns to existing reports table ───────────────
CALL AddColumnIfNotExists('reports', 'status', "ENUM('pending','resolved','dismissed') DEFAULT 'pending'");
CALL AddColumnIfNotExists('reports', 'resolved_by', 'INT NULL');
CALL AddColumnIfNotExists('reports', 'resolved_at', 'TIMESTAMP NULL');

-- Clean up
DROP PROCEDURE IF EXISTS AddColumnIfNotExists;

-- ─── 9. Indexes for performance ─────────────────────────────
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin ON admin_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created ON admin_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_user_bans_user ON user_bans(user_id);
CREATE INDEX IF NOT EXISTS idx_products_sold_at ON products(sold_at);
CREATE INDEX IF NOT EXISTS idx_products_is_hidden ON products(is_hidden);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_users_is_banned ON users(is_banned);

-- ─── 10. Seed initial super admin (password: Admin@123456) ──
-- The bcrypt hash below corresponds to 'Admin@123456' with 10 salt rounds
INSERT IGNORE INTO admin_users (email, password, name, role) VALUES
('admin@collegemart.com', '$2b$10$H/wfnLzVtlXcZ3O8K/lzf.5cREhyDwYgcAFQI2oxI96G9mY8hjisG', 'Super Admin', 'super_admin');

-- ─── 11. Seed default site settings ────────────────────────
INSERT IGNORE INTO site_settings (setting_key, setting_value) VALUES
('maintenance_mode', 'false'),
('sold_product_hide_days', '7'),
('coins_per_sale', '10'),
('coins_per_signup', '0'),
('max_images_per_product', '6'),
('featured_listing_enabled', 'true'),
('site_announcement', ''),
('rate_limit_window_ms', '900000'),
('rate_limit_max_requests', '120');
