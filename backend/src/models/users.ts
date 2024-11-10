import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  supabaseId: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  badges: {
    type: [String],
    enum: ['Deep Diver', 'First Catcher', 'Ocean Explorer'],
  }, // badge is an array of enum
  diveLogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DiveLog' }],
  speciesCollected: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Species' }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  profilePicture: { type: String }, // aws s3 url
});

export const UserModel = mongoose.model('User', UserSchema);
