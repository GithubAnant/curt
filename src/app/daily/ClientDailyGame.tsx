"use client";

import React, { useState, useEffect } from 'react';
import GameReader from "@/components/daily/GameReader";
import Link from 'next/link';

interface DailyGameProps {
    dailyText: {
        id: string;
        title?: string;
        content: string;
    };
}

const ONBOARDING_KEY = "hasSeenOnboarding";

function OnboardingModal({ onComplete }: { onComplete: () => void }) {
    const [step, setStep] = useState(1);

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            onComplete();
        }
    };

    const steps = [
        {
            title: "Welcome to curt",
            text: "A daily speed reading game. Train your brain to read faster."
        },
        {
            title: "How it works",
            text: "Words appear one at a time. The red letter is your focus point. Don't move your eyes."
        },
        {
            title: "Ready?",
            text: "Complete today's text to see your reading speed. New challenge every day."
        }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 p-6">
            <div className="w-full max-w-sm border border-neutral-200">

                {/* Progress */}
                <div className="flex">
                    {[1, 2, 3].map(n => (
                        <div
                            key={n}
                            className={`flex-1 h-1 ${n <= step ? 'bg-black' : 'bg-neutral-200'}`}
                        />
                    ))}
                </div>

                <div className="p-8 text-center">
                    <h2 className="text-xl font-medium mb-4">{steps[step - 1].title}</h2>
                    <p className="text-neutral-500 mb-8">
                        {steps[step - 1].text}
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={onComplete}
                            className="flex-1 py-3 text-sm text-neutral-500 hover:underline"
                        >
                            Skip
                        </button>
                        <button
                            onClick={handleNext}
                            className="flex-1 py-3 text-sm bg-black text-white font-medium"
                        >
                            {step === 3 ? "Start" : "Next"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

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
        return (
            <div className="max-w-sm mx-auto mt-16 border border-neutral-200">
                <div className="p-8 text-center border-b border-neutral-200">
                    <div className="text-6xl font-medium mb-2">{wpm}</div>
                    <div className="text-neutral-500 text-sm">words per minute</div>
                </div>

                <div className="p-6 text-center">
                    <div className="text-sm font-medium mb-1">{dailyText.title || "Today's Reading"}</div>
                    <div className="text-xs text-neutral-500 line-clamp-2">
                        {dailyText.content.slice(0, 100)}...
                    </div>
                </div>

                <div className="border-t border-neutral-200 p-4 flex gap-3">
                    <Link
                        href="/archive"
                        className="flex-1 py-2 text-center text-sm border border-neutral-200 hover:bg-neutral-50"
                    >
                        Archive
                    </Link>
                    <Link
                        href="/app"
                        className="flex-1 py-2 text-center text-sm bg-black text-white"
                    >
                        Practice
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            {showOnboarding && (
                <OnboardingModal onComplete={handleOnboardingComplete} />
            )}

            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-medium mb-2">Today's Challenge</h1>
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
