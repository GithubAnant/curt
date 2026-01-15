"use client";

import { cn } from '@/lib/utils';
import { Play, Pause, RotateCcw, Download } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface PlaybackControlsProps {
    isDark: boolean;
    isPlaying: boolean;
    setIsPlaying: (value: boolean) => void;
    progress: number;
    currentWPM: number;
    speedMode: 'linear' | 'block';
    processedWordsLength: number;
    onScrub: (index: number) => void;
    onNewText: () => void;
}

export function PlaybackControls({
    isDark,
    isPlaying,
    setIsPlaying,
    progress,
    currentWPM,
    speedMode,
    processedWordsLength,
    onScrub,
    onNewText,
}: PlaybackControlsProps) {
    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl">
            <div className={cn(
                "backdrop-blur-md rounded-2xl border p-6",
                isDark
                    ? "bg-neutral-900/80 border-neutral-800"
                    : "bg-white/80 border-neutral-200"
            )}>
                {/* Progress Bar */}
                <div className="flex items-center gap-4 mb-6">
                    <span className={cn(
                        "text-[10px] font-mono tracking-widest w-12 text-right",
                        isDark ? "text-neutral-500" : "text-neutral-600"
                    )}>
                        {Math.round(progress * 100)}%
                    </span>
                    <Slider
                        value={[progress * 100]}
                        max={100}
                        step={0.1}
                        onValueChange={(val) => {
                            const newIndex = Math.floor((val[0] / 100) * processedWordsLength);
                            onScrub(newIndex);
                        }}
                        className={cn(
                            "flex-1",
                            !isDark && "**:data-[slot=slider-track]:bg-neutral-300 **:data-[slot=slider-range]:bg-neutral-800"
                        )}
                    />
                    <span className={cn(
                        "text-[10px] font-mono tracking-widest w-16",
                        isDark ? "text-neutral-500" : "text-neutral-600"
                    )}>
                        {currentWPM} WPM
                    </span>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className={cn(
                                "w-14 h-14 rounded-full flex items-center justify-center hover:scale-105 transition-transform active:scale-95",
                                isDark ? "bg-white text-black" : "bg-black text-white"
                            )}
                        >
                            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                        </button>
                        <button
                            onClick={() => onScrub(0)}
                            className={cn(
                                "w-10 h-10 rounded-full border flex items-center justify-center transition-colors",
                                isDark
                                    ? "border-neutral-700 text-neutral-400 hover:text-white"
                                    : "border-neutral-300 text-neutral-600 hover:text-black"
                            )}
                        >
                            <RotateCcw size={16} />
                        </button>
                        <button
                            onClick={onNewText}
                            className={cn(
                                "px-4 h-10 rounded-full border flex items-center justify-center text-xs transition-colors",
                                isDark
                                    ? "border-neutral-700 text-neutral-400 hover:text-white"
                                    : "border-neutral-300 text-neutral-600 hover:text-black"
                            )}
                        >
                            New Text
                        </button>
                    </div>


                </div>
            </div>

            {/* Mode Indicator */}
            <div className={cn(
                "text-center mt-4 text-[10px] uppercase tracking-[0.3em]",
                isDark ? "text-neutral-600" : "text-neutral-400"
            )}>
                CURT / {speedMode === 'linear' ? 'Linear' : 'Block'} Mode
            </div>
        </div>
    );
}
