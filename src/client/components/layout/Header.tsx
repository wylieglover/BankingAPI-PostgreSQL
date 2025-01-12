'use client'

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/auth';
import {
    Bell,
    LogOut,
    Menu,
    ChevronDown,
    LogIn,
    User
} from 'lucide-react';
import { useClickOutside } from '@/hooks/useClickOutside';

interface HeaderProps {
    onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { user, logout } = useAuth();
    const customerId = user?.customer_id;
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Use the useClickOutside hook to close the dropdown when clicking outside
    useClickOutside<HTMLElement | null>(dropdownRef, () => setIsProfileOpen(false));

    return (
        <header className="bg-white border-b sticky top-0 z-30">
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onMenuClick}
                        className="p-2 rounded-lg hover:bg-gray-100"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <button className="p-2 rounded-full hover:bg-gray-100 relative">
                                <Bell className="h-5 w-5" />
                            </button>

                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsProfileOpen((prev) => !prev)}
                                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
                                >
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                        <span className="text-blue-600 font-medium">
                                            <User></User>
                                        </span>
                                    </div>
                                    <span className="font-medium">{user.name}</span>
                                    <ChevronDown className="h-4 w-4" />
                                </button>

                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1">
                                        <Link
                                            href={`/customers/${customerId}`}
                                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                                        >
                                            Settings
                                        </Link>
                                        {/* Logout Button */}
                                        <button
                                            onClick={logout}
                                            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-gray-100 rounded transition"
                                        >
                                            <LogOut className="h-5 w-5" />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        /* Login Button */
                        <Link
                            href="/login"
                            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-gray-100 rounded transition"
                        >
                            <LogIn className="h-5 w-5" />
                            <span>Login</span>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}