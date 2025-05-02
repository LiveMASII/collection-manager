import mongoose from 'mongoose';

const CardSchema = new mongoose.Schema({
  name: {
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
  price: {
    type: Number,
    required: [true, 'Please provide a price']
  },
  image: {
    type: String,
    default: '/images/default-card.jpg'
  },
  type: {
    type: String,
    required: [true, 'Please specify the type of card'],
    enum: ['Pokemon', 'Yu-Gi-Oh', 'Magic: The Gathering', 'Comic Book', 'Other']
  },
  rarity: {
    type: String,
    default: 'Common'
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

export default mongoose.models.Card || mongoose.model('Card', CardSchema);