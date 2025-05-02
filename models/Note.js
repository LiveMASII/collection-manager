import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  cardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Card',
    required: [true, 'Card ID is required']
  },
  content: {
    type: String,
    required: [true, 'Please provide note content'],
    trim: true,
    maxlength: [200, 'Note cannot be more than 200 characters']
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

export default mongoose.models.Note || mongoose.model('Note', NoteSchema);