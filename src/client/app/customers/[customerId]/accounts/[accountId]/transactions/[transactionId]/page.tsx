// app/customers/page.tsx

"use client";

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { transactions, transaction_type } from '@prisma/client';

export default function TransactionDetailsPage() {
    const [transaction, setTransaction] = useState<transactions>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const params = useParams();
    const customerId = params.customerId;
    const accountId = params.accountId;
    const transactionId = params.transactionId;
    const router = useRouter();

    useEffect(() => {
        if (!customerId || !accountId || !transactionId) {
            setError('Customer ID or Account ID is missing.');
            setLoading(false);
            return;
        }

        const fetchTransactionDetails = async () => {
            try {
                const response = await api.get(`/customers/${customerId}/accounts/${accountId}/transactions/${transactionId}`);
                const fetchedTransaction: transactions = response.data.data;
                setTransaction(fetchedTransaction);
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    const errorMessage = err.response?.data?.meta?.message || err.message || 'Failed to fetch account';
                    setError(errorMessage);
                } else {
                    setError('An unexpected error occurred');
                }
            } finally {
                setLoading(false);
            }

        };
        fetchTransactionDetails();
    }, [customerId, accountId, transactionId, router]);

    if (loading) return <p>Loading transaction...</p>;
    if (error) return <p className="text-red-600">{error}</p>;
    if (!transaction) return <p>Transaction not found.</p>;

    return (
        <div className="container mx-auto px-4 py-6">
            <p className="text-lg">
                <strong>Created At:</strong> {transaction.timestamp ? new Date(transaction.timestamp).toLocaleString() : 'N/A'}
            </p>
            <p className="text-lg">
                <strong>Transaction Type:</strong> {transaction.type as transaction_type}
            </p>
            <p className="text-lg">
                <strong>Transaction Balance:</strong> {"$" + transaction.amount}
            </p>
            <button
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                onClick={() => router.push(`/customers/${customerId}/accounts/${accountId}`)}
            >
                Back to Account
            </button>
        </div>
    );
}
