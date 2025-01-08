// app/customers/page.tsx

"use client";

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { account_type, accounts, transaction_type, transactions } from '@prisma/client';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from '@/context/auth';
import Link from 'next/link';

type AccountWithRelations = accounts & {
    transactions: transactions[];
};

export default function AccountDetailsPage() {
    const [account, setAccount] = useState<AccountWithRelations>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const params = useParams();
    const customerId = params.customerId;
    const accountId = params.accountId;
    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {
        if (!customerId) {
            setError('Customer ID is missing.');
            setLoading(false);
            return;
        }
        if (!accountId) {
            setError('Account ID is missing.');
            setLoading(false);
            return;
        }

        const fetchAccountDetails = async () => {
            try {
                const response = await api.get(`/customers/${customerId}/accounts/${accountId}`);
                const fetchedAccount: AccountWithRelations = response.data.data;
                console.log(fetchedAccount)
                setAccount(fetchedAccount);
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
        fetchAccountDetails();
    }, [customerId, accountId, router]);

    if (loading) return <div className="flex justify-center p-6">Loading account details...</div>;
    if (error) return <div className="text-red-600 p-6">{error}</div>;
    if (!account) return <div className="p-6">Account not found.</div>;

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-6">
                {user ? (
                    <h1 className="text-3xl font-bold">{account.type.toUpperCase()}</h1>
                ) : (
                    <h1 className="text-3xl font-bold">Guest</h1>
                )}
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    onClick={() => router.push(`/customers/${account.customer_id}`)}
                >
                    Back to Customers
                </button>
            </div>
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Account</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Account Information */}
                    <div className="mb-6">
                        <p className="text-lg">
                            <strong>Created At:</strong>{" "}
                            {account.created_at ? new Date(account.created_at).toLocaleString() : "N/A"}
                        </p>
                        <p className="text-lg">
                            <strong>Account Type:</strong> {account.type as account_type}
                        </p>
                        <p className="text-lg">
                            <strong>Account Balance:</strong> {"$" + account.balance}
                        </p>
                    </div>

                    {/* Transactions */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold mb-4">Transactions</h2>
                        {account.transactions && account.transactions.length > 0 ? (
                            <div className="grid gap-4">
                                {account.transactions.map((transaction) => (
                                    <Link
                                        key={transaction.transaction_id}
                                        href={`/customers/${customerId}/accounts/${account.account_id}/transactions/${transaction.transaction_id}`}
                                        className="block p-4 rounded-lg border hover:bg-gray-50 transition"
                                    >
                                        <p>
                                            <span className="font-medium">Date:</span>{" "}
                                            {transaction.timestamp
                                                ? new Date(transaction.timestamp).toLocaleString()
                                                : "N/A"}
                                        </p>
                                        <p>
                                            <span className="font-medium">Amount:</span> $
                                            {Number(transaction.amount).toLocaleString("en-US", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </p>
                                        <p>
                                            <span className="font-medium">Type:</span> {transaction.type as transaction_type}
                                        </p>

                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No transactions found.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
