import mongoose from 'mongoose';

const FishSchema = new mongoose.Schema({
  commonName: { type: String, required: true },
  wikipediaUrl: { type: String },
  rarity: { type: String, enum: ['RARE', 'UNCOMMON', 'LEGENDARY', 'COMMON'] },
  sightingsCount: { type: Number, default: 0 },
});

export const Fish = mongoose.model('Fish', FishSchema);
