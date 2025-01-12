// app/accounts/page.tsx

"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { useRouter, useParams } from 'next/navigation';
import { transaction_type, transactions } from '@prisma/client';
import axios from 'axios';

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<transactions[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const params = useParams();
    const customerId = params.customerId;
    const accountId = params.accountId;

    useEffect(() => {
        if (!customerId || !accountId) {
            setError('Customer ID or Account ID is missing.');
            setLoading(false);
            return;
        }

        const fetchTransactions = async () => {
            try {
                const response = await api.get(`/customers/${customerId}/accounts/${accountId}/transactions`);
                const fetchedTransactions: transactions[] = response.data.data;
                setTransactions(fetchedTransactions);
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

        fetchTransactions();
    }, [customerId, accountId, router]);

    if (loading) return <p>Loading transactions...</p>;
    if (error) return <p className="text-red-600">{error}</p>;
    if (!Array.isArray(transactions))
        return <p>No transactions found. Add a new transactions to your account to get started.</p>;

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-6">Transactions</h1>
            <ul className="space-y-4">
                {transactions.map((transaction) => (
                    <li key={transaction.account_id}>
                        <Link
                            href={`/customers/${customerId}/accounts/${transaction.account_id}/transactions`}
                            className="text-blue-600 hover:underline"
                        >
                            {transaction.type as transaction_type} ({transaction.amount.toString()})
                        </Link>
                    </li>
                ))}
            </ul>
            <button
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                onClick={() => router.push(`/customers/${customerId}/accounts`)}
            >
                Back to Account Details
            </button>
        </div >
    );
}
