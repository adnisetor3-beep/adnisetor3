export enum UserRole {
  ADMIN = 'ADMIN',
  COMMON = 'COMMON',
  VIEWER = 'VIEWER',
}

export enum EventStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // In a real app, this would be hashed
  role: UserRole;
  active: boolean;
}

export interface EventRequest {
  id: string;
  title: string;
  description: string;
  date: string; // ISO string YYYY-MM-DD
  time: string; // HH:MM format (24-hour)
  status: EventStatus;
  requesterId: string;
  requesterName: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}