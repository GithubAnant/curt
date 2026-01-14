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

            <div className={cn("flex items-baseline font-mono tracking-wide leading-none text-7xl md:text-8xl lg:text-9xl")}>
                {/* Left Part */}
                <span className="text-right text-white/90 w-[45vw] md:w-[400px] pr-[2px]">
                    {leftPart}
                </span>

                {/* Center Character - The Anchor */}
                <span className="text-[var(--rsvp-highlight)] font-bold w-auto text-center flex-shrink-0 relative z-10">
                    {centerChar}
                    {/* Subtle anchor line guide below the letter */}
                    <div className="absolute -bottom-8 left-1/2 w-px h-6 bg-[var(--rsvp-highlight)]/50 -translate-x-1/2" />
                    <div className="absolute -top-8 left-1/2 w-px h-6 bg-[var(--rsvp-highlight)]/50 -translate-x-1/2" />
                </span>

                {/* Right Part */}
                <span className="text-left text-white/90 w-[45vw] md:w-[400px] pl-[2px]">
                    {rightPart}
                </span>
            </div>
        </div>
    );
}
