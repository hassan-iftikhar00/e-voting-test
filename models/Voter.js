import mongoose from 'mongoose';

const voterSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  voterId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  hasVoted: { type: Boolean, default: false },
  votedAt: { type: Date },
});

const Voter = mongoose.model('Voter', voterSchema);

export default Voter;