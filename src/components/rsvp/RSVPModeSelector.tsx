import React from 'react';
import { cn } from '@/lib/utils';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";

type SpeedMode = 'linear' | 'block' | 'constant';

interface RSVPModeSelectorProps {
    speedMode: SpeedMode;
    setSpeedMode: (mode: SpeedMode) => void;
}

export const RSVPModeSelector = ({ speedMode, setSpeedMode }: RSVPModeSelectorProps) => {
    return (
        <div className="flex gap-6 mb-8 text-sm border-b border-neutral-800">
            <HoverCard openDelay={0} closeDelay={0}>
                <HoverCardTrigger asChild>
                    <button
                        onClick={() => setSpeedMode('linear')}
                        className={cn(
                            "pb-3 border-b-2 -mb-px transition-colors outline-none cursor-pointer",
                            speedMode === 'linear'
                                ? "border-[#E07A5F] text-white"
                                : "border-transparent text-neutral-500 hover:text-neutral-300"
                        )}
                    >
                        Linear
                    </button>
                </HoverCardTrigger>
                <HoverCardContent className="w-64">
                    <div className="space-y-1">
                        <h4 className="text-sm font-semibold text-white">Linear Mode</h4>
                        <p className="text-xs text-neutral-400">
                            Speed increases smoothly and continuously from start to finish. Good for building rhythm.
                        </p>
                    </div>
                </HoverCardContent>
            </HoverCard>

            <HoverCard openDelay={0} closeDelay={0}>
                <HoverCardTrigger asChild>
                    <button
                        onClick={() => setSpeedMode('block')}
                        className={cn(
                            "pb-3 border-b-2 -mb-px transition-colors outline-none cursor-pointer",
                            speedMode === 'block'
                                ? "border-[#E07A5F] text-white"
                                : "border-transparent text-neutral-500 hover:text-neutral-300"
                        )}
                    >
                        Block
                    </button>
                </HoverCardTrigger>
                <HoverCardContent className="w-64">
                    <div className="space-y-1">
                        <h4 className="text-sm font-semibold text-white">Block Mode</h4>
                        <p className="text-xs text-neutral-400">
                            Speed increases in distinct, stepped stages (e.g., 300 → 450 → 600 wpm).
                        </p>
                    </div>
                </HoverCardContent>
            </HoverCard>

            <HoverCard openDelay={0} closeDelay={0}>
                <HoverCardTrigger asChild>
                    <button
                        onClick={() => setSpeedMode('constant')}
                        className={cn(
                            "pb-3 border-b-2 -mb-px transition-colors outline-none cursor-pointer",
                            speedMode === 'constant'
                                ? "border-[#E07A5F] text-white"
                                : "border-transparent text-neutral-500 hover:text-neutral-300"
                        )}
                    >
                        Constant
                    </button>
                </HoverCardTrigger>
                <HoverCardContent className="w-64">
                    <div className="space-y-1">
                        <h4 className="text-sm font-semibold text-white">Constant Mode</h4>
                        <p className="text-xs text-neutral-400">
                            Read at a single, fixed speed the entire time. Good for consistency.
                        </p>
                    </div>
                </HoverCardContent>
            </HoverCard>
        </div>
    );
};
