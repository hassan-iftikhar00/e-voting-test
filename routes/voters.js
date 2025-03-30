import express from 'express';
import Voter from '../models/Voter.js';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const voters = await Voter.find();
    res.json(voters);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const newVoter = new Voter(req.body);
    await newVoter.save();
    res.status(201).json(newVoter);
  } catch (error) {
    res.status(400).json({ message: 'Invalid voter data' });
  }
});

router.get('/:voterId', authenticateToken, async (req, res) => {
  try {
    const voter = await Voter.findOne({ voterId: req.params.voterId });
    if (!voter) {
      return res.status(404).json({ message: 'Voter not found' });
    }
    res.json(voter);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;