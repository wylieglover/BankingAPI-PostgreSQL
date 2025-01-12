'use client'
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from '@/context/auth';
import { Loader2, Bell, Shield, User } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import api from '@/lib/api';
import axios from 'axios';

interface UserSettings {
    profile: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
    };
    notifications: {
        emailAlerts: boolean;
        smsAlerts: boolean;
        marketingEmails: boolean;
    };
    security: {
        twoFactorEnabled: boolean;
        lastPasswordChange: string;
    };
}
const SettingsPage = () => {
    const { user } = useAuth();
    const [settings, setSettings] = useState<UserSettings>({
        profile: {
            firstName: '',
            lastName: '',
            email: '',
            phone: ''
        },
        notifications: {
            emailAlerts: true,
            smsAlerts: true,
            marketingEmails: false
        },
        security: {
            twoFactorEnabled: false,
            lastPasswordChange: ''
        }
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {

            } catch (err) {
                setError('Failed to load settings');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put('/users/settings/profile', settings.profile);
            // Show success message
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch customers';
                setError(errorMessage);
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setSaving(false);
            console.log(loading)
        }
    };

    // const handleNotificationUpdate = async (key: keyof typeof settings.notifications) => {
    //     const newSettings = {
    //         ...settings,
    //         notifications: {
    //             ...settings.notifications,
    //             [key]: !settings.notifications[key]
    //         }
    //     };

    //     setSettings(newSettings);
    //     try {
    //         await api.put('/users/settings/notifications', newSettings.notifications);
    //     } catch (err: unknown) {
    //         if (axios.isAxiosError(err)) {
    //             const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch customers';
    //             setSettings(settings)
    //             setError(errorMessage);
    //         } else {
    //             setSettings(settings)
    //             setError('An unexpected error occurred');
    //         }
    //     };

    //     if (loading) {
    //         return (
    //             <div className="flex items-center justify-center min-h-screen">
    //                 <Loader2 className="h-6 w-6 animate-spin" />
    //             </div>
    //         );
    //     }

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-6">Settings</h1>

            <Tabs defaultValue="profile" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="profile" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Profile
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        Notifications
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Security
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleProfileUpdate} className="space-y-4">
                                <div className="flex items-center gap-4 mb-6">
                                    <Avatar className="h-20 w-20">
                                        <AvatarFallback>
                                            {user?.name?.[0]}{user?.name?.[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <Button variant="outline">Change Avatar</Button>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input
                                            id="firstName"
                                            value={settings.profile.firstName}
                                            onChange={e => setSettings({
                                                ...settings,
                                                profile: { ...settings.profile, firstName: e.target.value }
                                            })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input
                                            id="lastName"
                                            value={settings.profile.lastName}
                                            onChange={e => setSettings({
                                                ...settings,
                                                profile: { ...settings.profile, lastName: e.target.value }
                                            })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={settings.profile.email}
                                        onChange={e => setSettings({
                                            ...settings,
                                            profile: { ...settings.profile, email: e.target.value }
                                        })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        value={settings.profile.phone}
                                        onChange={e => setSettings({
                                            ...settings,
                                            profile: { ...settings.profile, phone: e.target.value }
                                        })}
                                    />
                                </div>

                                <Button type="submit" disabled={saving}>
                                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Changes
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Preferences</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Email Alerts</Label>
                                    <p className="text-sm text-gray-500">
                                        Receive email notifications about account activity
                                    </p>
                                </div>
                                {/* <Switch
                                    checked={settings.notifications.emailAlerts}
                                    onCheckedChange={() => handleNotificationUpdate('emailAlerts')}
                                /> */}
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>SMS Alerts</Label>
                                    <p className="text-sm text-gray-500">
                                        Get text messages for important updates
                                    </p>
                                </div>
                                {/* <Switch
                                    checked={settings.notifications.smsAlerts}
                                    onCheckedChange={() => handleNotificationUpdate('smsAlerts')}
                                /> */}
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Marketing Emails</Label>
                                    <p className="text-sm text-gray-500">
                                        Receive news about products and features
                                    </p>
                                </div>
                                {/* <Switch
                                    checked={settings.notifications.marketingEmails}
                                    onCheckedChange={() => handleNotificationUpdate('marketingEmails')}
                                /> */}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle>Security Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Two-Factor Authentication</Label>
                                    <p className="text-sm text-gray-500">
                                        Add an extra layer of security to your account
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.security.twoFactorEnabled}
                                    onCheckedChange={async () => {
                                        // Handle 2FA setup flow
                                    }}
                                />
                            </div>
                            <div>
                                <Button variant="outline" className="w-full">
                                    Change Password
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
            </Tabs>
        </div>
    );
}


export default SettingsPage;