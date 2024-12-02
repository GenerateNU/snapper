import { Photo } from "./divelog";

export type UpdateUser = {
  profilePicture: Photo; //String to the s3
  firstName: string;
  lastName: string;
  username: string;
  email: string;
};
