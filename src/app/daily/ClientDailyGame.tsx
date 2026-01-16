"use client";

import React, { useState, useEffect } from 'react';
import GameReader from "@/components/daily/GameReader";
import Link from 'next/link';

interface DailyGameProps {
    dailyText: {
        id: number;
        title?: string | null;
        content: string;
    };
}

import DailyGameResult from "@/components/daily/DailyGameResult";
import OnboardingModal from "@/components/daily/OnboardingModal";

const ONBOARDING_KEY = "hasSeenOnboarding";

export default function ClientDailyGame({ dailyText }: DailyGameProps) {
    const [isCompleted, setIsCompleted] = useState(false);
    const [wpm, setWpm] = useState(0);
    const [showOnboarding, setShowOnboarding] = useState(false);

    useEffect(() => {
        const hasSeen = localStorage.getItem(ONBOARDING_KEY);
        if (!hasSeen) {
            setShowOnboarding(true);
        }
    }, []);

    const handleOnboardingComplete = () => {
        localStorage.setItem(ONBOARDING_KEY, "true");
        setShowOnboarding(false);
    };

    const handleComplete = (achievedWpm: number) => {
        // Save to localStorage for archive (no auth needed)
        const archive = JSON.parse(localStorage.getItem('curt-archive') || '[]');
        archive.push({
            date: new Date().toISOString().split('T')[0],
            textId: dailyText.id,
            title: dailyText.title,
            wpm: achievedWpm
        });
        localStorage.setItem('curt-archive', JSON.stringify(archive));

        setWpm(achievedWpm);
        setIsCompleted(true);
    };

    if (isCompleted) {
        return <DailyGameResult wpm={wpm} dailyText={dailyText} />;
    }

    return (
        <>
            {showOnboarding && (
                <OnboardingModal onComplete={handleOnboardingComplete} />
            )}

            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-normal mb-2 text-white">Today's Challenge</h1>
                    <p className="text-neutral-500 text-sm">Focus on the red letter. Don't move your eyes.</p>
                </div>

                <GameReader
                    content={dailyText.content || ""}
                    onComplete={handleComplete}
                />
            </div>
        </>
    );
}
