export type Role = 'USER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string | null;
  avatarUrl?: string | null;
  notificationsEnabled: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface UserProfile extends User {
  _count?: {
    organizedEvents?: number;
    participations?: number;
    reviews?: number;
  };
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
