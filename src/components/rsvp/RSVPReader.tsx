"use client";

import React, { useState, useEffect } from 'react';
import { cleanTextForRSVP } from '@/lib/textUtils';
import { useRSVP, RSVPWord } from '@/hooks/useRSVP';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, RotateCcw, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RSVPDisplay } from './RSVPDisplay';

interface RSVPReaderProps {
    content: string;
}

export function RSVPReader({ content }: RSVPReaderProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [baseWPM, setBaseWPM] = useState(300);
    const [processedWords, setProcessedWords] = useState<RSVPWord[]>([]);


    useEffect(() => {
        const rawWords = cleanTextForRSVP(content);
        const wordsWithSpeed = rawWords.map(w => ({
            word: w,
            wpm: baseWPM
        }));
        setProcessedWords(wordsWithSpeed);
    }, [content, baseWPM]);

    const { currentWord, progress, scrub, isFinished, index } = useRSVP({
        words: processedWords,
        isPlaying,
        onComplete: () => setIsPlaying(false)
    });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                e.preventDefault();
                setIsPlaying(p => !p);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="w-full h-full flex flex-col justify-center relative">

            {/* Visual Display */}
            <div className="flex-1 flex items-center justify-center">
                <RSVPDisplay word={currentWord?.word || null} />
            </div>

            {/* Floating Glass Controls */}
            <div className="fixed bottom-12 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl">
                <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-2xl transition-all duration-300 hover:bg-white/10">

                    {/* Progress Bar */}
                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-[10px] font-mono text-white/40 tracking-widest w-12 text-right">
                            {Math.round(progress * 100).toString().padStart(3, '0')}%
                        </span>
                        <Slider
                            value={[progress * 100]}
                            max={100}
                            step={0.1}
                            onValueChange={(val) => {
                                const newIndex = Math.floor((val[0] / 100) * processedWords.length);
                                scrub(newIndex);
                            }}
                            className="flex-1"
                        />
                    </div>

                    {/* Main Controls Row */}
                    <div className="flex items-center justify-between">
                        {/* Play/Pause */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform active:scale-95"
                            >
                                {isPlaying ? <Pause size={24} fill="black" /> : <Play size={24} fill="black" className="ml-1" />}
                            </button>
                            <button
                                onClick={() => scrub(0)}
                                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 transition-colors"
                            >
                                <RotateCcw size={16} />
                            </button>
                        </div>

                        {/* Speed Selector */}
                        <div className="flex items-center gap-2 bg-black/20 rounded-full p-1 pl-4 border border-white/5">
                            <Zap size={14} className={cn("transition-colors", baseWPM >= 900 ? "text-red-500" : "text-white/40")} />
                            <div className="flex">
                                {[300, 450, 600, 900].map((speed) => (
                                    <button
                                        key={speed}
                                        onClick={() => setBaseWPM(speed)}
                                        className={cn(
                                            "px-4 py-2 text-xs font-mono rounded-full section-transition transition-all",
                                            baseWPM === speed
                                                ? "bg-white/10 text-white font-bold"
                                                : "text-white/40 hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        {speed}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-4 opacity-30 text-[10px] uppercase tracking-[0.3em]">
                    CURT / v1.0 / {baseWPM} WPM
                </div>
            </div>
        </div>
    );
}
