import { User } from './user.model';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    user: User;
    token?: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    currentUser: User | null;
    error: string | null;
}
