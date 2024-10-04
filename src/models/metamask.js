import mongoose from 'mongoose';

const MetamaskAuthSchema = new mongoose.Schema({
  userAddress: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,  
  },
  nonce: {
    type: String,
    required: true,
    trim: true,
  },
  signature: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '15m',  
  },
});

export default mongoose.model('MetamaskAuth', MetamaskAuthSchema);
