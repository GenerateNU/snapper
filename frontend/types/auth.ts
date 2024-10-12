export type RegisterRequestBody = {
  name: string;
  email: string;
  password: string;
};

export type LoginRequestBody = {
  email: string;
  password: string;
};
