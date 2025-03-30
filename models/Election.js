import mongoose from 'mongoose';

const electionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: false },
});

const Election = mongoose.model('Election', electionSchema);

export default Election;