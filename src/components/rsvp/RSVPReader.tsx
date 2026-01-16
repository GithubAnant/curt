"use client";

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RSVPWord } from '@/hooks/useRSVP';
import { cn } from '@/lib/utils';
import { EXAMPLE_TEXTS } from '@/data/exampleTexts';

type SpeedMode = 'linear' | 'block';

interface RSVPReaderProps {
    initialContent?: string;
}

const BLOCK_SPEEDS = [300, 450, 600, 750, 900];

const cleanWord = (word: string): string => {
    return word
        .replace(/[-–—]/g, '')
        .replace(/[^a-zA-Z0-9''.,!?]/g, '')
        .trim();
};

export function RSVPReader({ initialContent }: RSVPReaderProps) {
    const router = useRouter();
    const [content, setContent] = useState(initialContent || '');
    const [speedMode, setSpeedMode] = useState<SpeedMode>('linear');
    const [startWPM, setStartWPM] = useState(300);
    const [endWPM, setEndWPM] = useState(600);
    const [isGenerated, setIsGenerated] = useState(false);

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

    const handleGenerate = () => setIsGenerated(true);

    const handleStart = () => {
        const settings = { content, speedMode, startWPM, endWPM };
        sessionStorage.setItem('rsvp-settings', JSON.stringify(settings));
        router.push('/app/player');
    };

    const wordCount = content.trim().split(/\s+/).filter(w => w.length > 0).length;
    const readTime = wordCount > 0 ? Math.ceil(wordCount / ((startWPM + endWPM) / 2)) : 0;

    const examples = EXAMPLE_TEXTS.slice(0, 4);

    return (
        <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Georgia, serif' }}>
            {/* Header */}
            <nav className="px-8 py-6 flex items-center justify-between border-b border-neutral-800">
                <Link href="/" className="font-logo text-lg text-[#E07A5F]">curt</Link>
                <div className="flex items-center gap-6 text-sm">
                    <Link href="/daily" className="text-neutral-400 hover:text-white transition-colors">Daily</Link>
                    <Link href="/archive" className="text-neutral-400 hover:text-white transition-colors">Archive</Link>
                </div>
            </nav>

            <main className="max-w-3xl mx-auto px-8 py-12">

                {/* Title */}
                <div className="mb-8">
                    <h1 className="text-2xl font-normal mb-2">New Reading</h1>
                    <p className="text-neutral-500 text-sm">Paste text below or select an example.</p>
                </div>

                {/* Mode selector */}
                <div className="flex gap-6 mb-6 text-sm border-b border-neutral-800">
                    <button
                        onClick={() => setSpeedMode('linear')}
                        className={cn(
                            "pb-3 border-b-2 -mb-px transition-colors",
                            speedMode === 'linear'
                                ? "border-[#E07A5F] text-white"
                                : "border-transparent text-neutral-500 hover:text-neutral-300"
                        )}
                    >
                        Linear
                    </button>
                    <button
                        onClick={() => setSpeedMode('block')}
                        className={cn(
                            "pb-3 border-b-2 -mb-px transition-colors",
                            speedMode === 'block'
                                ? "border-[#E07A5F] text-white"
                                : "border-transparent text-neutral-500 hover:text-neutral-300"
                        )}
                    >
                        Block
                    </button>
                </div>

                {/* Text area */}
                {!isGenerated ? (
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Paste your text here..."
                        className="w-full h-64 p-4 text-lg leading-relaxed resize-none border border-neutral-800 focus:outline-none focus:border-neutral-600 bg-neutral-900 text-white placeholder:text-neutral-600"
                        style={{ fontFamily: 'Georgia, serif' }}
                    />
                ) : (
                    <div className="w-full min-h-64 p-4 text-lg leading-relaxed border border-neutral-800 overflow-auto bg-neutral-900" style={{ fontFamily: 'Georgia, serif' }}>
                        {processText(content).map((w, i) => {
                            const words = processText(content);
                            const position = words.length > 1 ? i / (words.length - 1) : 0;
                            // Distinct colors for each speed tier - soft but clearly different
                            const speedColors = [
                                'rgba(96, 165, 250, 0.35)',   // Blue - 300 wpm
                                'rgba(45, 212, 191, 0.35)',   // Teal - 450 wpm
                                'rgba(250, 204, 21, 0.35)',   // Yellow - 600 wpm
                                'rgba(251, 146, 60, 0.35)',   // Orange - 750 wpm
                                'rgba(244, 114, 182, 0.35)',  // Pink - 900 wpm
                            ];
                            let bgColor: string;
                            if (speedMode === 'linear') {
                                const colorIndex = Math.min(Math.floor(position * speedColors.length), speedColors.length - 1);
                                bgColor = speedColors[colorIndex];
                            } else {
                                const speedIndex = w.wpm <= 300 ? 0 : w.wpm <= 450 ? 1 : w.wpm <= 600 ? 2 : w.wpm <= 750 ? 3 : 4;
                                bgColor = speedColors[speedIndex];
                            }
                            return (
                                <span key={i}>
                                    <span style={{ backgroundColor: bgColor }} className="px-0.5 rounded">
                                        {w.word}
                                    </span>
                                    {' '}
                                </span>
                            );
                        })}
                    </div>
                )}

                {/* Speed controls */}
                {speedMode === 'linear' && !isGenerated && (
                    <div className="mt-4 p-4 border border-neutral-800 text-sm flex items-center gap-4">
                        <span className="text-neutral-500">Speed:</span>
                        <input
                            type="number"
                            value={startWPM}
                            onChange={(e) => setStartWPM(parseInt(e.target.value) || 100)}
                            className="w-16 px-2 py-1 text-center border border-neutral-700 focus:outline-none focus:border-neutral-500 bg-neutral-900 text-white"
                        />
                        <span className="text-neutral-500">→</span>
                        <input
                            type="number"
                            value={endWPM}
                            onChange={(e) => setEndWPM(parseInt(e.target.value) || 200)}
                            className="w-16 px-2 py-1 text-center border border-neutral-700 focus:outline-none focus:border-neutral-500 bg-neutral-900 text-white"
                        />
                        <span className="text-neutral-500">wpm</span>
                    </div>
                )}

                {/* Stats & Actions */}
                <div className="mt-4 p-4 border border-neutral-800 flex items-center justify-between">
                    <div className="text-sm text-neutral-500">
                        {wordCount} words · ~{readTime} min
                    </div>
                    <div className="flex gap-3">
                        {isGenerated && (
                            <button
                                onClick={() => setIsGenerated(false)}
                                className="px-4 py-2 text-sm border border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:text-white transition-colors"
                            >
                                Edit
                            </button>
                        )}
                        <button
                            onClick={isGenerated ? handleStart : handleGenerate}
                            disabled={!content.trim()}
                            className="px-4 py-2 text-sm bg-[#E07A5F] text-black disabled:opacity-30 hover:bg-[#d66b50] transition-colors"
                        >
                            {isGenerated ? 'Start →' : 'Preview'}
                        </button>
                    </div>
                </div>

                {/* Examples */}
                {!isGenerated && (
                    <div className="mt-12">
                        <h2 className="text-xs font-normal mb-4 text-neutral-500 uppercase tracking-wide">
                            Examples
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            {examples.map((ex, i) => (
                                <button
                                    key={i}
                                    onClick={() => setContent(ex.content)}
                                    className="text-left p-4 border border-neutral-800 hover:border-neutral-600 transition-colors"
                                >
                                    <div className="font-normal text-sm mb-1 text-white">{ex.title}</div>
                                    <div className="text-xs text-neutral-500 line-clamp-2">
                                        {ex.preview}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
