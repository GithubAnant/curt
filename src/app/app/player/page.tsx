"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useRSVP, RSVPWord } from '@/hooks/useRSVP';
import { cn } from '@/lib/utils';
import { RSVPDisplay } from '@/components/rsvp/RSVPDisplay';
import { PlaybackControls } from '@/components/rsvp/PlaybackControls';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

// Types
type SpeedMode = 'linear' | 'block';
const BLOCK_SPEEDS = [300, 450, 600, 900];

// Clean word helper
const cleanWord = (word: string): string => {
    return word
        .replace(/[-–—]/g, '')
        .replace(/[^a-zA-Z0-9''.,!?]/g, '')
        .trim();
};

export default function PlayerPage() {
    const router = useRouter();
    const [isDark, setIsDark] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Settings from sessionStorage
    const [content, setContent] = useState('');
    const [speedMode, setSpeedMode] = useState<SpeedMode>('linear');
    const [startWPM, setStartWPM] = useState(300);
    const [endWPM, setEndWPM] = useState(900);

    // Load settings from sessionStorage on mount
    useEffect(() => {
        const savedSettings = sessionStorage.getItem('rsvp-settings');
        if (savedSettings) {
            try {
                const settings = JSON.parse(savedSettings);
                setContent(settings.content || '');
                setSpeedMode(settings.speedMode || 'linear');
                setStartWPM(settings.startWPM || 300);
                setEndWPM(settings.endWPM || 900);
                setIsDark(settings.isDark ?? true);
                setIsLoaded(true);
            } catch {
                router.push('/app');
            }
        } else {
            router.push('/app');
        }
    }, [router]);

    // Process text into words with speed assignments
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

    const processedWords = processText(content);

    // RSVP Hook
    const { currentWord, progress, scrub } = useRSVP({
        words: processedWords,
        isPlaying,
        onComplete: () => setIsPlaying(false),
    });

    const currentWPM = currentWord?.wpm || startWPM;

    // Start playing when loaded
    useEffect(() => {
        if (isLoaded && processedWords.length > 0) {
            scrub(0);
            setIsPlaying(true);
        }
    }, [isLoaded, processedWords.length, scrub]);

    // Handle going back to app
    const handleNewText = () => {
        router.push('/app');
    };

    if (!isLoaded) {
        return (
            <div className={cn(
                "w-full h-screen flex items-center justify-center",
                isDark ? "bg-black text-white" : "bg-white text-black"
            )}>
                <span className="text-sm opacity-50">Loading...</span>
            </div>
        );
    }

    return (
        <div className={cn(
            "w-full min-h-screen flex flex-col justify-center relative",
            isDark ? "bg-black" : "bg-white"
        )}>
            <ThemeToggle isDark={isDark} setIsDark={setIsDark} />

            <div className="flex-1 flex items-center justify-center">
                <RSVPDisplay word={currentWord?.word || null} wpm={currentWPM} isDark={isDark} />
            </div>

            <PlaybackControls
                isDark={isDark}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                progress={progress}
                currentWPM={currentWPM}
                speedMode={speedMode}
                processedWordsLength={processedWords.length}
                onScrub={scrub}
                onNewText={handleNewText}
            />
        </div>
    );
}
