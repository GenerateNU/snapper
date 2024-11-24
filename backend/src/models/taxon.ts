import mongoose from 'mongoose';

const TaxonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rank: { type: String, required: true },
  iconUri: { type: String },
});

export const Taxons = mongoose.model('Taxon', TaxonSchema);
