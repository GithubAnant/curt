"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface GameReaderProps {
    content: string;
    onComplete: (wpm: number) => void;
}

export default function GameReader({ content, onComplete }: GameReaderProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [wpm, setWpm] = useState(400); // Default to 400 or load from pref
    const [index, setIndex] = useState(0);
    const [showControls, setShowControls] = useState(true);

    const words = content.split(/\s+/);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isPlaying) {
            setShowControls(false); // Hide controls when playing for immersion
            const intervalTime = 60000 / wpm;

            intervalRef.current = setInterval(() => {
                setIndex(prev => {
                    if (prev >= words.length - 1) {
                        setIsPlaying(false);
                        setShowControls(true);
                        onComplete(wpm);
                        return prev;
                    }
                    return prev + 1;
                });
            }, intervalTime);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setShowControls(true);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isPlaying, wpm, words.length, onComplete]);

    const currentWord = words[index] || "";
    const orpIndex = currentWord.length <= 3 ? 1 : 2;
    const leftPart = currentWord.slice(0, orpIndex);
    const centerChar = currentWord[orpIndex];
    const rightPart = currentWord.slice(orpIndex + 1);

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-3xl aspect-video bg-neutral-900 rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl">

            {/* Word Display */}
            <div className="relative z-10 flex items-baseline text-5xl md:text-7xl font-serif">
                <span className="w-[180px] text-right text-neutral-500 mr-1">{leftPart}</span>
                <span className="text-[#E07A5F] font-medium">{centerChar}</span>
                <span className="w-[180px] text-left text-neutral-500 ml-1">{rightPart}</span>
            </div>

            {/* Vertical Guides */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[2px] h-16 bg-white/5" />

            {/* Controls Overlay */}
            {showControls && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-8"
                >
                    <div className="flex flex-col items-center gap-8">
                        <div className="text-center">
                            <label className="text-sm text-neutral-400 uppercase tracking-widest mb-2 block">Speed (WPM)</label>
                            <div className="flex items-center gap-4">
                                <button onClick={() => setWpm(Math.max(200, wpm - 50))} className="text-neutral-500 hover:text-white">-</button>
                                <span className="text-4xl font-bold font-mono w-[120px] text-center">{wpm}</span>
                                <button onClick={() => setWpm(Math.min(1000, wpm + 50))} className="text-neutral-500 hover:text-white">+</button>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsPlaying(true)}
                            className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform"
                        >
                            {index > 0 && index < words.length - 1 ? <Play className="ml-1" /> : <Play className="ml-1" />}
                        </button>

                        {index > 0 && (
                            <button
                                onClick={() => setIndex(0)}
                                className="text-sm text-neutral-500 hover:text-white flex items-center gap-1"
                            >
                                <RotateCcw size={14} /> Reset
                            </button>
                        )}
                    </div>
                </motion.div>
            )}

            {/* Tap to Pause Zone (Invisible) */}
            {isPlaying && (
                <div
                    className="absolute inset-0 z-30 cursor-pointer"
                    onClick={() => setIsPlaying(false)}
                />
            )}
        </div>
    );
}
