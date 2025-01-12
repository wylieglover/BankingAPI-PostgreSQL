import { Card, CardContent } from "@/components/ui/card";
import Link from 'next/link';
import { ChevronRight, LucideIcon } from 'lucide-react';

export interface FeatureCardProps {
    href: string;
    title: string;
    description: string;
    icon: LucideIcon;
}

export const FeatureCard = ({ href, title, description, icon: Icon }: FeatureCardProps) => {
    "use client"
    return (
        <Link href={href} className="block">
            <Card className="group h-full transition-all hover:shadow-lg hover:border-blue-200">
                <CardContent className="p-6">
                    <div className="mb-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-4 w-fit group-hover:from-blue-100 group-hover:to-indigo-100 transition-colors">
                        <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold mb-2 text-gray-900">{title}</h2>
                    <p className="text-gray-600 mb-4">{description}</p>
                    <div className="flex items-center text-blue-600 group-hover:translate-x-1 transition-transform">
                        <span className="text-sm font-semibold">Learn more</span>
                        <ChevronRight className="ml-1 h-4 w-4" />
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
