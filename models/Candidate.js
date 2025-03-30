import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  imageUrl: { type: String, required: true },
  votes: { type: Number, default: 0 },
});

const Candidate = mongoose.model('Candidate', candidateSchema);

export default Candidate;