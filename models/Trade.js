import mongoose from 'mongoose';

const TradeSchema = new mongoose.Schema({
  cardName: {
    type: String,
    required: [true, 'Please provide a card name'],
    trim: true
  },
  set: {
    type: String,
    required: [true, 'Please provide a set name'],
    trim: true
  },
  condition: {
    type: String,
    required: [true, 'Please provide a condition'],
    enum: ['Mint', 'Near Mint', 'Excellent', 'Good', 'Fair', 'Poor']
  },
  type: {
    type: String,
    required: [true, 'Please specify the type of card'],
    enum: ['Pokemon', 'Yu-Gi-Oh', 'Magic: The Gathering', 'Comic Book', 'Other']
  },
  lookingFor: {
    type: String,
    required: [true, 'Please specify what you are looking for']
  },
  user: {
    type: String,
    required: [true, 'Please provide a user']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Trade || mongoose.model('Trade', TradeSchema);