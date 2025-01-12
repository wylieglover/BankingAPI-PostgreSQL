'use client'

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { isTokenExpired } from '@/context/authUtils';

import { customers } from '@prisma/client'

interface AuthContextType {
    user: customers | null;
    login: (token: string, customer: customers) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<customers | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const clearAuth = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('customer');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
    };

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                if (typeof window === 'undefined') return;
                const token = localStorage.getItem('authToken');
                const storedCustomer = localStorage.getItem('customer');

                if (token && storedCustomer) {
                    if (!isTokenExpired(token)) {
                        const parsedCustomer: customers = JSON.parse(storedCustomer);
                        setUser(parsedCustomer);
                        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    } else {
                        clearAuth();
                        router.push('/login');
                    }
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                clearAuth();
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, [router]);

    const login = (token: string, customer: customers) => {
        try {
            // Store token and user data
            localStorage.setItem('authToken', token);
            localStorage.setItem('customer', JSON.stringify(customer));

            // Set up API headers
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            setUser(customer);
        } catch (error) {
            console.error('Login error:', error);
            logout();
        }
    };

    const logout = (redirectCallback = () => router.push('/login')) => {
        clearAuth();
        setIsLoading(false);
        redirectCallback();
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

