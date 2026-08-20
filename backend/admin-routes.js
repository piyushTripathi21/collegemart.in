// ============================================================
// CollegeMart Admin Panel — API Routes
// All routes are mounted at /api/admin in server.js
// ============================================================

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { loginLimiter, sensitiveLimiter } from './src/middleware/rate-limit.js';

export function setupAdminRoutes(app, pool, JWT_SECRET, emailTransporter, sanitizeString) {
  const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET;
  let categoriesCache = null;
  let categoriesCacheTime = 0;

  // ── Helpers ─────────────────────────────────────────────────
  const escapeHtml = (text) => {
    return (text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const generateAdminToken = (admin) =>
    jwt.sign({ id: admin.id, email: admin.email, role: admin.role, isAdmin: true }, ADMIN_JWT_SECRET, { expiresIn: '12h' });

  const authenticateAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Admin authorization required' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, ADMIN_JWT_SECRET, async (err, payload) => {
      if (err) return res.status(401).json({ error: 'Invalid or expired admin token' });
      try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT id, email, name, role, is_active FROM admin_users WHERE id = ?', [payload.id]);
        connection.release();
        if (!rows.length || !rows[0].is_active) return res.status(401).json({ error: 'Admin account not found or inactive' });
        req.admin = rows[0];
        next();
      } catch (e) {
        return res.status(500).json({ error: 'Admin auth error' });
      }
    });
  };

  const requireRole = (...roles) => (req, res, next) => {
    if (!roles.includes(req.admin.role)) return res.status(403).json({ error: 'Insufficient permissions' });
    next();
  };

  const logAction = async (adminId, action, targetType, targetId, details, ip) => {
    try {
      const conn = await pool.getConnection();
      await conn.query('INSERT INTO admin_logs (admin_id, action, target_type, target_id, details, ip_address) VALUES (?,?,?,?,?,?)',
        [adminId, action, targetType, targetId, details, ip]);
      conn.release();
    } catch (e) { console.error('[ADMIN LOG ERROR]', e.message); }
  };

  // ── Auth ────────────────────────────────────────────────────
  app.post('/api/admin/login', loginLimiter, async (req, res) => {
    try {
      const email = (req.body.email || '').trim().toLowerCase();
      const password = req.body.password || '';
      if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
      const conn = await pool.getConnection();
      const [rows] = await conn.query('SELECT * FROM admin_users WHERE email = ?', [email]);
      if (!rows.length) { conn.release(); return res.status(401).json({ error: 'Invalid credentials' }); }
      const admin = rows[0];
      if (!admin.is_active) { conn.release(); return res.status(401).json({ error: 'Account is disabled' }); }
      const match = await bcrypt.compare(password, admin.password);
      if (!match) { conn.release(); return res.status(401).json({ error: 'Invalid credentials' }); }
      await conn.query('UPDATE admin_users SET last_login = NOW() WHERE id = ?', [admin.id]);
      conn.release();
      const token = generateAdminToken(admin);
      logAction(admin.id, 'login', null, null, null, req.ip);
      res.json({ admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role }, token });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.get('/api/admin/me', authenticateAdmin, (req, res) => {
    res.json(req.admin);
  });

  app.put('/api/admin/change-password', authenticateAdmin, sensitiveLimiter, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword || newPassword.length < 8) return res.status(400).json({ error: 'Valid passwords required' });
      const conn = await pool.getConnection();
      const [rows] = await conn.query('SELECT password FROM admin_users WHERE id = ?', [req.admin.id]);
      const match = await bcrypt.compare(currentPassword, rows[0].password);
      if (!match) { conn.release(); return res.status(401).json({ error: 'Current password incorrect' }); }
      const hash = await bcrypt.hash(newPassword, 10);
      await conn.query('UPDATE admin_users SET password = ? WHERE id = ?', [hash, req.admin.id]);
      conn.release();
      logAction(req.admin.id, 'change_password', 'admin', req.admin.id, null, req.ip);
      res.json({ message: 'Password changed successfully' });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // ── Dashboard ───────────────────────────────────────────────
  app.get('/api/admin/dashboard/stats', authenticateAdmin, async (req, res) => {
    try {
      const conn = await pool.getConnection();
      const [
        [[stats]],
        [topColleges],
        [topCategories]
      ] = await Promise.all([
        conn.query(`
          SELECT 
            (SELECT COUNT(*) FROM users) as total_users,
            (SELECT COUNT(*) FROM products) as total_products,
            (SELECT COUNT(*) FROM products WHERE sold = FALSE AND is_hidden = FALSE) as active_products,
            (SELECT COUNT(*) FROM products WHERE sold = TRUE) as sold_products,
            (SELECT COUNT(*) FROM transactions) as total_transactions,
            (SELECT IFNULL(SUM(amount), 0) FROM transactions WHERE status = 'completed') as total_revenue,
            (SELECT COUNT(*) FROM reports WHERE status = 'pending') as pending_reports,
            (SELECT COUNT(*) FROM users WHERE DATE(created_at) = CURDATE()) as new_users_today,
            (SELECT COUNT(*) FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)) as new_users_week,
            (SELECT COUNT(*) FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)) as new_users_month,
            (SELECT COUNT(*) FROM products WHERE DATE(created_at) = CURDATE()) as new_listings_today,
            (SELECT COUNT(*) FROM products WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)) as new_listings_week,
            (SELECT COUNT(*) FROM users WHERE is_banned = TRUE) as banned_users,
            (SELECT COUNT(*) FROM messages) as total_messages,
            (SELECT COUNT(*) FROM reviews) as total_reviews
        `),
        conn.query('SELECT college, COUNT(*) as count FROM users WHERE college IS NOT NULL GROUP BY college ORDER BY count DESC LIMIT 5'),
        conn.query('SELECT category, COUNT(*) as count FROM products GROUP BY category ORDER BY count DESC LIMIT 5')
      ]);
      conn.release();

      res.json({
        total_users: stats.total_users,
        total_products: stats.total_products,
        active_products: stats.active_products,
        sold_products: stats.sold_products,
        total_transactions: stats.total_transactions,
        total_revenue: stats.total_revenue,
        pending_reports: stats.pending_reports,
        new_users_today: stats.new_users_today,
        new_users_week: stats.new_users_week,
        new_users_month: stats.new_users_month,
        new_listings_today: stats.new_listings_today,
        new_listings_week: stats.new_listings_week,
        banned_users: stats.banned_users,
        total_messages: stats.total_messages,
        total_reviews: stats.total_reviews,
        topColleges,
        topCategories
      });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.get('/api/admin/dashboard/charts', authenticateAdmin, async (req, res) => {
    try {
      const conn = await pool.getConnection();
      const [userGrowth] = await conn.query(`
        SELECT DATE(created_at) as date, COUNT(*) as count 
        FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) 
        GROUP BY DATE(created_at) ORDER BY date
      `);
      const [productGrowth] = await conn.query(`
        SELECT DATE(created_at) as date, COUNT(*) as count
        FROM products WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY DATE(created_at) ORDER BY date
      `);
      const [salesTrend] = await conn.query(`
        SELECT DATE(created_at) as date, COUNT(*) as count, SUM(amount) as revenue
        FROM transactions WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY DATE(created_at) ORDER BY date
      `);
      const [categoryDistribution] = await conn.query(`
        SELECT category, COUNT(*) as count FROM products GROUP BY category ORDER BY count DESC
      `);
      conn.release();
      res.json({ userGrowth, productGrowth, salesTrend, categoryDistribution });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // ── User Management ─────────────────────────────────────────
  app.get('/api/admin/users', authenticateAdmin, async (req, res) => {
    try {
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
      const offset = (page - 1) * limit;
      const search = req.query.search || '';
      const college = req.query.college || '';
      const banned = req.query.banned;
      let where = 'WHERE 1=1';
      const params = [];
      if (search) { where += ' AND (u.name LIKE ? OR u.email LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
      if (college) { where += ' AND u.college = ?'; params.push(college); }
      if (banned === 'true') { where += ' AND u.is_banned = TRUE'; }
      if (banned === 'false') { where += ' AND u.is_banned = FALSE'; }
      const conn = await pool.getConnection();
      const [rows] = await conn.query(
        `SELECT u.id, u.email, u.name, u.college, u.phone, u.profile_image, u.coins, u.is_banned, u.ban_reason, u.created_at,
                (SELECT COUNT(*) FROM products WHERE user_id = u.id) as product_count,
                (SELECT COUNT(*) FROM reviews WHERE user_id = u.id) as review_count
         FROM users u ${where} ORDER BY u.created_at DESC LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      );
      const [[{ total }]] = await conn.query(`SELECT COUNT(*) as total FROM users u ${where}`, params);
      conn.release();
      res.json({ data: rows, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.get('/api/admin/users/:id', authenticateAdmin, async (req, res) => {
    try {
      const conn = await pool.getConnection();
      const [users] = await conn.query('SELECT id, email, name, college, phone, profile_image, bio, coins, is_banned, ban_reason, created_at FROM users WHERE id = ?', [req.params.id]);
      if (!users.length) { conn.release(); return res.status(404).json({ error: 'User not found' }); }
      const user = users[0];
      const [products] = await conn.query('SELECT id, title, price, category, sold, is_hidden, created_at FROM products WHERE user_id = ? ORDER BY created_at DESC LIMIT 20', [user.id]);
      const [reviews] = await conn.query('SELECT r.*, p.title as product_title FROM reviews r LEFT JOIN products p ON r.product_id = p.id WHERE r.user_id = ? ORDER BY r.created_at DESC LIMIT 10', [user.id]);
      const [transactions] = await conn.query('SELECT t.*, p.title as product_title FROM transactions t LEFT JOIN products p ON t.product_id = p.id WHERE t.buyer_id = ? OR t.seller_id = ? ORDER BY t.created_at DESC LIMIT 10', [user.id, user.id]);
      const [bans] = await conn.query('SELECT ub.*, au.name as banned_by_name FROM user_bans ub LEFT JOIN admin_users au ON ub.banned_by = au.id WHERE ub.user_id = ? ORDER BY ub.created_at DESC', [user.id]);
      conn.release();
      res.json({ ...user, products, reviews, transactions, bans });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.put('/api/admin/users/:id', authenticateAdmin, requireRole('super_admin', 'moderator'), async (req, res) => {
    try {
      const { name, college, phone, coins } = req.body;
      const conn = await pool.getConnection();
      await conn.query('UPDATE users SET name = ?, college = ?, phone = ? WHERE id = ?', [name, college, phone, req.params.id]);
      if (coins !== undefined) await conn.query('UPDATE users SET coins = ? WHERE id = ?', [parseInt(coins), req.params.id]);
      const [rows] = await conn.query('SELECT id, email, name, college, phone, coins, is_banned FROM users WHERE id = ?', [req.params.id]);
      conn.release();
      logAction(req.admin.id, 'edit_user', 'user', parseInt(req.params.id), `Updated user details`, req.ip);
      res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.post('/api/admin/users/:id/ban', authenticateAdmin, requireRole('super_admin', 'moderator'), async (req, res) => {
    try {
      const { reason, banType, expiresAt } = req.body;
      const userId = parseInt(req.params.id);
      const conn = await pool.getConnection();
      await conn.query('UPDATE users SET is_banned = TRUE, ban_reason = ? WHERE id = ?', [reason || 'Banned by admin', userId]);
      await conn.query('INSERT INTO user_bans (user_id, banned_by, reason, ban_type, expires_at) VALUES (?,?,?,?,?)',
        [userId, req.admin.id, reason, banType || 'permanent', expiresAt || null]);
      conn.release();
      logAction(req.admin.id, 'ban_user', 'user', userId, reason, req.ip);
      res.json({ message: 'User banned successfully' });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.post('/api/admin/users/:id/unban', authenticateAdmin, requireRole('super_admin', 'moderator'), async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const conn = await pool.getConnection();
      await conn.query('UPDATE users SET is_banned = FALSE, ban_reason = NULL WHERE id = ?', [userId]);
      conn.release();
      logAction(req.admin.id, 'unban_user', 'user', userId, null, req.ip);
      res.json({ message: 'User unbanned successfully' });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.put('/api/admin/users/:id/coins', authenticateAdmin, requireRole('super_admin', 'moderator'), async (req, res) => {
    try {
      const { amount, action } = req.body; // action: 'add' or 'deduct'
      const userId = parseInt(req.params.id);
      const conn = await pool.getConnection();
      if (action === 'add') {
        await conn.query('UPDATE users SET coins = IFNULL(coins, 0) + ? WHERE id = ?', [parseInt(amount), userId]);
      } else {
        await conn.query('UPDATE users SET coins = GREATEST(0, IFNULL(coins, 0) - ?) WHERE id = ?', [parseInt(amount), userId]);
      }
      const [rows] = await conn.query('SELECT coins FROM users WHERE id = ?', [userId]);
      conn.release();
      logAction(req.admin.id, `${action}_coins`, 'user', userId, `${action} ${amount} coins`, req.ip);
      res.json({ coins: rows[0]?.coins || 0 });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // ── Product Management ──────────────────────────────────────
  app.get('/api/admin/products', authenticateAdmin, async (req, res) => {
    try {
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
      const offset = (page - 1) * limit;
      const search = req.query.search || '';
      const category = req.query.category || '';
      const sold = req.query.sold;
      const hidden = req.query.hidden;
      const featured = req.query.featured;
      let where = 'WHERE 1=1';
      const params = [];
      if (search) { where += ' AND (p.title LIKE ? OR p.description LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
      if (category) { where += ' AND p.category = ?'; params.push(category); }
      if (sold === 'true') where += ' AND p.sold = TRUE';
      if (sold === 'false') where += ' AND p.sold = FALSE';
      if (hidden === 'true') where += ' AND p.is_hidden = TRUE';
      if (hidden === 'false') where += ' AND p.is_hidden = FALSE';
      if (featured === 'true') where += ' AND p.featured = TRUE';
      const conn = await pool.getConnection();
      const [rows] = await conn.query(
        `SELECT p.*, u.name as seller_name, u.email as seller_email, u.college,
                (SELECT COUNT(*) FROM reports WHERE product_id = p.id AND status = 'pending') as report_count,
                (SELECT COUNT(*) FROM wishlist WHERE product_id = p.id) as wishlist_count
         FROM products p LEFT JOIN users u ON p.user_id = u.id ${where}
         ORDER BY p.created_at DESC LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      );
      const [[{ total }]] = await conn.query(`SELECT COUNT(*) as total FROM products p ${where}`, params);
      conn.release();
      res.json({ data: rows, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.get('/api/admin/products/:id', authenticateAdmin, async (req, res) => {
    try {
      const conn = await pool.getConnection();
      const [rows] = await conn.query(
        `SELECT p.*, u.name as seller_name, u.email as seller_email, u.college
         FROM products p LEFT JOIN users u ON p.user_id = u.id WHERE p.id = ?`, [req.params.id]);
      if (!rows.length) { conn.release(); return res.status(404).json({ error: 'Product not found' }); }
      const product = rows[0];
      const [images] = await conn.query('SELECT image_url FROM product_images WHERE product_id = ?', [product.id]);
      product.images = [product.image_url, ...images.map(i => i.image_url)].filter(Boolean);
      const [reports] = await conn.query('SELECT r.*, u.name as reporter_name FROM reports r LEFT JOIN users u ON r.reporter_id = u.id WHERE r.product_id = ? ORDER BY r.created_at DESC', [product.id]);
      const [reviews] = await conn.query('SELECT rv.*, u.name as reviewer_name FROM reviews rv LEFT JOIN users u ON rv.user_id = u.id WHERE rv.product_id = ?', [product.id]);
      product.reports = reports;
      product.reviews = reviews;
      conn.release();
      res.json(product);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.put('/api/admin/products/:id', authenticateAdmin, requireRole('super_admin', 'moderator'), async (req, res) => {
    try {
      const { title, description, price, condition, category, location } = req.body;
      const conn = await pool.getConnection();
      await conn.query(
        'UPDATE products SET title=?, description=?, price=?, `condition`=?, category=?, location=? WHERE id=?',
        [title, description, price, condition, category, location, req.params.id]
      );
      conn.release();
      logAction(req.admin.id, 'edit_product', 'product', parseInt(req.params.id), 'Edited product details', req.ip);
      res.json({ message: 'Product updated' });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.delete('/api/admin/products/:id', authenticateAdmin, requireRole('super_admin', 'moderator'), async (req, res) => {
    try {
      const conn = await pool.getConnection();
      await conn.query('DELETE FROM products WHERE id = ?', [req.params.id]);
      conn.release();
      logAction(req.admin.id, 'delete_product', 'product', parseInt(req.params.id), null, req.ip);
      res.json({ message: 'Product deleted' });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.put('/api/admin/products/:id/featured', authenticateAdmin, requireRole('super_admin', 'moderator'), async (req, res) => {
    try {
      const conn = await pool.getConnection();
      const [rows] = await conn.query('SELECT featured FROM products WHERE id = ?', [req.params.id]);
      if (!rows.length) { conn.release(); return res.status(404).json({ error: 'Product not found' }); }
      const newVal = !rows[0].featured;
      await conn.query('UPDATE products SET featured = ? WHERE id = ?', [newVal, req.params.id]);
      conn.release();
      logAction(req.admin.id, newVal ? 'feature_product' : 'unfeature_product', 'product', parseInt(req.params.id), null, req.ip);
      res.json({ featured: newVal });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.put('/api/admin/products/:id/hide', authenticateAdmin, requireRole('super_admin', 'moderator'), async (req, res) => {
    try {
      const { hidden, reason } = req.body;
      const conn = await pool.getConnection();
      await conn.query('UPDATE products SET is_hidden = ?, hidden_reason = ? WHERE id = ?', [hidden, reason || null, req.params.id]);
      conn.release();
      logAction(req.admin.id, hidden ? 'hide_product' : 'unhide_product', 'product', parseInt(req.params.id), reason, req.ip);
      res.json({ message: hidden ? 'Product hidden' : 'Product visible' });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // ── Category Management ─────────────────────────────────────
  app.get('/api/admin/categories', authenticateAdmin, async (req, res) => {
    try {
      const now = Date.now();
      if (categoriesCache && (now - categoriesCacheTime < 60000)) {
        return res.json(categoriesCache);
      }
      const conn = await pool.getConnection();
      const [rows] = await conn.query(
        `SELECT c.*, (SELECT COUNT(*) FROM products WHERE category = c.name) as product_count
         FROM categories c ORDER BY c.name`
      );
      conn.release();
      categoriesCache = rows;
      categoriesCacheTime = now;
      res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.post('/api/admin/categories', authenticateAdmin, requireRole('super_admin', 'moderator'), async (req, res) => {
    try {
      const { name, emoji, description } = req.body;
      if (!name) return res.status(400).json({ error: 'Category name required' });
      const conn = await pool.getConnection();
      const [result] = await conn.query('INSERT INTO categories (name, emoji, description) VALUES (?,?,?)', [name, emoji, description]);
      const [rows] = await conn.query('SELECT * FROM categories WHERE id = ?', [result.insertId]);
      conn.release();
      categoriesCache = null; // Invalidate cache
      logAction(req.admin.id, 'create_category', 'category', result.insertId, name, req.ip);
      res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.put('/api/admin/categories/:id', authenticateAdmin, requireRole('super_admin', 'moderator'), async (req, res) => {
    try {
      const { name, emoji, description } = req.body;
      const conn = await pool.getConnection();
      await conn.query('UPDATE categories SET name = ?, emoji = ?, description = ? WHERE id = ?', [name, emoji, description, req.params.id]);
      const [rows] = await conn.query('SELECT * FROM categories WHERE id = ?', [req.params.id]);
      conn.release();
      categoriesCache = null; // Invalidate cache
      logAction(req.admin.id, 'edit_category', 'category', parseInt(req.params.id), name, req.ip);
      res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.delete('/api/admin/categories/:id', authenticateAdmin, requireRole('super_admin'), async (req, res) => {
    try {
      const conn = await pool.getConnection();
      await conn.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
      conn.release();
      categoriesCache = null; // Invalidate cache
      logAction(req.admin.id, 'delete_category', 'category', parseInt(req.params.id), null, req.ip);
      res.json({ message: 'Category deleted' });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // ── Reports & Moderation ────────────────────────────────────
  app.get('/api/admin/reports', authenticateAdmin, async (req, res) => {
    try {
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
      const offset = (page - 1) * limit;
      const status = req.query.status || '';
      let where = 'WHERE 1=1';
      const params = [];
      if (status) { where += ' AND r.status = ?'; params.push(status); }
      const conn = await pool.getConnection();
      const [rows] = await conn.query(
        `SELECT r.*, u.name as reporter_name, u.email as reporter_email, 
                p.title as product_title, p.price as product_price,
                seller.name as seller_name
         FROM reports r
         LEFT JOIN users u ON r.reporter_id = u.id
         LEFT JOIN products p ON r.product_id = p.id
         LEFT JOIN users seller ON p.user_id = seller.id
         ${where} ORDER BY r.created_at DESC LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      );
      const [[{ total }]] = await conn.query(`SELECT COUNT(*) as total FROM reports r ${where}`, params);
      conn.release();
      res.json({ data: rows, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.put('/api/admin/reports/:id', authenticateAdmin, requireRole('super_admin', 'moderator'), async (req, res) => {
    try {
      const { status } = req.body; // 'resolved' or 'dismissed'
      if (!['resolved', 'dismissed'].includes(status)) return res.status(400).json({ error: 'Invalid status' });
      const conn = await pool.getConnection();
      await conn.query('UPDATE reports SET status = ?, resolved_by = ?, resolved_at = NOW() WHERE id = ?',
        [status, req.admin.id, req.params.id]);
      conn.release();
      logAction(req.admin.id, `${status}_report`, 'report', parseInt(req.params.id), null, req.ip);
      res.json({ message: `Report ${status}` });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // ── Transactions ────────────────────────────────────────────
  app.get('/api/admin/transactions', authenticateAdmin, async (req, res) => {
    try {
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
      const offset = (page - 1) * limit;
      const conn = await pool.getConnection();
      const [rows] = await conn.query(
        `SELECT t.*, p.title as product_title, buyer.name as buyer_name, seller.name as seller_name
         FROM transactions t
         LEFT JOIN products p ON t.product_id = p.id
         LEFT JOIN users buyer ON t.buyer_id = buyer.id
         LEFT JOIN users seller ON t.seller_id = seller.id
         ORDER BY t.created_at DESC LIMIT ? OFFSET ?`,
        [limit, offset]
      );
      const [[{ total }]] = await conn.query('SELECT COUNT(*) as total FROM transactions');
      conn.release();
      res.json({ data: rows, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // ── Offers ──────────────────────────────────────────────────
  app.get('/api/admin/offers', authenticateAdmin, async (req, res) => {
    try {
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
      const offset = (page - 1) * limit;
      const conn = await pool.getConnection();
      const [rows] = await conn.query(
        `SELECT o.*, p.title as product_title, buyer.name as buyer_name, seller.name as seller_name
         FROM offers o
         LEFT JOIN products p ON o.product_id = p.id
         LEFT JOIN users buyer ON o.buyer_id = buyer.id
         LEFT JOIN users seller ON o.seller_id = seller.id
         ORDER BY o.created_at DESC LIMIT ? OFFSET ?`,
        [limit, offset]
      );
      const [[{ total }]] = await conn.query('SELECT COUNT(*) as total FROM offers');
      conn.release();
      res.json({ data: rows, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // ── Messages Moderation ─────────────────────────────────────
  app.get('/api/admin/messages/:productId', authenticateAdmin, async (req, res) => {
    try {
      const conn = await pool.getConnection();
      const [rows] = await conn.query(
        `SELECT m.*, s.name as sender_name, r.name as receiver_name
         FROM messages m
         LEFT JOIN users s ON m.sender_id = s.id
         LEFT JOIN users r ON m.receiver_id = r.id
         WHERE m.product_id = ? ORDER BY m.created_at ASC`,
        [req.params.productId]
      );
      conn.release();
      res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.delete('/api/admin/messages/:id', authenticateAdmin, requireRole('super_admin', 'moderator'), async (req, res) => {
    try {
      const conn = await pool.getConnection();
      await conn.query('DELETE FROM messages WHERE id = ?', [req.params.id]);
      conn.release();
      logAction(req.admin.id, 'delete_message', 'message', parseInt(req.params.id), null, req.ip);
      res.json({ message: 'Message deleted' });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // ── Reviews ─────────────────────────────────────────────────
  app.get('/api/admin/reviews', authenticateAdmin, async (req, res) => {
    try {
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
      const offset = (page - 1) * limit;
      const conn = await pool.getConnection();
      const [rows] = await conn.query(
        `SELECT rv.*, u.name as reviewer_name, u.email as reviewer_email, p.title as product_title
         FROM reviews rv
         LEFT JOIN users u ON rv.user_id = u.id
         LEFT JOIN products p ON rv.product_id = p.id
         ORDER BY rv.created_at DESC LIMIT ? OFFSET ?`,
        [limit, offset]
      );
      const [[{ total }]] = await conn.query('SELECT COUNT(*) as total FROM reviews');
      conn.release();
      res.json({ data: rows, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.delete('/api/admin/reviews/:id', authenticateAdmin, requireRole('super_admin', 'moderator'), async (req, res) => {
    try {
      const conn = await pool.getConnection();
      await conn.query('DELETE FROM reviews WHERE id = ?', [req.params.id]);
      conn.release();
      logAction(req.admin.id, 'delete_review', 'review', parseInt(req.params.id), null, req.ip);
      res.json({ message: 'Review deleted' });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // ── Coins / Wallet ──────────────────────────────────────────
  app.get('/api/admin/coins/stats', authenticateAdmin, async (req, res) => {
    try {
      const conn = await pool.getConnection();
      const [[{ total_coins }]] = await conn.query('SELECT IFNULL(SUM(coins),0) as total_coins FROM users');
      const [[{ avg_coins }]] = await conn.query('SELECT IFNULL(ROUND(AVG(coins),1),0) as avg_coins FROM users');
      const [[{ max_coins }]] = await conn.query('SELECT IFNULL(MAX(coins),0) as max_coins FROM users');
      const [topUsers] = await conn.query('SELECT id, name, email, coins FROM users ORDER BY coins DESC LIMIT 10');
      const [distribution] = await conn.query(`
        SELECT 
          CASE 
            WHEN coins = 0 THEN '0'
            WHEN coins BETWEEN 1 AND 50 THEN '1-50'
            WHEN coins BETWEEN 51 AND 100 THEN '51-100'
            WHEN coins BETWEEN 101 AND 500 THEN '101-500'
            ELSE '500+'
          END as range_label,
          COUNT(*) as count
        FROM users GROUP BY range_label ORDER BY FIELD(range_label, '0', '1-50', '51-100', '101-500', '500+')
      `);
      conn.release();
      res.json({ total_coins, avg_coins, max_coins, topUsers, distribution });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // ── Colleges ────────────────────────────────────────────────
  app.get('/api/admin/colleges', authenticateAdmin, async (req, res) => {
    try {
      const conn = await pool.getConnection();
      const [rows] = await conn.query(`
        SELECT u.college, COUNT(DISTINCT u.id) as user_count,
               (SELECT COUNT(*) FROM products WHERE location = u.college) as product_count
        FROM users u WHERE u.college IS NOT NULL AND u.college != ''
        GROUP BY u.college ORDER BY user_count DESC
      `);
      conn.release();
      res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // ── Announcements ───────────────────────────────────────────
  app.get('/api/admin/announcements', authenticateAdmin, async (req, res) => {
    try {
      const conn = await pool.getConnection();
      const [rows] = await conn.query(
        'SELECT a.*, au.name as created_by_name FROM announcements a LEFT JOIN admin_users au ON a.created_by = au.id ORDER BY a.created_at DESC'
      );
      conn.release();
      res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.post('/api/admin/announcements', authenticateAdmin, requireRole('super_admin', 'moderator'), async (req, res) => {
    try {
      const { title, message, target, targetCollege } = req.body;
      if (!title || !message) return res.status(400).json({ error: 'Title and message required' });
      const conn = await pool.getConnection();
      const [result] = await conn.query(
        'INSERT INTO announcements (title, message, target, target_college, created_by) VALUES (?,?,?,?,?)',
        [title, message, target || 'all', targetCollege || null, req.admin.id]
      );
      const [rows] = await conn.query('SELECT * FROM announcements WHERE id = ?', [result.insertId]);
      conn.release();
      logAction(req.admin.id, 'create_announcement', 'announcement', result.insertId, title, req.ip);
      res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.put('/api/admin/announcements/:id', authenticateAdmin, requireRole('super_admin', 'moderator'), async (req, res) => {
    try {
      const { title, message, is_active } = req.body;
      const conn = await pool.getConnection();
      await conn.query('UPDATE announcements SET title = ?, message = ?, is_active = ? WHERE id = ?',
        [title, message, is_active !== undefined ? is_active : true, req.params.id]);
      const [rows] = await conn.query('SELECT * FROM announcements WHERE id = ?', [req.params.id]);
      conn.release();
      res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.post('/api/admin/announcements/:id/send-email', authenticateAdmin, requireRole('super_admin'), async (req, res) => {
    try {
      const conn = await pool.getConnection();
      const [announcements] = await conn.query('SELECT * FROM announcements WHERE id = ?', [req.params.id]);
      if (!announcements.length) { conn.release(); return res.status(404).json({ error: 'Announcement not found' }); }
      const announcement = announcements[0];
      let userQuery = 'SELECT email, name FROM users WHERE is_banned = FALSE';
      const qParams = [];
      if (announcement.target === 'college' && announcement.target_college) {
        userQuery += ' AND college = ?';
        qParams.push(announcement.target_college);
      }
      const [users] = await conn.query(userQuery, qParams);
      conn.release();
      // Send emails in background
      let sent = 0;
      for (const u of users) {
        try {
          if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your-email@gmail.com') break;
          await emailTransporter.sendMail({
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to: u.email,
            subject: `${announcement.title} — CollegeMart`,
            html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
              <h2 style="color:#002f34">${escapeHtml(announcement.title)}</h2>
              <p style="color:#475569;line-height:1.6;white-space:pre-wrap">${escapeHtml(announcement.message)}</p>
              <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0">
              <p style="color:#94a3b8;font-size:12px">CollegeMart Announcement</p>
            </div>`
          });
          sent++;
        } catch (e) { /* skip individual failures */ }
      }
      logAction(req.admin.id, 'send_announcement_email', 'announcement', parseInt(req.params.id), `Sent to ${sent}/${users.length} users`, req.ip);
      res.json({ message: `Email sent to ${sent} of ${users.length} users` });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // ── Site Settings ───────────────────────────────────────────
  app.get('/api/admin/settings', authenticateAdmin, async (req, res) => {
    try {
      const conn = await pool.getConnection();
      const [rows] = await conn.query('SELECT * FROM site_settings ORDER BY setting_key');
      conn.release();
      const settings = {};
      rows.forEach(r => { settings[r.setting_key] = r.setting_value; });
      res.json(settings);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.put('/api/admin/settings', authenticateAdmin, requireRole('super_admin'), async (req, res) => {
    try {
      const settings = req.body;
      const conn = await pool.getConnection();
      for (const [key, value] of Object.entries(settings)) {
        await conn.query(
          'INSERT INTO site_settings (setting_key, setting_value, updated_by) VALUES (?,?,?) ON DUPLICATE KEY UPDATE setting_value = ?, updated_by = ?',
          [key, value, req.admin.id, value, req.admin.id]
        );
      }
      conn.release();
      logAction(req.admin.id, 'update_settings', 'settings', null, JSON.stringify(Object.keys(settings)), req.ip);
      res.json({ message: 'Settings updated' });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // ── Admin Access Control ────────────────────────────────────
  app.get('/api/admin/admins', authenticateAdmin, requireRole('super_admin'), async (req, res) => {
    try {
      const conn = await pool.getConnection();
      const [rows] = await conn.query('SELECT id, email, name, role, is_active, last_login, created_at FROM admin_users ORDER BY created_at');
      conn.release();
      res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.post('/api/admin/admins', authenticateAdmin, requireRole('super_admin'), async (req, res) => {
    try {
      const { email, password, name, role } = req.body;
      if (!email || !password || !name) return res.status(400).json({ error: 'Email, password, and name required' });
      const hash = await bcrypt.hash(password, 10);
      const conn = await pool.getConnection();
      const [result] = await conn.query(
        'INSERT INTO admin_users (email, password, name, role) VALUES (?,?,?,?)',
        [email, hash, name, role || 'moderator']
      );
      const [rows] = await conn.query('SELECT id, email, name, role, is_active, created_at FROM admin_users WHERE id = ?', [result.insertId]);
      conn.release();
      logAction(req.admin.id, 'create_admin', 'admin', result.insertId, `${role}: ${email}`, req.ip);
      res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.put('/api/admin/admins/:id', authenticateAdmin, requireRole('super_admin'), async (req, res) => {
    try {
      const { name, role, is_active } = req.body;
      const conn = await pool.getConnection();
      await conn.query('UPDATE admin_users SET name = ?, role = ?, is_active = ? WHERE id = ?',
        [name, role, is_active, req.params.id]);
      const [rows] = await conn.query('SELECT id, email, name, role, is_active, created_at FROM admin_users WHERE id = ?', [req.params.id]);
      conn.release();
      logAction(req.admin.id, 'update_admin', 'admin', parseInt(req.params.id), `role: ${role}, active: ${is_active}`, req.ip);
      res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.get('/api/admin/logs', authenticateAdmin, async (req, res) => {
    try {
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 50));
      const offset = (page - 1) * limit;
      const conn = await pool.getConnection();
      const [rows] = await conn.query(
        `SELECT al.*, au.name as admin_name, au.email as admin_email
         FROM admin_logs al LEFT JOIN admin_users au ON al.admin_id = au.id
         ORDER BY al.created_at DESC LIMIT ? OFFSET ?`,
        [limit, offset]
      );
      const [[{ total }]] = await conn.query('SELECT COUNT(*) as total FROM admin_logs');
      conn.release();
      res.json({ data: rows, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // ── Analytics ───────────────────────────────────────────────
  app.get('/api/admin/analytics/users', authenticateAdmin, async (req, res) => {
    try {
      const days = parseInt(req.query.days) || 30;
      const conn = await pool.getConnection();
      const [rows] = await conn.query(`
        SELECT DATE(created_at) as date, COUNT(*) as count
        FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
        GROUP BY DATE(created_at) ORDER BY date
      `, [days]);
      conn.release();
      res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.get('/api/admin/analytics/products', authenticateAdmin, async (req, res) => {
    try {
      const days = parseInt(req.query.days) || 30;
      const conn = await pool.getConnection();
      const [newListings] = await conn.query(`
        SELECT DATE(created_at) as date, COUNT(*) as count FROM products
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY) GROUP BY DATE(created_at) ORDER BY date
      `, [days]);
      const [soldListings] = await conn.query(`
        SELECT DATE(sold_at) as date, COUNT(*) as count FROM products
        WHERE sold = TRUE AND sold_at IS NOT NULL AND sold_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
        GROUP BY DATE(sold_at) ORDER BY date
      `, [days]);
      conn.release();
      res.json({ newListings, soldListings });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.get('/api/admin/analytics/categories', authenticateAdmin, async (req, res) => {
    try {
      const conn = await pool.getConnection();
      const [rows] = await conn.query(`
        SELECT category, COUNT(*) as total, SUM(CASE WHEN sold = TRUE THEN 1 ELSE 0 END) as sold_count,
               ROUND(AVG(price), 2) as avg_price
        FROM products GROUP BY category ORDER BY total DESC
      `);
      conn.release();
      res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.get('/api/admin/analytics/revenue', authenticateAdmin, async (req, res) => {
    try {
      const days = parseInt(req.query.days) || 30;
      const conn = await pool.getConnection();
      const [daily] = await conn.query(`
        SELECT DATE(created_at) as date, SUM(amount) as revenue, COUNT(*) as count
        FROM transactions WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
        GROUP BY DATE(created_at) ORDER BY date
      `, [days]);
      const [[totals]] = await conn.query('SELECT SUM(amount) as total_revenue, COUNT(*) as total_count FROM transactions');
      conn.release();
      res.json({ daily, totals });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.get('/api/admin/analytics/export', authenticateAdmin, requireRole('super_admin', 'moderator'), async (req, res) => {
    try {
      const type = req.query.type || 'users';
      const conn = await pool.getConnection();
      let rows;
      if (type === 'users') {
        [rows] = await conn.query('SELECT id, email, name, college, phone, coins, is_banned, created_at FROM users ORDER BY id');
      } else if (type === 'products') {
        [rows] = await conn.query('SELECT id, title, price, `condition`, category, location, sold, is_hidden, created_at FROM products ORDER BY id');
      } else if (type === 'transactions') {
        [rows] = await conn.query('SELECT * FROM transactions ORDER BY id');
      } else {
        conn.release();
        return res.status(400).json({ error: 'Invalid export type' });
      }
      conn.release();
      if (!rows.length) return res.json([]);
      // Convert to CSV
      const headers = Object.keys(rows[0]);
      const csv = [headers.join(','), ...rows.map(r => headers.map(h => {
        const v = r[h];
        if (v === null || v === undefined) return '';
        const s = String(v);
        return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
      }).join(','))].join('\n');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${type}_export_${new Date().toISOString().split('T')[0]}.csv`);
      res.send(csv);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // ── Sold product auto-hide cron ─────────────────────────────
  setInterval(async () => {
    try {
      const conn = await pool.getConnection();
      // Get the hide days from settings
      const [settings] = await conn.query("SELECT setting_value FROM site_settings WHERE setting_key = 'sold_product_hide_days'");
      const hideDays = settings.length ? parseInt(settings[0].setting_value) || 7 : 7;
      const [result] = await conn.query(
        `UPDATE products SET is_hidden = TRUE, hidden_reason = 'Auto-hidden: sold over ${hideDays} days ago'
         WHERE sold = TRUE AND sold_at IS NOT NULL AND is_hidden = FALSE
         AND sold_at < DATE_SUB(NOW(), INTERVAL ? DAY)`,
        [hideDays]
      );
      conn.release();
      if (result.affectedRows > 0) {
        console.log(`[CRON] Auto-hidden ${result.affectedRows} sold product(s) older than ${hideDays} days`);
      }
    } catch (e) {
      console.error('[CRON ERROR] Sold product cleanup:', e.message);
    }
  }, 60 * 60 * 1000); // Run every hour

  console.log('[ADMIN] Admin routes loaded, sold-product cron started (hourly)');
}
