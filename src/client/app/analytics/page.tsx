'use client'
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import api from '../../lib/api';

interface CustomerAnalytics {
    totalCount: number;
    newCustomersThisMonth: number;
    customersByMonth: Array<{ month: string; count: number }>;
}

interface ApiResponse {
    data: CustomerAnalytics;
    message: string;
    status: string;
}

export default function AnalyticsPage() {
    const [data, setData] = useState<CustomerAnalytics>({
        totalCount: 0,
        newCustomersThisMonth: 0,
        customersByMonth: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get<ApiResponse>('/customers/analytics');
                setData(response.data.data);
            } catch (err) {
                setError('Failed to fetch analytics data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <span className="text-lg text-gray-600">Loading analytics...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <span className="text-lg text-red-500">{error}</span>
            </div>
        );
    }

    const growthRate = ((data.newCustomersThisMonth / data.totalCount) * 100).toFixed(1);

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Customers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{data.totalCount.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">All time customers</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>New Customers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{data.newCustomersThisMonth.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">Last 30 days</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Growth Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{growthRate}%</p>
                        <p className="text-sm text-gray-500">Monthly growth</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-6">
                {/* Customer Growth Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Customer Growth by Month</CardTitle>
                    </CardHeader>
                    <CardContent className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.customersByMonth}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="month"
                                    tick={{ fontSize: 12 }}
                                    padding={{ left: 20, right: 20 }}
                                />
                                <YAxis
                                    tick={{ fontSize: 12 }}
                                    width={80}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #ccc'
                                    }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    name="New Customers"
                                    stroke="#2563eb"
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}