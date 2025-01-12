// src/components/Dashboard.tsx
'use client';

import React from 'react';
import { useAuth } from '@/context/auth';
import { FeatureCard } from '@/components/layout/FeatureCard';
import { StatsCard } from '@/components/layout/StatsCard';
import {
    CreditCard,
    Users,
    BarChart3,
    Activity,
} from 'lucide-react';

const Dashboard: React.FC = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>Please log in to access your dashboard.</div>;
    }

    const customerId = user.customer_id;
    const user_name = user.name
    return (
        <>
            <div className="text-center mb-12 max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Welcome {user_name}, to Your Digital Banking Hub!
                </h1>
                <p className="text-xl text-gray-600">
                    Manage your finances with confidence using our secure and intuitive banking platform
                </p>
            </div>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <StatsCard
                    title="Total Customers"
                    value="5,284"
                    icon={Users}
                    trend="+12.5%"
                    trendUp={true}
                    target={`/customers/count`}
                />
                <StatsCard
                    title="Active Accounts"
                    value="3,872"
                    icon={CreditCard}
                    trend="+8.2%"
                    trendUp={true}
                    target={`/customers/${customerId}/accounts/count`}
                />
                <StatsCard
                    title="Daily Transactions"
                    value="$142,384"
                    icon={Activity}
                    trend="+15.3%"
                    trendUp={true}
                    target={`/customers/${customerId}/accounts/:accountId/transactions/count`}
                />
            </div>

            {/* Main Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <FeatureCard
                    href={`/customers/${customerId}`}
                    title="Profile Management"
                    description="View and manage your profile, history, and preferences all in one place."
                    icon={Users}
                />
                <FeatureCard
                    href={`/customers/${customerId}/accounts`}
                    title="Account Overview"
                    description="Monitor account balances, transactions, and manage account settings efficiently."
                    icon={CreditCard}
                />
                <FeatureCard
                    href={`/customers/${customerId}/transaction-analytics`}
                    title="Transaction Analytics"
                    description="Track and analyze transaction patterns with detailed insights and reports."
                    icon={BarChart3}
                />
            </div>
        </>
    );
};

export default Dashboard;
