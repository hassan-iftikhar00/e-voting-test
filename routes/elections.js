import express from 'express';
import Election from '../models/Election.js';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public route to get active election
router.get('/', async (req, res) => {
  try {
    const elections = await Election.find();
    res.json(elections);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const newElection = new Election(req.body);
    await newElection.save();
    res.status(201).json(newElection);
  } catch (error) {
    res.status(400).json({ message: 'Invalid election data' });
  }
});

router.put('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const election = await Election.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }
    res.json(election);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;