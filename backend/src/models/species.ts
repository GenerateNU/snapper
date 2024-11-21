import mongoose from 'mongoose';

const SpeciesSchema = new mongoose.Schema({
  aphiaId: { type: String, required: true },
  articleUrl: { type: String },
  articleTitle: { type: String },
  commonNames: [String],
  scientificName: { type: String },
  introduction: { type: String },
  imageUrls: [String],
});

SpeciesSchema.index({ commonNames: 'text', scientificName: 'text' });

export const Species = mongoose.model('Species', SpeciesSchema);
