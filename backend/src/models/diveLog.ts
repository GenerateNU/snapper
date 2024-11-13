import mongoose from 'mongoose';

const DiveLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  speciesTags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Species' }],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  date: { type: Date, required: false },
  time: { type: String },
  duration: { type: Number },
  depth: { type: Number },
  photos: [{ type: String }], // aws s3 urls
  description: { type: String },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

DiveLogSchema.index({ location: '2dsphere' });

export const DiveLog = mongoose.model('DiveLog', DiveLogSchema);
