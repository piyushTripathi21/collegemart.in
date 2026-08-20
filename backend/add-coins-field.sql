-- Add coins/wallet field to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS coins INT DEFAULT 0;

-- Add is_sold status tracking
ALTER TABLE products MODIFY COLUMN sold BOOLEAN DEFAULT FALSE;
