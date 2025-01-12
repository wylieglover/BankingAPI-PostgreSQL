'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api'; // Update with the correct path to your API client

interface CounterProps {
    target: string
}

interface ApiResponse {
    data: {
        count: number;
        meta: {
            code: number
            message: string
            status: string
        }
    }
}


const Counter: React.FC<CounterProps> = ({ target }) => {
    const [count, setCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    throw new Error('Authentication token not found.');
                }
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                const response = await api.get<ApiResponse>(target);
                console.log(response.data);
                setCount(response.data.data.count);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('An unexpected error occurred.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [target]);

    if (isLoading) {
        return <span>Loading...</span>;
    }

    if (error) {
        return <span>Error: {error}</span>;
    }

    return <span>{count}</span>;
};

export default Counter;