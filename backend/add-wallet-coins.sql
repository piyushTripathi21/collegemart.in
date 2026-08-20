-- Add coins field to users table for wallet system
ALTER TABLE users ADD COLUMN coins INT DEFAULT 0;
