import COLLEGES from '../data/colleges.js';

export const validateCollege = (college) => {
  if (typeof college !== 'string') return false;
  const target = college.trim().toLowerCase();
  return COLLEGES.some(c => 
    c.name.toLowerCase() === target || 
    c.short.toLowerCase() === target
  );
};

export const validateRegistrationInput = (req, res, next) => {
  const { email, password, name, college } = req.body;

  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ error: 'Invalid email address format' });
  }

  if (typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long' });
  }

  if (typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Name is required' });
  }

  if (!validateCollege(college)) {
    return res.status(400).json({ error: 'Invalid college. Please select a college from the whitelisted list.' });
  }

  next();
};

export const validateProductInput = (req, res, next) => {
  const { title, price, condition, category, location } = req.body;

  if (typeof title !== 'string' || !title.trim() || title.length > 200) {
    return res.status(400).json({ error: 'Title is required and must be under 200 characters' });
  }

  const numericPrice = Number(price);
  if (Number.isNaN(numericPrice) || numericPrice < 0) {
    return res.status(400).json({ error: 'Price must be a valid positive number' });
  }

  const validConditions = ['New', 'Like New', 'Good', 'Fair'];
  if (typeof condition !== 'string' || !validConditions.includes(condition.trim())) {
    return res.status(400).json({ error: 'Condition must be one of: New, Like New, Good, Fair' });
  }

  if (typeof category !== 'string' || !category.trim()) {
    return res.status(400).json({ error: 'Category is required' });
  }

  if (typeof location !== 'string' || !location.trim() || location.length > 200) {
    return res.status(400).json({ error: 'Location is required and must be under 200 characters' });
  }

  next();
};
