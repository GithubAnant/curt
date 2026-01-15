"use client";

import { cn } from '@/lib/utils';

interface ThemeToggleProps {
    isDark: boolean;
    setIsDark: (value: boolean) => void;
}

export function ThemeToggle({ isDark, setIsDark }: ThemeToggleProps) {
    return (
        <button
            onClick={() => setIsDark(!isDark)}
            className="fixed top-6 right-6 z-50 cursor-pointer"
            style={{ fontFamily: 'Georgia, serif' }}
        >
            <span className={cn(
                "text-2xl font-normal transition-colors",
                isDark ? "text-[#E07A5F]" : "text-[#E07A5F]"
            )}>
                {isDark ? 'd' : 'l'}
            </span>
        </button>
    );
}
