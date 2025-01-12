'use client';

import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from 'lucide-react';
import Counter from '@/components/ui/counter';
import { cn } from "@/lib/utils";

interface StatsCardProps {
    title: string;
    value?: string | number;
    icon: LucideIcon;
    trend: string;
    trendUp: boolean;
    target?: string;
    className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    icon: Icon,
    trend,
    trendUp,
    target,
    className
}) => {
    return (
        <Card className={cn(
            "bg-white border-none shadow-md",
            className
        )}>
            <CardContent className="p-6 flex items-center gap-4">
                <div className={`rounded-full p-3 ${trendUp ? 'bg-blue-100' : 'bg-red-100'}`}>
                    <Icon className={`h-6 w-6 ${trendUp ? 'text-blue-500' : 'text-red-500'}`} />
                </div>
                <div>
                    <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                    <p className="text-2xl font-bold text-gray-900">
                        {target ? <Counter target={target} /> : value}
                    </p>
                    <p className={`text-sm ${trendUp ? 'text-blue-500' : 'text-red-500'}`}>{trend}</p>
                </div>
            </CardContent>
        </Card>
    );
};