import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  supabaseId: { type: String, required: true, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  badges: {
    type: [String],
    enum: [
      'Deep Diver',
      'First Catch',
      'Ocean Explorer',
      '100 Dives Logged',
      'Reef Guardian',
      'Rare Fish Find',
    ],
  }, // badge is an array of enum
  diveLogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DiveLog' }],
  speciesCollected: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Species' }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  profilePicture: { type: String }, // aws s3 url
  deviceTokens: [{ type: String }],
});

export const UserModel = mongoose.model('User', UserSchema);
