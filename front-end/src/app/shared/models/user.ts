export interface User {
  email: string;
  firstName: string;
  lastName: string;
}

export interface LoginResponse {
  info: User;
  token: string;
}

export enum Roles {
  admin = 'Admin',
  client = 'Client'
}
