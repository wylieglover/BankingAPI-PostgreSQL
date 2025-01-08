"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../../lib/api';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { customers } from '@prisma/client';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from '@/context/auth';

interface PaginationMeta {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

interface CustomerResponse {
    data: {
        data: customers[];
        meta: PaginationMeta;
    };
}

export default function CustomersPage() {
    const [customers, setCustomers] = useState<customers[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0
    });

    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await api.get<CustomerResponse>('/customers', {
                    params: {
                        page: paginationMeta.page,
                        pageSize: paginationMeta.pageSize
                    }
                });

                setCustomers(response.data.data.data);
                setPaginationMeta(response.data.data.meta);
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch customers';
                    setError(errorMessage);
                } else {
                    setError('An unexpected error occurred');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, [paginationMeta.page, paginationMeta.pageSize]);

    const handlePageChange = (newPage: number) => {
        setPaginationMeta(prev => ({
            ...prev,
            page: newPage
        }));
        setLoading(true);
    };

    if (loading) return <p>Loading customers...</p>;
    if (error) return <p className="text-red-600">{error}</p>;
    if (!customers.length) return <p>No customers found. Add a new customer to get started.</p>;

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-6">
                {user ? (
                    <h1 className="text-3xl font-bold">Welcome, {user.username.toLowerCase()}!</h1>
                ) : (
                    <h1 className="text-3xl font-bold">Guest</h1>
                )}
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    onClick={() => router.push('/')}
                >
                    Back to Dashboard
                </button>
            </div>

            <Card className="mb-6">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Customers</CardTitle>
                    <div className="text-sm text-gray-500">
                        Total Customers: {paginationMeta.total}
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="grid gap-4">
                        {customers.map((customer) => (
                            <Link
                                key={customer.customer_id}
                                href={`/customers/${customer.customer_id}`}
                                className="block p-4 rounded-lg border hover:bg-gray-50 transition"
                            >
                                <div className="space-y-2">
                                    <p><span className="font-medium">Email:</span> {customer.email}</p>
                                    <p><span className="font-medium">Home Address:</span> {customer.home_address}</p>
                                    <p><span className="font-medium">Username:</span> {customer.username}</p>
                                    <p><span className="font-medium">Created At:</span> {new Date(customer.created_at).toLocaleString()}</p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    <div className="mt-6 flex flex-col items-center gap-4">
                        <div className="flex gap-2">
                            <button
                                onClick={() => handlePageChange(paginationMeta.page - 1)}
                                disabled={paginationMeta.page === 1}
                                className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Previous
                            </button>

                            <div className="flex gap-1">
                                {Array.from(
                                    { length: paginationMeta.totalPages },
                                    (_, i) => i + 1
                                ).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-3 py-1 rounded border ${paginationMeta.page === page
                                            ? 'bg-blue-600 text-white'
                                            : 'hover:bg-gray-50'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => handlePageChange(paginationMeta.page + 1)}
                                disabled={paginationMeta.page === paginationMeta.totalPages}
                                className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </div>

                        <div className="text-sm text-gray-600">
                            Showing page {paginationMeta.page} of {paginationMeta.totalPages}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}