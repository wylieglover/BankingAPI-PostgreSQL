'use client'

import React from 'react';
import Link from 'next/link';
import {
    Home,
    Users,
    CreditCard,
    BarChart3,
    Settings,
    HelpCircle,
    X,
} from 'lucide-react';
import { useAuth } from '@/context/auth';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const { user } = useAuth();
    const navItems = [
        { icon: Home, label: "Dashboard", href: "/" },
        { icon: Users, label: "Customers", href: "/customers" },
        { icon: CreditCard, label: "Accounts", href: `/customers/${user?.customer_id}/accounts` },
        { icon: BarChart3, label: "Analytics", href: "/analytics" },
        { icon: Settings, label: "Settings", href: "/settings" },
        { icon: HelpCircle, label: "Help", href: "/help" },
    ];

    return (
        <aside className={`fixed top-0 left-0 z-40 h-screen transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
            } bg-white border-r w-64`}>
            <div className="flex items-center justify-between p-4 border-b">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                        <span className="text-white font-bold">B</span>
                    </div>
                    <span className="text-xl font-bold">ABC Banking</span>
                </Link>
                <button
                    onClick={onClose}
                    className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            <nav className="p-4 space-y-1">
                {navItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>
        </aside>
    );
}