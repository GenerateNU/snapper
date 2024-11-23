export type Location = {
  type: string;
  coordinates: number[];
};

export type TagData = {
  name: string;
  id: String;
};

export type FormFields = {
  tagData: TagData[];
  photos: string[];
  date: Date;
  location: Location;
  description: string;
  user: string;
  speciesTags: String[];
};

export interface PostDiveLogResponse {
  id: string;
  description: string;
  likes: number[];
  location: Location;
  photos: string[];
  speciesTag: string[];
  user: string;
}
export type Photo = {
  base64: string;
  name: string;
  fileType: string;
};