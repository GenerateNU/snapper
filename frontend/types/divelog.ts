
export type Location = {
    type: string;
    coordinates: number[];
  };

export type TagData = {
  name: string;
  id: String;
}
  
export type FormFields = {
    tags: TagData[];
    photos: string[];
    date: Date;
    location: Location;
    description: string;
    user: string;
};

export interface PostDiveLogResponse{
  id: string;
  description: string;
  likes:number[];
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
