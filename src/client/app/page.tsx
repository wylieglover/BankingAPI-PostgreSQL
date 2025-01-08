// src/app/page.tsx
import { Card, CardContent } from "@/components/ui/card";
import {
  Shield
} from 'lucide-react';
import Dashboard from '@/components/layout/Dashboard';

import './globals.css';

// Main page component remains a server component
export default function HomePage() {
  return (
    <>
      {/* Dashboard Client Component */}
      <Dashboard />

      {/* Security Banner */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-none">
        <CardContent className="p-8 flex items-center gap-6">
          <div className="rounded-full bg-white p-4">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2 text-gray-900">Bank-Grade Security</h2>
            <p className="text-gray-600">
              Your financial data is protected with enterprise-level encryption and multi-factor authentication.
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
