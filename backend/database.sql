-- CollegeMart Database Schema

DROP DATABASE IF EXISTS collegemart;
CREATE DATABASE collegemart;
USE collegemart;

-- ─── 1. Core Users Table ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  college VARCHAR(255),
  phone VARCHAR(20),
  profile_image VARCHAR(255),
  bio TEXT,
  coins INT DEFAULT 0,
  email_verified BOOLEAN DEFAULT FALSE,
  email_verification_token VARCHAR(255) NULL,
  otp_code VARCHAR(10) NULL,
  otp_expires DATETIME NULL,
  password_reset_token VARCHAR(255) NULL,
  password_reset_expires DATETIME NULL,
  accepted_terms_at DATETIME NULL,
  is_banned BOOLEAN DEFAULT FALSE,
  ban_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── 2. Admin Users Table ───────────────────────────────────
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

-- ─── 3. Admin Activity Logs ─────────────────────────────────
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

-- ─── 4. Site Settings (key-value store) ─────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  updated_by INT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── 5. User Bans Tracking ─────────────────────────────────
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

-- ─── 6. Announcements ──────────────────────────────────────
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

-- ─── 7. Products Table ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  `condition` VARCHAR(50) NOT NULL,
  category VARCHAR(100) NOT NULL,
  location VARCHAR(255),
  emoji VARCHAR(10),
  featured BOOLEAN DEFAULT FALSE,
  sold BOOLEAN DEFAULT FALSE,
  image_url VARCHAR(255),
  views INT DEFAULT 0,
  likes INT DEFAULT 0,
  sold_at TIMESTAMP NULL,
  is_hidden BOOLEAN DEFAULT FALSE,
  hidden_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── 8. Product Images Table ────────────────────────────────
CREATE TABLE IF NOT EXISTS product_images (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── 9. Offers Table ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS offers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  buyer_id INT NOT NULL,
  seller_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'accepted', 'rejected', 'countered') DEFAULT 'pending',
  buyer_message TEXT,
  seller_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── 10. Reports Table ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS reports (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  reporter_id INT NOT NULL,
  reason VARCHAR(255) NOT NULL,
  details TEXT,
  status ENUM('pending','resolved','dismissed') DEFAULT 'pending',
  resolved_by INT NULL,
  resolved_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── 11. Wishlist Table ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS wishlist (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_wishlist (user_id, product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── 12. Reviews Table ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── 13. Messages Table ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  product_id INT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── 14. Transactions Table ──────────────────────────────────
CREATE TABLE IF NOT EXISTS transactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  seller_id INT NOT NULL,
  buyer_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── 15. Categories Table ───────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) UNIQUE NOT NULL,
  emoji VARCHAR(10),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── 16. Token Blacklist Table ────────────────────────────────
CREATE TABLE IF NOT EXISTS token_blacklist (
  token VARCHAR(500) PRIMARY KEY,
  expires_at TIMESTAMP NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- ============================================================================

-- Products indexes
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_user_id ON products(user_id);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_created_at ON products(created_at DESC);
CREATE INDEX idx_products_sold_at ON products(sold_at);
CREATE INDEX idx_products_sold ON products(sold);
CREATE INDEX idx_products_is_hidden ON products(is_hidden);
CREATE FULLTEXT INDEX idx_products_fulltext ON products(title, description);

-- Product Images indexes
CREATE INDEX idx_product_images_product_id ON product_images(product_id);

-- Messages indexes
CREATE INDEX idx_messages_product_receiver ON messages(product_id, receiver_id);
CREATE INDEX idx_messages_product_id ON messages(product_id);
CREATE INDEX idx_messages_unread ON messages(receiver_id, is_read);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);

-- Reviews indexes
CREATE INDEX idx_reviews_product_id ON reviews(product_id);

-- Wishlist indexes
CREATE INDEX idx_wishlist_user ON wishlist(user_id);
CREATE INDEX idx_wishlist_user_id ON wishlist(user_id);

-- Offers indexes
CREATE INDEX idx_offers_product_id ON offers(product_id);
CREATE INDEX idx_offers_status ON offers(status);

-- Users indexes
CREATE INDEX idx_users_is_banned ON users(is_banned);

-- Reports indexes
CREATE INDEX idx_reports_product_id ON reports(product_id);
CREATE INDEX idx_reports_status ON reports(status);

-- Admin indexes
CREATE INDEX idx_admin_logs_admin ON admin_logs(admin_id);
CREATE INDEX idx_admin_logs_created ON admin_logs(created_at);
CREATE INDEX idx_user_bans_user ON user_bans(user_id);

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Insert Sample Categories
INSERT INTO categories (name, emoji, description) VALUES
('Books & Notes', '📚', 'Educational books and notes'),
('Electronics', '💻', 'Laptops, mobiles, and gadgets'),
('Cycles & Bikes', '🚲', 'Bicycles and motorcycles'),
('Hostel Furniture', '🛋️', 'Furniture for hostel rooms'),
('Clothing', '👕', 'Clothes and apparel'),
('Stationery', '✏️', 'Writing and stationery items'),
('Sports & Hobbies', '⚽', 'Sports equipment and hobbies'),
('Lab Equipment', '🔬', 'Laboratory equipment'),
('Gadgets', '🎧', 'Electronics and gadgets'),
('Bags & Luggage', '🧳', 'Bags and travel luggage'),
('Kitchen Items', '🍳', 'Kitchen supplies'),
('Services', '🛠️', 'Services offered by students');

-- Insert Sample Users
INSERT INTO users (email, password, name, college, email_verified) VALUES
('raj@iitdelhi.ac.in', '$2b$10$W0up33oyVfFM01ivYbDdQe1CEmQgutOGSgy3YEaFoSc3EZclPYbz6', 'Raj Kumar', 'IIT Delhi', 1),
('priya@vitvellore.ac.in', '$2b$10$W0up33oyVfFM01ivYbDdQe1CEmQgutOGSgy3YEaFoSc3EZclPYbz6', 'Priya Singh', 'VIT Vellore', 1),
('arjun@bitspilani.ac.in', '$2b$10$W0up33oyVfFM01ivYbDdQe1CEmQgutOGSgy3YEaFoSc3EZclPYbz6', 'Arjun Patel', 'BITS Pilani', 1),
('neha@nittrichy.ac.in', '$2b$10$W0up33oyVfFM01ivYbDdQe1CEmQgutOGSgy3YEaFoSc3EZclPYbz6', 'Neha Sharma', 'NIT Trichy', 1),
('rohit@manipal.ac.in', '$2b$10$W0up33oyVfFM01ivYbDdQe1CEmQgutOGSgy3YEaFoSc3EZclPYbz6', 'Rohit Kumar', 'Manipal University', 1),
('sanya@symbiosis.ac.in', '$2b$10$W0up33oyVfFM01ivYbDdQe1CEmQgutOGSgy3YEaFoSc3EZclPYbz6', 'Sanya Gupta', 'Symbiosis Pune', 1),
('aditya@ducampus.ac.in', '$2b$10$W0up33oyVfFM01ivYbDdQe1CEmQgutOGSgy3YEaFoSc3EZclPYbz6', 'Aditya Singh', 'DU North Campus', 1),
('meera@amity.ac.in', '$2b$10$W0up33oyVfFM01ivYbDdQe1CEmQgutOGSgy3YEaFoSc3EZclPYbz6', 'Meera Nair', 'Amity University', 1),
('246301135@gkv.ac.in', '$2b$10$W0up33oyVfFM01ivYbDdQe1CEmQgutOGSgy3YEaFoSc3EZclPYbz6', 'Student User', 'GKV Delhi', 1);

-- Insert Sample Products
INSERT INTO products (user_id, title, description, price, `condition`, category, location, emoji, featured) VALUES
(1, 'Engineering Mathematics Vol 1&2', 'Complete set with all solved problems', 450, 'Good', 'Books & Notes', 'IIT Delhi', '📚', TRUE),
(2, 'Dell Inspiron i5 Laptop 8GB RAM', 'Excellent condition, minimal usage', 18000, 'Good', 'Electronics', 'VIT Vellore', '💻', TRUE),
(3, 'Hero Sprint 26T Cycle barely used', 'Almost new, perfect for campus', 2500, 'Like New', 'Cycles & Bikes', 'BITS Pilani', '🚲', FALSE),
(4, 'Sony WH-1000XM3 Headphones', 'Great sound quality, with box', 1200, 'Like New', 'Gadgets', 'DU North Campus', '🎧', FALSE),
(5, 'Casio FX-991ES Plus Calculator', 'Scientific calculator in good condition', 350, 'Good', 'Stationery', 'NIT Trichy', '📐', FALSE),
(6, 'Study table + chair combo', 'Perfect for hostel room setup', 800, 'Fair', 'Hostel Furniture', 'Manipal University', '🛋️', FALSE),
(7, 'Nike Air Max Size 9 barely worn', 'Premium sports shoes', 600, 'Good', 'Clothing', 'Symbiosis Pune', '👟', FALSE),
(8, 'Casio Graphics Calculator', 'For engineering students', 2000, 'Like New', 'Electronics', 'IIT Delhi', '📊', FALSE);

-- Seed initial super admin (password: Admin@123456)
-- The bcrypt hash below corresponds to 'Admin@123456' with 10 salt rounds
INSERT IGNORE INTO admin_users (email, password, name, role) VALUES
('admin@collegemart.com', '$2b$10$H/wfnLzVtlXcZ3O8K/lzf.5cREhyDwYgcAFQI2oxI96G9mY8hjisG', 'Super Admin', 'super_admin');

-- Seed default site settings
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
