import { getORPIndex } from '@/hooks/useRSVP';
import { cn } from '@/lib/utils';
import React from 'react';

interface RSVPDisplayProps {
    word: string | null;
    wpm?: number;
    isDark?: boolean;
    className?: string;
}

export function RSVPDisplay({ word, wpm = 300, isDark = true, className }: RSVPDisplayProps) {
    if (!word) {
        return (
            <div className={cn("flex flex-col items-center justify-center w-full h-[60vh] text-center", className)}>
                <span className={cn(
                    "text-sm tracking-[0.2em] uppercase opacity-50",
                    isDark ? "text-neutral-500" : "text-neutral-400"
                )}>Ready</span>
                <span className={cn(
                    "text-3xl mt-4 font-light",
                    isDark ? "text-neutral-400" : "text-neutral-600"
                )}>Press SPACE to start</span>
            </div>
        );
    }

    const orpIndex = getORPIndex(word);
    const leftPart = word.slice(0, orpIndex);
    const centerChar = word[orpIndex];
    const rightPart = word.slice(orpIndex + 1);

    return (
        <div className={cn("relative flex flex-col items-center justify-center w-full h-[50vh] overflow-hidden select-none", className)}>
            {/* Top Horizontal Line */}
            <div className={cn(
                "absolute top-1/2 -translate-y-[120px] left-0 right-0 h-px",
                isDark ? "bg-neutral-800" : "bg-neutral-200"
            )} />

            {/* Word Display - anchor letter fixed at center */}
            <div className="flex items-baseline justify-center leading-none text-5xl md:text-6xl lg:text-7xl" style={{ fontFamily: 'Georgia, serif' }}>
                {/* Left part - fixed width, right-aligned */}
                <span className={cn(
                    "w-[200px] md:w-[280px] text-right",
                    isDark ? "text-white" : "text-black"
                )}>
                    {leftPart}
                </span>

                {/* Center anchor letter - just colored differently, with vertical guides */}
                <span className="text-[#E07A5F] relative">
                    {centerChar}
                    {/* Bottom vertical line - gap from letter, extends to horizontal line */}
                    <div className={cn(
                        "absolute top-full left-1/2 w-px -translate-x-1/2 h-[90px] mt-4",
                        isDark ? "bg-neutral-700" : "bg-neutral-300"
                    )} />
                    {/* Top vertical line - gap from letter, extends to horizontal line */}
                    <div className={cn(
                        "absolute bottom-full left-1/2 w-px -translate-x-1/2 h-[90px] mb-4",
                        isDark ? "bg-neutral-700" : "bg-neutral-300"
                    )} />
                </span>

                {/* Right part - fixed width, left-aligned */}
                <span className={cn(
                    "w-[200px] md:w-[280px] text-left",
                    isDark ? "text-white" : "text-black"
                )}>
                    {rightPart}
                </span>
            </div>

            {/* Bottom Horizontal Line */}
            <div className={cn(
                "absolute top-1/2 translate-y-[120px] left-0 right-0 h-px",
                isDark ? "bg-neutral-800" : "bg-neutral-200"
            )} />

            {/* WPM Indicator */}
            <div className={cn(
                "absolute bottom-4 right-8 text-lg tracking-wide",
                isDark ? "text-neutral-600" : "text-neutral-400"
            )} style={{ fontFamily: 'Georgia, serif' }}>
                {wpm} wpm
            </div>
        </div>
    );
}


