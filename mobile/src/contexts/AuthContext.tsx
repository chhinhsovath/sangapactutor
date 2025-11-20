import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authService } from '../services/auth.service';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Check authentication status on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            setError(null);
            const authenticated = await authService.isAuthenticated();
            if (authenticated) {
                const currentUser = await authService.getCurrentUser();
                setUser(currentUser);
                setIsAuthenticated(true);
            }
        } catch (error: any) {
            console.error('Auth check failed:', error);
            setIsAuthenticated(false);
            // Don't set global error for auth check failure as it just means not logged in
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            setError(null);
            setIsLoading(true);
            const response = await authService.login({ email, password });
            setUser(response.user);
            setIsAuthenticated(true);
        } catch (error: any) {
            setError(error.response?.data?.message || 'Login failed');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: any) => {
        try {
            setError(null);
            setIsLoading(true);
            const response = await authService.register(data);
            setUser(response.user);
            setIsAuthenticated(true);
        } catch (error: any) {
            setError(error.response?.data?.message || 'Registration failed');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            setError(null);
            await authService.logout();
            setUser(null);
            setIsAuthenticated(false);
        } catch (error: any) {
            console.error('Logout failed:', error);
            setError(error.message || 'Logout failed');
        }
    };

    const refreshUser = async () => {
        try {
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
        } catch (error) {
            console.error('Failed to refresh user:', error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated,
                error,
                login,
                register,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
