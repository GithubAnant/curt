"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RSVPHeader } from './RSVPHeader';
import { RSVPModeSelector } from './RSVPModeSelector';
import { RSVPInputArea } from './RSVPInputArea';
import { RSVPSpeedControls } from './RSVPSpeedControls';
import { RSVPActions } from './RSVPActions';
import { RSVPFloatingExamples } from './RSVPFloatingExamples';

type SpeedMode = 'linear' | 'block';

interface RSVPReaderProps {
    initialContent?: string;
}

export function RSVPReader({ initialContent }: RSVPReaderProps) {
    const router = useRouter();
    const [content, setContent] = useState(initialContent || '');
    const [speedMode, setSpeedMode] = useState<SpeedMode>('linear');
    const [startWPM, setStartWPM] = useState(300);
    const [endWPM, setEndWPM] = useState(600);
    const [isGenerated, setIsGenerated] = useState(false);

    const handleGenerate = () => setIsGenerated(true);

    const handleStart = () => {
        const settings = { content, speedMode, startWPM, endWPM };
        sessionStorage.setItem('rsvp-settings', JSON.stringify(settings));
        router.push('/app/player');
    };

    const wordCount = content.trim().split(/\s+/).filter(w => w.length > 0).length;
    const readTime = wordCount > 0 ? Math.ceil(wordCount / ((startWPM + endWPM) / 2)) : 0;

    return (
        <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Georgia, serif' }}>
            <RSVPHeader />

            <main className="max-w-3xl mx-auto px-8 py-12">
                <div className="mb-8">
                    <h1 className="text-2xl font-normal mb-2">New Reading</h1>
                    <p className="text-neutral-500 text-sm">Paste text below or select an example.</p>
                </div>

                <RSVPModeSelector
                    speedMode={speedMode}
                    setSpeedMode={setSpeedMode}
                />

                <RSVPInputArea
                    content={content}
                    setContent={setContent}
                    isGenerated={isGenerated}
                    speedMode={speedMode}
                    startWPM={startWPM}
                    endWPM={endWPM}
                />

                <RSVPSpeedControls
                    speedMode={speedMode}
                    startWPM={startWPM}
                    endWPM={endWPM}
                    setStartWPM={setStartWPM}
                    setEndWPM={setEndWPM}
                    isGenerated={isGenerated}
                />

                <RSVPActions
                    wordCount={wordCount}
                    readTime={readTime}
                    isGenerated={isGenerated}
                    setIsGenerated={setIsGenerated}
                    handleStart={handleStart}
                    handleGenerate={handleGenerate}
                    content={content}
                />

                <RSVPFloatingExamples
                    isGenerated={isGenerated}
                    setContent={setContent}
                />
            </main>
        </div>
    );
}

