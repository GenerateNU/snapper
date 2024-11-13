
export type Location = {
    type: string;
    coordinates: number[];
  };
  
export type FormFields = {
    tags: string[];
    image: string;
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