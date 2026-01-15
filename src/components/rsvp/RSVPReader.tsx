"use client";

import React, { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { RSVPWord } from '@/hooks/useRSVP';
import { cn } from '@/lib/utils';
import { ExamplesSidebar } from './ExamplesSidebar';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { EXAMPLE_TEXTS } from '@/data/exampleTexts';

// Types
type SpeedMode = 'linear' | 'block';

interface RSVPReaderProps {
    initialContent?: string;
}

// Highlighter colors for block mode
const SPEED_HIGHLIGHTS = {
    300: 'rgba(74, 222, 128, 0.3)',
    450: 'rgba(250, 204, 21, 0.3)',
    600: 'rgba(251, 146, 60, 0.3)',
    900: 'rgba(248, 113, 113, 0.3)',
};

const BLOCK_SPEEDS = [300, 450, 600, 900];

// Clean word helper
const cleanWord = (word: string): string => {
    return word
        .replace(/[-–—]/g, '')
        .replace(/[^a-zA-Z0-9''.,!?]/g, '')
        .trim();
};

export function RSVPReader({ initialContent }: RSVPReaderProps) {
    const router = useRouter();

    // State
    const [content, setContent] = useState(initialContent || '');
    const [speedMode, setSpeedMode] = useState<SpeedMode>('linear');
    const [startWPM, setStartWPM] = useState(300);
    const [endWPM, setEndWPM] = useState(900);
    const [isGenerated, setIsGenerated] = useState(false);
    const [isDark, setIsDark] = useState(true);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    // Process text into words
    const processText = useCallback((text: string): RSVPWord[] => {
        const rawWords = text.split(/\s+/)
            .map(w => cleanWord(w))
            .filter(w => w.length > 0);

        if (rawWords.length === 0) return [];

        return rawWords.map((word, i) => {
            let wpm: number;
            if (speedMode === 'linear') {
                const progress = rawWords.length > 1 ? i / (rawWords.length - 1) : 0;
                wpm = Math.round(startWPM + progress * (endWPM - startWPM));
            } else {
                const blockIndex = Math.floor((i / rawWords.length) * BLOCK_SPEEDS.length);
                wpm = BLOCK_SPEEDS[Math.min(blockIndex, BLOCK_SPEEDS.length - 1)];
            }
            return { word, wpm };
        });
    }, [speedMode, startWPM, endWPM]);

    // Handlers
    const handleGenerate = () => setIsGenerated(true);
    const handleStart = () => {
        // Save settings to sessionStorage and navigate to player
        const settings = {
            content,
            speedMode,
            startWPM,
            endWPM,
            isDark,
        };
        sessionStorage.setItem('rsvp-settings', JSON.stringify(settings));
        router.push('/app/player');
    };

    // Render highlighted content preview
    const renderHighlightedContent = () => {
        const words = processText(content);
        const totalWords = words.length;

        return (
            <div
                className={cn(
                    "w-full flex-1 min-h-[50vh] p-8 rounded-none text-lg leading-loose border-b overflow-auto",
                    isDark
                        ? "bg-black border-neutral-800 text-white"
                        : "bg-white border-neutral-200 text-neutral-700"
                )}
                style={{ fontFamily: 'Georgia, serif' }}
            >
                {words.map((w, i) => {
                    const position = totalWords > 1 ? i / (totalWords - 1) : 0;
                    let bgColor: string;
                    if (speedMode === 'linear') {
                        const hue = 120 - (position * 120);
                        bgColor = `hsla(${hue}, 70%, 50%, 0.25)`;
                    } else {
                        bgColor = SPEED_HIGHLIGHTS[w.wpm as keyof typeof SPEED_HIGHLIGHTS];
                    }
                    return (
                        <span
                            key={i}
                            style={{ backgroundColor: bgColor }}
                            className="inline px-0.5 py-0.5 rounded-sm"
                        >
                            {w.word}
                        </span>
                    );
                }).reduce((acc: React.ReactNode[], curr, i) => {
                    if (i === 0) return [curr];
                    return [...acc, ' ', curr];
                }, [])}
            </div>
        );
    };

    const inputExamples = EXAMPLE_TEXTS.slice(0, 5);

    return (
        <div className={cn(
            "w-full min-h-screen flex",
            isDark ? "bg-black" : "bg-white"
        )}>
            <ThemeToggle isDark={isDark} setIsDark={setIsDark} />

            {/* Main Input Area */}
            <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-8 py-24">
                {/* Header */}
                <div className="mb-8">
                    <h1
                        className={cn(
                            "text-2xl font-light mb-2",
                            isDark ? "text-white" : "text-black"
                        )}
                        style={{ fontFamily: 'Georgia, serif' }}
                    >
                        Enter your text
                    </h1>
                    <div className={cn(
                        "flex gap-6 text-sm",
                        isDark ? "text-neutral-500" : "text-neutral-600"
                    )}>
                        <div className="relative group">
                            <button
                                onClick={() => setSpeedMode('linear')}
                                className={cn(
                                    "cursor-pointer transition-colors hover:text-current",
                                    speedMode === 'linear' && (isDark ? "text-white" : "text-black"),
                                    speedMode !== 'linear' && "hover:opacity-80"
                                )}
                            >
                                Linear
                            </button>
                            <div className={cn(
                                "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 border shadow-sm",
                                isDark ? "bg-neutral-900 border-neutral-800 text-neutral-400" : "bg-white border-neutral-200 text-neutral-600"
                            )}>
                                Speed increases linearly from Start to End WPM.
                            </div>
                        </div>

                        <div className="relative group">
                            <button
                                onClick={() => setSpeedMode('block')}
                                className={cn(
                                    "cursor-pointer transition-colors hover:text-current",
                                    speedMode === 'block' && (isDark ? "text-white" : "text-black"),
                                    speedMode !== 'block' && "hover:opacity-80"
                                )}
                            >
                                Block
                            </button>
                            <div className={cn(
                                "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 border shadow-sm",
                                isDark ? "bg-neutral-900 border-neutral-800 text-neutral-400" : "bg-white border-neutral-200 text-neutral-600"
                            )}>
                                Speed increases in fixed steps (300, 450, 600, 900).
                            </div>
                        </div>
                    </div>
                </div>

                {/* Text Area or Preview */}
                {!isGenerated ? (
                    <textarea
                        ref={textAreaRef as any}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Paste your text here..."
                        className={cn(
                            "w-full flex-1 min-h-[50vh] p-8 rounded-none text-lg leading-loose resize-none focus:outline-none border-b transition-colors",
                            isDark
                                ? "bg-black text-white placeholder:text-neutral-700 border-neutral-800 focus:border-neutral-600"
                                : "bg-white text-black placeholder:text-neutral-400 border-neutral-200 focus:border-neutral-400"
                        )}
                        style={{ fontFamily: 'Georgia, serif' }}
                    />
                ) : (
                    renderHighlightedContent()
                )}

                {/* Speed Range for Linear Mode */}
                {speedMode === 'linear' && !isGenerated && (
                    <div className="mt-6 flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <span className={cn("text-xs", isDark ? "text-neutral-600" : "text-neutral-400")}>from</span>
                            <input
                                type="number"
                                value={startWPM}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    if (!isNaN(val)) setStartWPM(val);
                                }}
                                onBlur={(e) => {
                                    const val = parseInt(e.target.value);
                                    if (isNaN(val) || val < 100) setStartWPM(100);
                                    else if (val > 900) setStartWPM(900);
                                }}
                                min={100}
                                max={900}
                                className={cn(
                                    "w-20 px-3 py-2 text-sm text-center rounded-lg border-0 focus:outline-none focus:ring-1",
                                    isDark
                                        ? "bg-neutral-900 text-white focus:ring-neutral-700"
                                        : "bg-neutral-100 text-black focus:ring-neutral-300"
                                )}
                                style={{ fontFamily: 'Georgia, serif' }}
                            />
                        </div>
                        <div className={cn("text-xs", isDark ? "text-neutral-700" : "text-neutral-300")}>→</div>
                        <div className="flex items-center gap-2">
                            <span className={cn("text-xs", isDark ? "text-neutral-600" : "text-neutral-400")}>to</span>
                            <input
                                type="number"
                                value={endWPM}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    if (!isNaN(val)) setEndWPM(val);
                                }}
                                onBlur={(e) => {
                                    const val = parseInt(e.target.value);
                                    if (isNaN(val) || val < 200) setEndWPM(200);
                                    else if (val > 1200) setEndWPM(1200);
                                }}
                                min={200}
                                max={1200}
                                className={cn(
                                    "w-20 px-3 py-2 text-sm text-center rounded-lg border-0 focus:outline-none focus:ring-1",
                                    isDark
                                        ? "bg-neutral-900 text-white focus:ring-neutral-700"
                                        : "bg-neutral-100 text-black focus:ring-neutral-300"
                                )}
                                style={{ fontFamily: 'Georgia, serif' }}
                            />
                            <span className={cn("text-xs", isDark ? "text-neutral-600" : "text-neutral-400")}>wpm</span>
                        </div>
                    </div>
                )}

                {/* Block Mode Legend */}
                {speedMode === 'block' && isGenerated && (
                    <div className={cn("mt-4 flex gap-4 text-xs", isDark ? "text-neutral-500" : "text-neutral-600")}>
                        {BLOCK_SPEEDS.map(s => (
                            <span
                                key={s}
                                className="px-2 py-1 rounded"
                                style={{ backgroundColor: SPEED_HIGHLIGHTS[s as keyof typeof SPEED_HIGHLIGHTS] }}
                            >
                                {s} WPM
                            </span>
                        ))}
                    </div>
                )}

                {/* Action Buttons */}
                <div className={cn(
                    "mt-10 flex items-center w-full",
                    isGenerated ? "justify-between" : "gap-6"
                )}>
                    {!isGenerated ? (
                        <button
                            onClick={handleGenerate}
                            disabled={!content.trim()}
                            className={cn(
                                "text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed group cursor-pointer",
                                isDark ? "text-white" : "text-black"
                            )}
                            style={{ fontFamily: 'Georgia, serif' }}
                        >
                            <span className="border-b border-transparent group-hover:border-current pb-px">
                                Generate preview →
                            </span>
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={() => setIsGenerated(false)}
                                className={cn(
                                    "text-sm transition-colors",
                                    isDark ? "text-neutral-500 hover:text-white" : "text-neutral-500 hover:text-black"
                                )}
                                style={{ fontFamily: 'Georgia, serif' }}
                            >
                                Edit
                            </button>
                            <button
                                onClick={handleStart}
                                className={cn("text-sm transition-colors group", isDark ? "text-white" : "text-black")}
                                style={{ fontFamily: 'Georgia, serif' }}
                            >
                                <span className="border-b border-transparent group-hover:border-current pb-px">
                                    Start reading →
                                </span>
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Examples Sidebar */}
            <ExamplesSidebar
                examples={inputExamples}
                isDark={isDark}
                onSelect={(text) => { setContent(text); setIsGenerated(true); }}
            />
        </div>
    );
}
