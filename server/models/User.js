import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  verifyOtp: { type: String, default: '' },
  resetOtp: { type: String, default: '' },
  verifyOtpExpiryAt: { type: Number, default: 0 },
  resetOtpExpiryAt: { type: Number, default: 0 },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;