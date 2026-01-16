import React, { useMemo } from 'react';
import { RSVPWord } from '@/hooks/useRSVP';

type SpeedMode = 'linear' | 'block';

const BLOCK_SPEEDS = [300, 450, 600, 750, 900];

const cleanWord = (word: string): string => {
    return word
        .replace(/[-–—]/g, '')
        .replace(/[^a-zA-Z0-9''.,!?]/g, '')
        .trim();
};

interface RSVPInputAreaProps {
    content: string;
    setContent: (content: string) => void;
    isGenerated: boolean;
    speedMode: SpeedMode;
    startWPM: number;
    endWPM: number;
}

export const RSVPInputArea = ({
    content,
    setContent,
    isGenerated,
    speedMode,
    startWPM,
    endWPM
}: RSVPInputAreaProps) => {

    const processedWords: RSVPWord[] = useMemo(() => {
        if (!isGenerated) return [];

        const rawWords = content.split(/\s+/)
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
    }, [content, isGenerated, speedMode, startWPM, endWPM]);


    if (!isGenerated) {
        return (
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your text here..."
                className="w-full h-64 p-4 text-lg leading-relaxed resize-none border border-neutral-800 focus:outline-none focus:border-neutral-600 bg-neutral-900 text-white placeholder:text-neutral-600"
                style={{ fontFamily: 'Georgia, serif' }}
            />
        );
    }

    return (
        <div className="w-full min-h-64 p-4 text-lg leading-relaxed border border-neutral-800 overflow-auto bg-neutral-900" style={{ fontFamily: 'Georgia, serif' }}>
            {processedWords.map((w, i) => {
                const position = processedWords.length > 1 ? i / (processedWords.length - 1) : 0;

                // Distinct colors for each speed tier
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
    );
};
