export type SpeciesContent = {
  aphiaId: { type: String},
  articleUrl: { type: String },
  articleTitle: { type: String },
  commonNames: string[],
  scientificName: { type: String },
  introduction: { type: String },
  imageUrls: [String],
  visibility: boolean,
};
