import mongoose from 'mongoose';

const WishlistSchema = new mongoose.Schema({
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
    enum: ['Mint', 'Near Mint', 'Excellent', 'Good', 'Fair', 'Poor', 'Any']
  },
  maxPrice: {
    type: Number,
    required: [true, 'Please provide a max price']
  },
  type: {
    type: String,
    required: [true, 'Please specify the type of card'],
    enum: ['Pokemon', 'Yu-Gi-Oh', 'Magic: The Gathering', 'Comic Book', 'Other']
  },
  priority: {
    type: Number,
    default: 3,
    min: 1,
    max: 5
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

export default mongoose.models.Wishlist || mongoose.model('Wishlist', WishlistSchema);