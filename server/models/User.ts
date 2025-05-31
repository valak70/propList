
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
  recommendationsReceived: [
    {
      from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' }
    }
  ]
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
