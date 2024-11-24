import mongoose from 'mongoose';

const SpeciesSchema = new mongoose.Schema({
  aphiaId: { type: String, required: true },
  articleUrl: { type: String },
  articleTitle: { type: String },
  commonNames: [String],
  scientificName: { type: String },
  introduction: { type: String },
  imageUrls: [String],
  iconUrl: { type: String, required: true },
  species: { type: String, required: true },
  genus: { type: String },
  family: { type: String },
  order: { type: String },
  class: { type: String },
  phylum: { type: String },
  kingdom: { type: String },
  domain: { type: String },
});

export const Species = mongoose.model('Species', SpeciesSchema);
