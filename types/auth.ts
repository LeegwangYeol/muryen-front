export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  role: UserRole;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}
