import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatarCharacter: {
    type: String,
    default: 'default',
  },
  progress: {
    type: Map,
    of: Number,
    default: new Map(),
  },
  apiKey: String,
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const User = mongoose.model('User', userSchema);

export default User; 