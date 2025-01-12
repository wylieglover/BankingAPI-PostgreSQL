// app/accounts/page.tsx

"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { useRouter, useParams } from 'next/navigation';
import { account_type, accounts } from '@prisma/client';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import axios from 'axios';

export default function AccountsPage() {
    const [accounts, setAccounts] = useState<accounts[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const params = useParams();
    const customerId = params.customerId;

    useEffect(() => {
        if (!customerId) {
            setError('Customer ID is missing.');
            setLoading(false);
            return;
        }

        const fetchAccounts = async () => {
            try {
                const response = await api.get(`/customers/${customerId}/accounts`);
                const fetchedAccounts: accounts[] = response.data.data;
                setAccounts(fetchedAccounts);
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    const errorMessage = err.response?.data?.meta?.message || err.message || 'Failed to fetch customers';
                    setError(errorMessage);
                } else {
                    setError('An unexpected error occurred');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAccounts();
    }, [router, customerId]);

    if (loading) return <p>Loading accounts...</p>;
    if (error) return <p className="text-red-600">{error}</p>;
    if (!accounts) return <div className="p-6">Customer not found.</div>;

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>Accounts</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    {accounts.length === 0 ? (
                        <p className="text-gray-500">No accounts found.</p>
                    ) : (
                        <div className="grid gap-4">
                            {accounts.map((account) => (
                                <li key={account.account_id}>
                                    <Link
                                        href={`/customers/${customerId}/accounts/${account.account_id}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        {account.type as account_type} ({account.balance.toString()})
                                    </Link>
                                </li>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
