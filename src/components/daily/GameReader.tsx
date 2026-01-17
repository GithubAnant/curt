"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

import { RSVPDisplay } from '../rsvp/RSVPDisplay';
import { RSVPModeSelector } from '../rsvp/RSVPModeSelector';
import { RSVPInputArea } from '../rsvp/RSVPInputArea';

type SpeedMode = 'linear' | 'block' | 'constant';

const BLOCK_SPEEDS = [300, 450, 600, 750, 900];

interface GameReaderProps {
    content: string;
    onComplete: (wpm: number) => void;
    fixedWpm?: number;
    hideControls?: boolean;
}

export default function GameReader({ content, onComplete, fixedWpm, hideControls }: GameReaderProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [startWPM, setStartWPM] = useState(fixedWpm || 350); // Base/Start WPM
    const [endWPM, setEndWPM] = useState(450); // End WPM
    const [speedMode, setSpeedMode] = useState<SpeedMode>(fixedWpm ? 'constant' : 'linear');
    const [index, setIndex] = useState(0);
    const [showControls, setShowControls] = useState(true);

    // Clean content
    const cleanedContent = content.replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
    const words = cleanedContent.split(' ');

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isPlaying) {
            setShowControls(false);

            if (index >= words.length - 1) {
                // End of text
                setIsPlaying(false);
                setShowControls(true);
                onComplete(startWPM); // Or average? Just passing start for now
                return;
            }

            let effectiveWPM = startWPM;

            // 1. Initial Ease-in (First 5 words always ramp from 60%)
            const RAMP_UP_STEPS = 5;

            if (index < RAMP_UP_STEPS) {
                const progress = index / RAMP_UP_STEPS;
                const startRatio = 0.6;
                const ratio = startRatio + (1 - startRatio) * progress;
                effectiveWPM = startWPM * ratio;
            } else {
                // 2. Mode Logic
                const range = endWPM - startWPM;
                const progress = index / words.length;

                if (speedMode === 'linear') {
                    // Smooth scaling
                    effectiveWPM = startWPM + (progress * range);
                } else if (speedMode === 'block') {
                    // Block scaling: Fixed steps matching RSVPInputArea
                    const blockIndex = Math.floor((index / words.length) * BLOCK_SPEEDS.length);
                    effectiveWPM = BLOCK_SPEEDS[Math.min(blockIndex, BLOCK_SPEEDS.length - 1)];
                } else {
                    // Constant
                    effectiveWPM = startWPM;
                }
            }

            const intervalTime = 60000 / effectiveWPM;

            timerRef.current = setTimeout(() => {
                setIndex(prev => prev + 1);
            }, intervalTime);
        } else {
            setShowControls(true);
        }

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [isPlaying, index, startWPM, endWPM, words.length, onComplete, speedMode]);

    // Update startWPM if fixedWpm changes
    useEffect(() => {
        if (fixedWpm) {
            setStartWPM(fixedWpm);
            setSpeedMode('constant');
        }
    }, [fixedWpm]);

    const currentWord = words[index] || "";

    const handleStartWPMChange = (newVal: number) => {
        const val = Math.max(100, Math.min(2000, newVal));
        setStartWPM(val);
        // Put logic to push endWPM if start > end (for linear)
        if (speedMode === 'linear' && val > endWPM) {
            setEndWPM(val);
        }
    };

    const handleEndWPMChange = (newVal: number) => {
        const val = Math.max(100, Math.min(2000, newVal));
        setEndWPM(val);
        // Put logic to push startWPM if end < start
        if (val < startWPM) {
            setStartWPM(val);
        }
    };


    return (
        <div className="flex flex-col items-center w-full">
            <div className="flex flex-col items-center justify-center w-full max-w-3xl aspect-video bg-neutral-900 rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl">

                <RSVPDisplay
                    word={currentWord}
                    wpm={startWPM} // Just for display reference if needed
                    isDark={true}
                    className="h-full w-full"
                />

                {/* Controls Overlay */}
                {showControls && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-black/90 backdrop-blur-xl z-20 flex flex-col items-center justify-center p-8 transition-all"
                    >
                        <div className="flex flex-col items-center gap-10">
                            <div className="text-center">
                                {/* Speed Controls - Hidden for Block Mode or explicit hideControls */}
                                {!hideControls && speedMode !== 'block' && (
                                    <div className="flex items-center gap-12 mb-8">
                                        {/* Start Speed (Always Visible if not block) */}
                                        <div className="flex flex-col items-center gap-2">
                                            <label className="text-xs text-neutral-500 uppercase tracking-[0.2em]" style={{ fontFamily: 'Georgia, serif' }}>
                                                {speedMode === 'constant' ? 'Speed' : 'Start Speed'}
                                            </label>
                                            <div className="flex items-center gap-6">
                                                <button
                                                    onClick={() => handleStartWPMChange(startWPM - 50)}
                                                    className="w-12 h-12 rounded-full border border-neutral-800 flex items-center justify-center text-neutral-500 hover:text-white hover:border-neutral-600 transition-colors"
                                                >
                                                    -
                                                </button>
                                                <span className="text-5xl font-medium font-mono w-[120px] text-center text-white">{startWPM}</span>
                                                <button
                                                    onClick={() => handleStartWPMChange(startWPM + 50)}
                                                    className="w-12 h-12 rounded-full border border-neutral-800 flex items-center justify-center text-neutral-500 hover:text-white hover:border-neutral-600 transition-colors"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        {/* End Speed (Only for Linear) */}
                                        {speedMode === 'linear' && (
                                            <>
                                                <div className="w-px h-16 bg-neutral-800 hidden md:block"></div>
                                                <div className="flex flex-col items-center gap-2">
                                                    <label className="text-xs text-neutral-500 uppercase tracking-[0.2em]" style={{ fontFamily: 'Georgia, serif' }}>End Speed</label>
                                                    <div className="flex items-center gap-6">
                                                        <button
                                                            onClick={() => handleEndWPMChange(endWPM - 50)}
                                                            className="w-12 h-12 rounded-full border border-neutral-800 flex items-center justify-center text-neutral-500 hover:text-white hover:border-neutral-600 transition-colors"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="text-5xl font-medium font-mono w-[120px] text-center text-white">{endWPM}</span>
                                                        <button
                                                            onClick={() => handleEndWPMChange(endWPM + 50)}
                                                            className="w-12 h-12 rounded-full border border-neutral-800 flex items-center justify-center text-neutral-500 hover:text-white hover:border-neutral-600 transition-colors"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => setIsPlaying(true)}
                                className="w-24 h-24 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 hover:scale-105 transition-all group hover:border-white/40"
                            >
                                <Play className="w-10 h-10 fill-white opacity-90 group-hover:opacity-100 pl-1" />
                            </button>

                            {index > 0 && (
                                <button
                                    onClick={() => setIndex(0)}
                                    className="text-xs text-neutral-600 hover:text-neutral-400 uppercase tracking-widest flex items-center gap-2 mt-4 transition-colors"
                                >
                                    <RotateCcw size={12} /> Start Over
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

            {!isPlaying && (
                <div className="max-w-3xl w-full mt-8 flex flex-col items-center">
                    {!hideControls && (
                        <div className="mb-6">
                            <RSVPModeSelector
                                speedMode={speedMode}
                                setSpeedMode={setSpeedMode}
                            />
                        </div>
                    )}

                    <div className="w-full">
                        <RSVPInputArea
                            content={content}
                            setContent={() => { }} // Read-only
                            isGenerated={true}
                            speedMode={speedMode}
                            startWPM={startWPM}
                            endWPM={speedMode === 'constant' ? startWPM : endWPM}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
