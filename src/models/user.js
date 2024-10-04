import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true },
  referralCode: { type: String, unique: true },
  points: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
