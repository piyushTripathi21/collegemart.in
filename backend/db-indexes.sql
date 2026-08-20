-- ============================================================================
-- DATABASE INDEXES FOR PERFORMANCE OPTIMIZATION
-- These indexes significantly improve query performance for frequently used queries
-- ============================================================================

-- Index for products category filtering
CREATE INDEX idx_products_category ON products(category);

-- Index for products user filtering (seller queries)
CREATE INDEX idx_products_user_id ON products(user_id);

-- Index for latest products sorting (most common query)
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- Composite index for messages (product + receiver for chat queries)
CREATE INDEX idx_messages_product_receiver ON messages(product_id, receiver_id);

-- Index for message product lookup
CREATE INDEX idx_messages_product_id ON messages(product_id);

-- Index for unread messages
CREATE INDEX idx_messages_unread ON messages(receiver_id, is_read);

-- Index for reviews by product (for rating aggregation)
CREATE INDEX idx_reviews_product_id ON reviews(product_id);

-- Index for wishlist lookups
CREATE INDEX idx_wishlist_user_id ON wishlist(user_id);

-- Index for offers by product
CREATE INDEX idx_offers_product_id ON offers(product_id);

-- Index for offers by status
CREATE INDEX idx_offers_status ON offers(status);

-- Index for product images
CREATE INDEX idx_product_images_product_id ON product_images(product_id);

-- Index for user email lookups (fast login)
CREATE INDEX idx_users_email ON users(email);

-- Index for reports
CREATE INDEX idx_reports_product_id ON reports(product_id);

-- ============================================================================
-- VERIFICATION QUERIES - Run after indexes are created
-- ============================================================================

-- Show all indexes in the database
-- SHOW INDEX FROM products;
-- SHOW INDEX FROM messages;
-- SHOW INDEX FROM reviews;
-- SHOW INDEX FROM wishlist;
-- SHOW INDEX FROM offers;
-- SHOW INDEX FROM users;
