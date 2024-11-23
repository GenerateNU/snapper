import mongoose from 'mongoose';

const SpeciesSchema = new mongoose.Schema({
  aphiaId: { type: String, required: true },
  articleUrl: { type: String },
  articleTitle: { type: String },
  commonNames: [String],
  scientificName: { type: String },
  introduction: { type: String },
  imageUrls: [String],
  genus: { type: mongoose.Schema.Types.ObjectId, ref: 'Taxon', required: true },
  family: { type: mongoose.Schema.Types.ObjectId, ref: 'Taxon', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Taxon', required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Taxon', required: true },
  phylum: { type: mongoose.Schema.Types.ObjectId, ref: 'Taxon', required: true },
  kingdom: { type: mongoose.Schema.Types.ObjectId, ref: 'Taxon', required: true },
  domain: { type: mongoose.Schema.Types.ObjectId, ref: 'Taxon', required: true },
});

SpeciesSchema.index({commonNames: "text"})

export const Species = mongoose.model('Species', SpeciesSchema);
