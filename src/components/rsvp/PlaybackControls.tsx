"use client";

import { cn } from '@/lib/utils';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface PlaybackControlsProps {
    isDark?: boolean;
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
            <div className="backdrop-blur-md rounded-2xl border p-6 bg-neutral-900/80 border-neutral-800">
                {/* Progress Bar */}
                <div className="flex items-center gap-4 mb-6">
                    <span className="text-[10px] font-mono tracking-widest w-12 text-right text-neutral-500">
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
                        className="flex-1"
                    />
                    <span className="text-[10px] font-mono tracking-widest w-16 text-neutral-500">
                        {currentWPM} WPM
                    </span>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="w-14 h-14 rounded-full flex items-center justify-center hover:scale-105 transition-transform active:scale-95 cursor-pointer bg-[#E07A5F] text-black"
                        >
                            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                        </button>
                        <button
                            onClick={() => onScrub(0)}
                            className="w-10 h-10 rounded-full border flex items-center justify-center transition-colors cursor-pointer border-neutral-700 text-neutral-400 hover:text-white"
                        >
                            <RotateCcw size={16} />
                        </button>
                        <button
                            onClick={onNewText}
                            className="px-4 h-10 rounded-full border flex items-center justify-center text-xs transition-colors cursor-pointer border-neutral-700 text-neutral-400 hover:text-white"
                        >
                            New Text
                        </button>
                    </div>
                </div>
            </div>

            {/* Mode Indicator */}
            <div className="text-center mt-4 text-[10px] uppercase tracking-[0.3em] text-neutral-600" style={{ fontFamily: 'Georgia, serif' }}>
                CURT / {speedMode === 'linear' ? 'Linear' : 'Block'} Mode
            </div>
        </div>
    );
}
