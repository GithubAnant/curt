"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useRSVP, RSVPWord } from '@/hooks/useRSVP';
import { RSVPDisplay } from '@/components/rsvp/RSVPDisplay';
import { PlaybackControls } from '@/components/rsvp/PlaybackControls';

// Types
import { SpeedMode, BLOCK_SPEEDS, calculateWpm } from '@/lib/speed-utils';

// Clean word helper
const cleanWord = (word: string): string => {
    return word
        .replace(/[-–—]/g, '')
        .replace(/[^a-zA-Z0-9''.,!?]/g, '')
        .trim();
};

export default function PlayerPage() {
    const router = useRouter();
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
            const wpm = calculateWpm(speedMode, startWPM, endWPM, i, rawWords.length);
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
        const savedSettings = sessionStorage.getItem('rsvp-settings');
        let returnUrl = '/app';
        if (savedSettings) {
            try {
                const settings = JSON.parse(savedSettings);
                if (settings.returnUrl) returnUrl = settings.returnUrl;
            } catch (e) {
                // ignore
            }
        }
        router.push(returnUrl);
    };

    if (!isLoaded) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-black text-white">
                <span className="text-sm opacity-50" style={{ fontFamily: 'Georgia, serif' }}>Loading...</span>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen flex flex-col justify-center relative bg-black">
            {/* Back Navigation */}
            <button
                onClick={handleNewText}
                className="absolute top-6 left-6 z-50 flex items-center gap-2 text-sm transition-colors text-neutral-500 hover:text-white"
                style={{ fontFamily: 'Georgia, serif' }}
            >
                <span className="text-lg">←</span>
                <span>Back</span>
            </button>

            <div className="flex-1 flex items-center justify-center">
                <RSVPDisplay word={currentWord?.word || null} wpm={currentWPM} isDark={true} />
            </div>

            <PlaybackControls
                isDark={true}
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
