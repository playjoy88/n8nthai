'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    username: string;
    email: string;
    plan: string;
    isActive: boolean;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (userData: RegisterData) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

interface RegisterData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    plan: string;
    terms: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Check if user is logged in on initial load
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
            }
            
            // Save to state
            setUser(data.user);
            setToken(data.token);
            
            // Save to localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Redirect to dashboard
            router.push('/dashboard');
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
            }
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData: RegisterData) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'เกิดข้อผิดพลาดในการลงทะเบียน');
            }
            
            // Save to state
            setUser(data.user);
            setToken(data.token);
            
            // Save to localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Redirect to dashboard
            router.push('/dashboard');
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('เกิดข้อผิดพลาดในการลงทะเบียน');
            }
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        // Clear state
        setUser(null);
        setToken(null);
        
        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirect to login
        router.push('/login');
    };

    const contextValue: AuthContextType = {
        user,
        loading,
        error,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={contextValue}>
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
