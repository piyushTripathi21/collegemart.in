import express from 'express';
import pool from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';
import { messageLimiter } from '../middleware/rate-limit.js';
import { emailTransporter } from './auth.js';

const router = express.Router();

const escapeHtml = (text) => {
  return (text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

router.get('/', authenticateToken, async (req, res) => {
  try {
    const { product_id } = req.query;
    if (!product_id) {
      return res.status(400).json({ error: 'product_id is required' });
    }

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 50));
    const offset = (page - 1) * limit;

    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT m.id, m.sender_id, m.receiver_id, m.product_id, m.message, m.is_read, m.created_at, 
              s.name AS sender_name, r.name AS receiver_name 
       FROM messages m
       JOIN users s ON m.sender_id = s.id
       JOIN users r ON m.receiver_id = r.id
       WHERE m.product_id = ?
         AND (m.sender_id = ? OR m.receiver_id = ?)
       ORDER BY m.created_at DESC
       LIMIT ? OFFSET ?`,
      [product_id, req.user.id, req.user.id, limit, offset]
    );

    const [countResult] = await connection.query(
      `SELECT COUNT(*) as total FROM messages 
       WHERE product_id = ? AND (sender_id = ? OR receiver_id = ?)`,
      [product_id, req.user.id, req.user.id]
    );
    const total = countResult[0]?.total || 0;

    connection.release();
    res.json({
      data: rows.reverse(),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

router.get('/conversations', authenticateToken, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;

    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT 
        sub.product_id,
        p.title AS product_title,
        sub.partner_id,
        u.name AS partner_name,
        u.email AS partner_email,
        m.message AS last_message,
        m.created_at AS last_message_at,
        IFNULL(uc.unread_count, 0) AS unread_count
      FROM (
        SELECT 
          m.product_id,
          IF(m.sender_id = ?, m.receiver_id, m.sender_id) AS partner_id,
          MAX(m.id) AS max_message_id
        FROM messages m
        WHERE m.sender_id = ? OR m.receiver_id = ?
        GROUP BY m.product_id, partner_id
      ) sub
      JOIN messages m ON m.id = sub.max_message_id
      LEFT JOIN products p ON sub.product_id = p.id
      LEFT JOIN users u ON sub.partner_id = u.id
      LEFT JOIN (
        SELECT 
          m.product_id,
          IF(m.sender_id = ?, m.receiver_id, m.sender_id) AS partner_id,
          COUNT(CASE WHEN m.receiver_id = ? AND m.is_read = 0 THEN 1 END) as unread_count
        FROM messages m
        WHERE m.sender_id = ? OR m.receiver_id = ?
        GROUP BY m.product_id, partner_id
      ) uc ON sub.product_id = uc.product_id AND sub.partner_id = uc.partner_id
      ORDER BY m.created_at DESC
      LIMIT ? OFFSET ?`,
      [
        req.user.id, req.user.id, req.user.id,
        req.user.id, req.user.id, req.user.id, req.user.id,
        limit, offset
      ]
    );

    connection.release();
    res.json(rows);
  } catch (error) {
    console.error('[CONVERSATIONS ERROR]', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

router.post('/', authenticateToken, messageLimiter, async (req, res) => {
  try {
    const productId = Number(req.body.product_id);
    const messageText = String(req.body.message || '').trim().slice(0, 2000);
    let receiverId = Number(req.body.receiver_id || 0);

    if (!productId || !messageText) {
      return res.status(400).json({ error: 'product_id and message are required' });
    }

    const connection = await pool.getConnection();
    const [products] = await connection.query('SELECT id, user_id, title FROM products WHERE id = ?', [productId]);
    if (products.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = products[0];
    if (!receiverId) {
      if (req.user.id === product.user_id) {
        connection.release();
        return res.status(400).json({ error: 'receiver_id is required for the owner' });
      }
      receiverId = product.user_id;
    }

    const [receivers] = await connection.query('SELECT id, name, email FROM users WHERE id = ?', [receiverId]);
    if (receivers.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Receiver not found' });
    }

    if (receiverId === req.user.id) {
      connection.release();
      return res.status(400).json({ error: 'Cannot send message to yourself' });
    }

    await connection.query(
      'INSERT INTO messages (sender_id, receiver_id, product_id, message) VALUES (?, ?, ?, ?)',
      [req.user.id, receiverId, productId, messageText]
    );

    const [rows] = await connection.query(
      `SELECT m.id, m.sender_id, m.receiver_id, m.product_id, m.message, m.is_read, m.created_at,
              s.name AS sender_name, r.name AS receiver_name
       FROM messages m
       JOIN users s ON m.sender_id = s.id
       JOIN users r ON m.receiver_id = r.id
       WHERE m.id = LAST_INSERT_ID()`
    );
    const message = rows[0];
    connection.release();

    const io = req.app.get('socketio');
    if (io) {
      try {
        io.to(`product_${message.product_id}`).emit('new_message', message);
        io.to(`user_${message.receiver_id}`).emit('new_message', message);
        io.to(`user_${message.sender_id}`).emit('new_message', message);
      } catch (socketErr) {
        console.error('[SOCKET ERROR] Failed to emit message notification', socketErr);
      }
    }

    if (receivers[0]) {
      const receiver = receivers[0];
      const senderName = message.sender_name || 'A user';
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const chatUrl = `${frontendUrl}/product/${productId}`;
      
      emailTransporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@collegemart.in',
        to: receiver.email,
        subject: `New Message from ${senderName} — CollegeMart`,
        html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2>New Chat Message</h2>
          <p>You received a new message from <strong>${escapeHtml(senderName)}</strong> regarding product <strong>"${escapeHtml(product.title)}"</strong>:</p>
          <div style="background-color: #f8fafc; border-left: 4px solid #0ea5e9; padding: 15px; margin: 20px 0; border-radius: 0 4px 4px 0; font-style: italic;">
            "${escapeHtml(messageText)}"
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${chatUrl}" style="background-color: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">View Message & Reply</a>
          </div>
        </div>`
      }).catch(mailErr => {
        console.error('[EMAIL NOTIFICATION ERROR] Failed to send message alert', mailErr);
      });
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;
