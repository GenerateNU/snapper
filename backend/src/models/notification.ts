import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ['LIKE', 'POST', 'FOLLOW'] },
  time: { type: Date, default: Date.now, required: true },
  isRead: { type: Boolean, default: false },
  message: { type: String, required: true },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  target: { type: mongoose.Schema.Types.ObjectId, refPath: 'targetModel' },
  targetModel: { type: String, enum: ['DiveLog', 'User'] },
});

export const Notification = mongoose.model('Notification', NotificationSchema);
