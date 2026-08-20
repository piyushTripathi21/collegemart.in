import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/db.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import { authenticateToken } from '../middleware/auth.js';
import { sensitiveLimiter, productListLimiter, searchLimiter, reviewLimiter } from '../middleware/rate-limit.js';
import { validateProductInput } from '../middleware/validation.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '../../public/uploads/');

const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB per file
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

const productSelect = `
  SELECT
    p.id,
    p.user_id,
    p.title,
    p.description,
    p.price,
    p.\`condition\`,
    p.category,
    p.location,
    p.emoji,
    p.featured,
    p.sold,
    p.image_url AS image,
    p.views,
    p.likes,
    p.created_at AS createdAt,
    p.updated_at AS updatedAt,
    u.name AS seller,
    u.email AS sellerEmail,
    u.phone AS sellerPhone,
    u.college AS college,
    IFNULL(ROUND(AVG(r.rating), 1), 0) AS average_rating,
    COUNT(DISTINCT r.id) AS review_count
  FROM products p
  LEFT JOIN users u ON p.user_id = u.id
  LEFT JOIN reviews r ON p.id = r.product_id
`;

const productListSelect = `
  SELECT
    p.id,
    p.user_id,
    p.title,
    p.price,
    p.\`condition\`,
    p.category,
    p.location,
    p.emoji,
    p.featured,
    p.sold,
    p.image_url AS image,
    p.views,
    p.likes,
    p.created_at AS createdAt,
    p.updated_at AS updatedAt,
    u.name AS seller,
    u.college AS college,
    IFNULL(ROUND(AVG(r.rating), 1), 0) AS average_rating,
    COUNT(DISTINCT r.id) AS review_count
  FROM products p
  LEFT JOIN users u ON p.user_id = u.id
  LEFT JOIN reviews r ON p.id = r.product_id
`;

const cleanupFiles = (filesList) => {
  if (!filesList) return;
  const files = Array.isArray(filesList) ? filesList : [filesList];
  for (const file of files) {
    if (file && file.path && fs.existsSync(file.path)) {
      try {
        fs.unlinkSync(file.path);
      } catch (err) {
        console.error('[CLEANUP ERROR] Failed to delete file', file.path, err);
      }
    }
  }
};

router.get('/', productListLimiter, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;

    if (offset > 1000) {
      return res.status(400).json({ error: 'Pagination limit exceeded. Offset cannot exceed 1000.' });
    }

    let whereClauses = [];
    let queryParams = [];

    if (req.query.category && req.query.category.toLowerCase() !== 'all') {
      whereClauses.push('LOWER(p.category) = LOWER(?)');
      queryParams.push(req.query.category);
    }

    if (req.query.college) {
      whereClauses.push('LOWER(u.college) = LOWER(?)');
      queryParams.push(req.query.college);
    }

    const whereStr = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `${productListSelect} ${whereStr} GROUP BY p.id ORDER BY p.created_at DESC LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    );
    const [countResult] = await connection.query(
      `SELECT COUNT(*) as total FROM products p LEFT JOIN users u ON p.user_id = u.id ${whereStr}`,
      queryParams
    );
    const total = countResult[0]?.total || 0;

    connection.release();
    res.json({
      data: rows,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.get('/featured/all', productListLimiter, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;

    if (offset > 1000) {
      return res.status(400).json({ error: 'Pagination limit exceeded. Offset cannot exceed 1000.' });
    }

    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `${productListSelect} WHERE p.featured = true GROUP BY p.id ORDER BY p.created_at DESC LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    const [countResult] = await connection.query(
      'SELECT COUNT(*) as total FROM products WHERE featured = true'
    );
    const total = countResult[0]?.total || 0;

    connection.release();
    res.json({
      data: rows,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch featured products' });
  }
});

router.get('/search', searchLimiter, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }

    const query = String(q).trim();
    if (query.length < 2 || query.length > 100) {
      return res.status(400).json({ error: 'Search query must be between 2 and 100 characters' });
    }

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;

    if (offset > 1000) {
      return res.status(400).json({ error: 'Pagination limit exceeded. Offset cannot exceed 1000.' });
    }

    const connection = await pool.getConnection();
    const words = query.split(/\s+/).filter(w => w.length > 0).map(w => `+${w}*`).join(' ');
    const escapedQuery = query.replace(/[%_]/g, '\\$&');
    const searchTerm = `%${escapedQuery}%`;

    const [rows] = await connection.query(
      `${productListSelect} WHERE MATCH(p.title, p.description) AGAINST(? IN BOOLEAN MODE) OR p.category LIKE ? OR u.name LIKE ? GROUP BY p.id ORDER BY p.created_at DESC LIMIT ? OFFSET ?`,
      [words, searchTerm, searchTerm, limit, offset]
    );
    const [countResult] = await connection.query(
      'SELECT COUNT(*) as total FROM products p LEFT JOIN users u ON p.user_id = u.id WHERE MATCH(p.title, p.description) AGAINST(? IN BOOLEAN MODE) OR p.category LIKE ? OR u.name LIKE ?',
      [words, searchTerm, searchTerm]
    );
    const total = countResult[0]?.total || 0;

    connection.release();
    res.json({
      data: rows,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

router.get('/category/:category', productListLimiter, async (req, res) => {
  try {
    const category = req.params.category;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;

    if (offset > 1000) {
      return res.status(400).json({ error: 'Pagination limit exceeded. Offset cannot exceed 1000.' });
    }

    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `${productListSelect} WHERE LOWER(p.category) = LOWER(?) GROUP BY p.id ORDER BY p.created_at DESC LIMIT ? OFFSET ?`,
      [category, limit, offset]
    );
    const [countResult] = await connection.query(
      'SELECT COUNT(*) as total FROM products WHERE LOWER(category) = LOWER(?)',
      [category]
    );
    const total = countResult[0]?.total || 0;

    connection.release();
    res.json({
      data: rows,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch category products' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const [
      [productRows],
      [imageRows],
      [reviewRows]
    ] = await Promise.all([
      pool.query(`${productSelect} WHERE p.id = ? GROUP BY p.id`, [productId]),
      pool.query('SELECT image_url FROM product_images WHERE product_id = ? ORDER BY id ASC', [productId]),
      pool.query(
        `SELECT r.id, r.rating, r.comment, r.created_at AS createdAt, u.name AS reviewer_name
         FROM reviews r
         JOIN users u ON r.user_id = u.id
         WHERE r.product_id = ?
         ORDER BY r.created_at DESC`,
        [productId]
      )
    ]);

    if (productRows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = productRows[0];
    product.images = [product.image, ...imageRows.map((r) => r.image_url)].filter(Boolean);
    product.reviews = reviewRows;

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product details' });
  }
});

router.post('/', authenticateToken, validateProductInput, async (req, res) => {
  try {
    const title = req.body.title.trim();
    const description = (req.body.description || '').trim();
    const price = Number(req.body.price);
    const condition = req.body.condition;
    const category = req.body.category;
    const location = req.body.location.trim();
    const imageUrl = (req.body.image_url || '').trim();
    const featured = Boolean(req.body.featured);

    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO products (user_id, title, description, price, `condition`, category, location, image_url, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, title, description, price, condition, category, location, imageUrl || null, featured]
    );
    const [rows] = await connection.query(`${productSelect} WHERE p.id = ? GROUP BY p.id`, [result.insertId]);
    connection.release();

    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

router.post('/upload', authenticateToken, upload.fields([
  { name: 'images', maxCount: 6 },
  { name: 'image', maxCount: 1 }
]), validateProductInput, async (req, res) => {
  const connection = await pool.getConnection();
  const allFiles = [];
  if (req.files?.images) allFiles.push(...req.files.images);
  if (req.files?.image) allFiles.push(...req.files.image);

  try {
    await connection.beginTransaction();

    const title = req.body.title.trim();
    const description = (req.body.description || '').trim();
    const price = Number(req.body.price);
    const condition = req.body.condition;
    const category = req.body.category;
    const location = req.body.location.trim();

    const uploadedUrls = await Promise.all(allFiles.map(f => uploadToCloudinary(f.path, 'products')));

    const imageUrl = uploadedUrls.length > 0 ? uploadedUrls[0] : null;
    const [result] = await connection.query(
      'INSERT INTO products (user_id, title, description, price, `condition`, category, location, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, title, description, price, condition, category, location, imageUrl]
    );

    const productId = result.insertId;
    if (uploadedUrls.length > 1) {
      const extraUrls = uploadedUrls.slice(1);
      for (const url of extraUrls) {
        await connection.query(
          'INSERT INTO product_images (product_id, image_url) VALUES (?, ?)',
          [productId, url]
        );
      }
    }

    await connection.commit();

    const [rows] = await connection.query(`${productSelect} WHERE p.id = ? GROUP BY p.id`, [productId]);
    const product = rows[0];
    const [imageRows] = await connection.query('SELECT image_url FROM product_images WHERE product_id = ? ORDER BY id ASC', [productId]);
    product.images = [product.image, ...imageRows.map(r => r.image_url)].filter(Boolean);

    connection.release();
    res.status(201).json(product);
  } catch (error) {
    await connection.rollback();
    connection.release();
    cleanupFiles(allFiles); // ERROR RECOVERY FIX: delete orphaned disk images on rollback
    res.status(500).json({ error: 'Product upload failed' });
  }
});

router.put('/:id', authenticateToken, validateProductInput, async (req, res) => {
  try {
    const title = req.body.title.trim();
    const description = (req.body.description || '').trim();
    const price = Number(req.body.price);
    const condition = req.body.condition;
    const category = req.body.category;
    const location = req.body.location.trim();
    const imageUrl = (req.body.image_url || '').trim();
    const featured = Boolean(req.body.featured);

    const connection = await pool.getConnection();
    const [ownedRows] = await connection.query('SELECT user_id, sold FROM products WHERE id = ?', [req.params.id]);
    
    if (ownedRows.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Product not found' });
    }
    
    if (ownedRows[0].user_id !== req.user.id) {
      connection.release();
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (ownedRows[0].sold) {
      connection.release();
      return res.status(400).json({ error: 'Cannot update a product after it has been marked as sold' });
    }

    await connection.query(
      'UPDATE products SET title=?, description=?, price=?, `condition`=?, category=?, location=?, image_url=?, featured=? WHERE id=?',
      [title, description, price, condition, category, location, imageUrl || null, featured, req.params.id]
    );
    const [rows] = await connection.query(`${productSelect} WHERE p.id = ? GROUP BY p.id`, [req.params.id]);
    connection.release();
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [ownedRows] = await connection.query('SELECT user_id, image_url FROM products WHERE id = ?', [req.params.id]);
    if (ownedRows.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Product not found' });
    }
    if (ownedRows[0].user_id !== req.user.id) {
      connection.release();
      return res.status(403).json({ error: 'Forbidden' });
    }

    const [extraImages] = await connection.query('SELECT image_url FROM product_images WHERE product_id = ?', [req.params.id]);

    const allImageUrls = [
      ownedRows[0].image_url,
      ...extraImages.map(img => img.image_url)
    ].filter(Boolean);

    for (const imgUrl of allImageUrls) {
      if (imgUrl.includes('cloudinary.com')) {
        await deleteFromCloudinary(imgUrl);
      } else {
        const filePath = path.join(uploadDir, path.basename(imgUrl));
        if (fs.existsSync(filePath)) {
          try { fs.unlinkSync(filePath); } catch (e) {}
        }
      }
    }

    await connection.query('DELETE FROM products WHERE id=?', [req.params.id]);
    connection.release();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

router.post('/:id/mark-sold', authenticateToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [productRows] = await connection.query('SELECT user_id, sold FROM products WHERE id = ? FOR UPDATE', [req.params.id]);
    if (productRows.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const product = productRows[0];
    if (product.user_id !== req.user.id) {
      connection.release();
      return res.status(403).json({ error: 'Unauthorized - You are not the seller' });
    }

    if (product.sold) {
      connection.release();
      return res.status(400).json({ error: 'Product already marked as sold' });
    }

    await connection.query('UPDATE products SET sold = 1, sold_at = NOW() WHERE id = ?', [req.params.id]);
    await connection.query('UPDATE users SET coins = IFNULL(coins, 0) + 10 WHERE id = ?', [req.user.id]);
    
    const [userRows] = await connection.query('SELECT coins FROM users WHERE id = ?', [req.user.id]);
    await connection.commit();
    connection.release();

    console.log('[SECURITY AUDIT] User sold product and earned coins', { userId: req.user.id, productId: req.params.id });

    res.json({ 
      message: 'Product marked as sold successfully',
      coins_earned: 10,
      total_coins: userRows[0].coins
    });
  } catch (error) {
    await connection.rollback();
    connection.release();
    res.status(500).json({ error: 'Operation failed' });
  }
});

router.post('/:id/reviews', authenticateToken, reviewLimiter, async (req, res) => {
  const rating = Number(req.body.rating);
  const comment = (req.body.comment || '').trim();

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [products] = await connection.query('SELECT id FROM products WHERE id = ? FOR UPDATE', [req.params.id]);
    if (products.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Product not found' });
    }

    await connection.query(
      'INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
      [req.params.id, req.user.id, rating, comment]
    );

    await connection.commit();

    const [rows] = await connection.query(
      `SELECT r.id, r.rating, r.comment, r.created_at AS createdAt, u.name AS reviewer_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.product_id = ?
       ORDER BY r.created_at DESC`,
      [req.params.id]
    );

    connection.release();
    res.status(201).json(rows);
  } catch (error) {
    await connection.rollback();
    connection.release();
    res.status(500).json({ error: 'Failed to add review' });
  }
});

router.post('/:id/offers', authenticateToken, async (req, res) => {
  const amount = Number(req.body.amount);
  const buyerMessage = (req.body.message || '').trim();

  if (Number.isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: 'Invalid offer price amount' });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [products] = await connection.query('SELECT id, user_id FROM products WHERE id = ? FOR UPDATE', [req.params.id]);
    if (products.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Product not found' });
    }

    const sellerId = products[0].user_id;
    if (sellerId === req.user.id) {
      connection.release();
      return res.status(400).json({ error: 'Cannot make an offer on your own product' });
    }

    const [existing] = await connection.query(
      'SELECT id FROM offers WHERE product_id = ? AND buyer_id = ? AND status = "pending"',
      [req.params.id, req.user.id]
    );
    if (existing.length > 0) {
      connection.release();
      return res.status(400).json({ error: 'You already have a pending offer on this product' });
    }

    const [result] = await connection.query(
      'INSERT INTO offers (product_id, buyer_id, seller_id, amount, buyer_message) VALUES (?, ?, ?, ?, ?)',
      [req.params.id, req.user.id, sellerId, amount, buyerMessage]
    );

    await connection.commit();
    const [rows] = await connection.query('SELECT * FROM offers WHERE id = ?', [result.insertId]);
    connection.release();
    res.status(201).json(rows[0]);
  } catch (error) {
    await connection.rollback();
    connection.release();
    res.status(500).json({ error: 'Failed to create offer' });
  }
});

router.get('/:id/reviews', async (req, res) => {
  try {
    const productId = req.params.id;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const offset = (page - 1) * limit;

    if (offset > 1000) {
      return res.status(400).json({ error: 'Pagination limit exceeded. Offset cannot exceed 1000.' });
    }

    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT r.id, r.rating, r.comment, r.created_at AS createdAt, u.name AS reviewer_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.product_id = ?
       ORDER BY r.created_at DESC
       LIMIT ? OFFSET ?`,
      [productId, limit, offset]
    );

    const [countResult] = await connection.query(
      'SELECT COUNT(*) as total FROM reviews WHERE product_id = ?',
      [productId]
    );
    const total = countResult[0]?.total || 0;
    connection.release();

    res.json({
      data: rows,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

router.get('/:id/offers', authenticateToken, async (req, res) => {
  try {
    const productId = req.params.id;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const offset = (page - 1) * limit;

    if (offset > 1000) {
      return res.status(400).json({ error: 'Pagination limit exceeded. Offset cannot exceed 1000.' });
    }

    const connection = await pool.getConnection();

    const [products] = await connection.query('SELECT user_id FROM products WHERE id = ?', [productId]);
    if (products.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Product not found' });
    }

    const sellerId = products[0].user_id;
    let whereClause = 'product_id = ?';
    let queryParams = [productId];

    if (sellerId !== req.user.id) {

      whereClause += ' AND buyer_id = ?';
      queryParams.push(req.user.id);
    }

    const [rows] = await connection.query(
      `SELECT o.id, o.product_id, o.buyer_id, o.seller_id, o.amount, o.status, 
              o.buyer_message, o.seller_message, o.created_at AS createdAt, o.updated_at AS updatedAt,
              b.name AS buyer_name, s.name AS seller_name
       FROM offers o
       JOIN users b ON o.buyer_id = b.id
       JOIN users s ON o.seller_id = s.id
       WHERE ${whereClause}
       ORDER BY o.created_at DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    );

    const [countResult] = await connection.query(
      `SELECT COUNT(*) as total FROM offers WHERE ${whereClause}`,
      queryParams
    );
    const total = countResult[0]?.total || 0;
    connection.release();

    res.json({
      data: rows,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch offers' });
  }
});

export default router;
export { productSelect };
