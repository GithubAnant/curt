import { getORPIndex } from '@/hooks/useRSVP';
import { cn } from '@/lib/utils';
import React from 'react';

interface RSVPDisplayProps {
    word: string | null;
    className?: string;
}

export function RSVPDisplay({ word, className }: RSVPDisplayProps) {
    if (!word) {
        return (
            <div className={cn("flex flex-col items-center justify-center w-full h-[60vh] text-center", className)}>
                <span className="text-muted-foreground text-sm tracking-[0.2em] uppercase opacity-50">System Ready</span>
                <span className="text-white text-4xl mt-4 font-light">Press SPACE to Initialize</span>
            </div>
        );
    }

    const orpIndex = getORPIndex(word);
    const leftPart = word.slice(0, orpIndex);
    const centerChar = word[orpIndex];
    const rightPart = word.slice(orpIndex + 1);

    return (
        <div className={cn("relative flex items-center justify-center w-full h-[50vh] overflow-hidden select-none", className)}>

            <div className={cn("flex items-baseline justify-center font-sans tracking-tight leading-none text-7xl md:text-8xl lg:text-9xl w-full max-w-[90vw]")}>
                {/* Left Part - Flex 1 ensures it pushes against the center equally */}
                <span className="flex-1 text-right text-white/90 pr-[2px] whitespace-nowrap overflow-hidden">
                    {leftPart}
                </span>

                {/* Center Character - The Anchor */}
                {/* Hardcoded Red Color to ensure visibility. Scale reduced for focus. */}
                <span className="text-red-500 font-bold w-auto text-center flex-shrink-0 relative z-10">
                    {centerChar}

                    {/* Vertical Guide Lines - Fixed height and opacity */}
                    <div className="absolute -bottom-40 left-1/2 w-[2px] bg-white/10 -translate-x-1/2 h-32" />
                    <div className="absolute -top-40 left-1/2 w-[2px] bg-white/10 -translate-x-1/2 h-32" />
                </span>

                {/* Right Part - Flex 1 mirroring left */}
                <span className="flex-1 text-left text-white/90 pl-[2px] whitespace-nowrap overflow-hidden">
                    {rightPart}
                </span>
            </div>

            {/* Horizontal Frame Lines */}
            <div className="absolute top-1/2 -translate-y-[120px] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="absolute top-1/2 translate-y-[120px] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
    );
}
