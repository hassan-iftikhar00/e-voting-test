import express from 'express';
import Candidate from '../models/Candidate.js';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const newCandidate = new Candidate(req.body);
    await newCandidate.save();
    res.status(201).json(newCandidate);
  } catch (error) {
    res.status(400).json({ message: 'Invalid candidate data' });
  }
});

router.put('/:id/vote', authenticateToken, async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    candidate.votes += 1;
    await candidate.save();
    res.json(candidate);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;