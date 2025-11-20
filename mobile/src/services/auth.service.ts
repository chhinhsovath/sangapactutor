import api from './api';
import { storage } from '../utils/storage';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../types';

export const authService = {
    // Login
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/login', credentials);
        const { accessToken, refreshToken, user } = response.data;

        // Store tokens
        await storage.setToken(accessToken);
        await storage.setRefreshToken(refreshToken);

        return response.data;
    },

    // Register
    async register(data: RegisterRequest): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/register', data);
        const { accessToken, refreshToken, user } = response.data;

        // Store tokens
        await storage.setToken(accessToken);
        await storage.setRefreshToken(refreshToken);

        return response.data;
    },

    // Get current user
    async getCurrentUser(): Promise<User> {
        const response = await api.get<User>('/auth/me');
        return response.data;
    },

    // Logout
    async logout(): Promise<void> {
        await storage.removeTokens();
    },

    // Check if user is authenticated
    async isAuthenticated(): Promise<boolean> {
        const token = await storage.getToken();
        return !!token;
    },
};
