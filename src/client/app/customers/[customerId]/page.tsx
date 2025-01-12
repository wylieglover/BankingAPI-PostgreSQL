// app/customers/page.tsx

"use client";

import React, { useEffect, useState } from 'react';
import api from '../../../lib/api';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { customers, accounts, beneficiaries } from '@prisma/client';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from 'next/link';

type CustomerWithRelations = customers & {
    accounts: accounts[];
    beneficiaries: beneficiaries[];
};


export default function CustomerDetailsPage() {
    const [customer, setCustomer] = useState<CustomerWithRelations>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const params = useParams();
    const customerId = params.customerId;
    const router = useRouter();

    useEffect(() => {
        if (!customerId) {
            setError('Customer ID is missing.');
            setLoading(false);
            return;
        }

        const fetchCustomerDetails = async () => {
            try {
                const response = await api.get(`/customers/${customerId}`);
                const fetchedCustomer: CustomerWithRelations = response.data.data;
                setCustomer(fetchedCustomer);
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
        fetchCustomerDetails();
    }, [customerId, router]);

    if (loading) return <div className="flex justify-center p-6">Loading customer details...</div>;
    if (error) return <div className="text-red-600 p-6">{error}</div>;
    if (!customer) return <div className="p-6">Customer not found.</div>;

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">{customer.name}</h1>
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    onClick={() => router.push('/customers')}
                >
                    Back to Customers
                </button>
            </div>

            {/* Customer Information */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <p><span className="font-medium">Email:</span> {customer.email}</p>
                    <p><span className="font-medium">Home Address:</span> {customer.home_address}</p>
                    <p><span className="font-medium">Username:</span> {customer.username}</p>
                    <p><span className="font-medium">Created At:</span> {new Date(customer.created_at).toLocaleString()}</p>
                </CardContent>
            </Card>

            {/* Accounts */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Accounts</CardTitle>
                </CardHeader>
                <CardContent>
                    {customer.accounts.length === 0 ? (
                        <p className="text-gray-500">No accounts found.</p>
                    ) : (
                        <div className="grid gap-4">
                            {customer.accounts.map((account) => (
                                <Link
                                    key={account.account_id}
                                    href={`/customers/${customerId}/accounts/${account.account_id}`}
                                    className="block p-4 rounded-lg border hover:bg-gray-50 transition"
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">{account.type}</p>
                                            <p className="text-sm text-gray-500">Account ID: {account.account_id}</p>
                                        </div>
                                        <p className="text-lg font-semibold">
                                            ${Number(account.balance).toLocaleString('en-US', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            })}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Beneficiaries */}
            <Card>
                <CardHeader>
                    <CardTitle>Beneficiaries</CardTitle>
                </CardHeader>
                <CardContent>
                    {customer.beneficiaries.length === 0 ? (
                        <p className="text-gray-500">No beneficiaries found.</p>
                    ) : (
                        <div className="grid gap-4">
                            {customer.beneficiaries.map((beneficiary) => (
                                <div
                                    key={beneficiary.beneficiary_id}
                                    className="p-4 rounded-lg border"
                                >
                                    <p className="font-medium">{beneficiary.name}</p>
                                    <p className="text-sm text-gray-500">{beneficiary.bank_details}</p>
                                    <p className="text-sm text-gray-500">Account Number: {beneficiary.account_number}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
