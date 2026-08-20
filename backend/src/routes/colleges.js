import express from 'express';
import COLLEGES from '../data/colleges.js';

const router = express.Router();

router.get('/suggest', (req, res) => {
  try {
    const q = req.query.q || '';
    const query = q.toLowerCase().trim();
    
    if (!query) {
      return res.json([]);
    }
    
    const filtered = COLLEGES.filter(college => {
      const name = college.name.toLowerCase();
      const short = college.short.toLowerCase();
      const state = college.state.toLowerCase();
      
      return name.includes(query) || short.includes(query) || state.includes(query);
    });
    
    res.json(filtered.slice(0, 10));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch college suggestions' });
  }
});

router.get('/find', (req, res) => {
  try {
    const name = req.query.name || '';
    const query = name.toLowerCase().trim();
    
    if (!query) {
      return res.status(400).json({ error: 'College name required' });
    }
    
    const exactMatch = COLLEGES.find(college => 
      college.short.toLowerCase() === query || college.name.toLowerCase() === query
    );
    
    if (exactMatch) {
      return res.json(exactMatch);
    }
    
    const partialMatch = COLLEGES.find(college => 
      college.name.toLowerCase().includes(query) || college.short.toLowerCase().includes(query)
    );
    
    if (partialMatch) {
      return res.json(partialMatch);
    }
    
    res.status(404).json({ error: 'College not found' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to find college' });
  }
});

export default router;
