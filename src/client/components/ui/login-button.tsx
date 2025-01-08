'use client'
import { Button as BaseButton } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react';

interface ButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    isLoading?: boolean;
    children: ReactNode;
}

const Button = ({ isLoading = false, children, ...props }: ButtonProps) => {
    return (
        <BaseButton
            {...props}
            disabled={isLoading || props.disabled}
            className={`relative w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 transition-colors duration-150 disabled:bg-gray-300 disabled:cursor-not-allowed ${props.className}`}
        >
            {isLoading && (
                <Loader2 className="absolute left-4 h-5 w-5 animate-spin text-white" />
            )}
            <span className={`${isLoading ? 'opacity-50' : ''}`}>{children}</span>
        </BaseButton>
    );
};

export default Button;
