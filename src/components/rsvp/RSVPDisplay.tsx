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
                "absolute top-1/2 -translate-y-[100px] left-0 right-0 h-px",
                isDark ? "bg-neutral-800" : "bg-neutral-200"
            )} />

            {/* Word Display */}
            <div className="flex items-baseline justify-center leading-none text-6xl md:text-7xl lg:text-8xl w-full" style={{ fontFamily: 'Georgia, serif' }}>
                <span className={cn(
                    "flex-1 text-right pr-px whitespace-nowrap overflow-hidden",
                    isDark ? "text-white" : "text-black"
                )}>
                    {leftPart}
                </span>

                <span className="text-[#E07A5F] w-auto text-center flex-shrink-0 relative z-10">
                    {centerChar}
                    <div className={cn(
                        "absolute -bottom-[100px] left-1/2 w-px -translate-x-1/2 h-[100px]",
                        isDark ? "bg-neutral-700" : "bg-neutral-300"
                    )} />
                    <div className={cn(
                        "absolute -top-[100px] left-1/2 w-px -translate-x-1/2 h-[100px]",
                        isDark ? "bg-neutral-700" : "bg-neutral-300"
                    )} />
                </span>

                <span className={cn(
                    "flex-1 text-left pl-px whitespace-nowrap overflow-hidden",
                    isDark ? "text-white" : "text-black"
                )}>
                    {rightPart}
                </span>
            </div>

            {/* Bottom Horizontal Line */}
            <div className={cn(
                "absolute top-1/2 translate-y-[100px] left-0 right-0 h-px",
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


