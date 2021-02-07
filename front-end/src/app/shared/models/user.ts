export interface User {
  email: string;
  firstName: string;
  lastName: string;
  role: Roles;
}

export interface LoginResponse {
  info: User;
  token: string;
}

export enum Roles {
  admin = 'Admin',
  client = 'Client'
}
