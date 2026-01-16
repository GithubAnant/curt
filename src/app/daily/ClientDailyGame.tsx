"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { saveReading } from "@/app/actions/game";
import GameReader from "@/components/daily/GameReader";
import { ArrowRight, Trophy } from 'lucide-react';
import Link from 'next/link';

interface DailyGameProps {
    dailyText: any;
    previousReading: any;
}

export default function ClientDailyGame({ dailyText, previousReading }: DailyGameProps) {
    const [isCompleted, setIsCompleted] = useState(!!previousReading);
    const [wpm, setWpm] = useState(previousReading?.wpmAchieved || 0);

    const handleComplete = async (achievedWpm: number) => {
        await saveReading(dailyText.id, achievedWpm);
        setWpm(achievedWpm);
        setIsCompleted(true);
    };

    if (isCompleted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md mx-auto mt-20 p-8 rounded-3xl bg-neutral-900 border border-white/10 text-center"
            >
                <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
                <h2 className="text-3xl font-bold mb-2">Daily Completed!</h2>
                <p className="text-neutral-400 mb-8">You read today's text at</p>

                <div className="text-6xl font-bold text-[#E07A5F] mb-8">
                    {wpm} <span className="text-xl text-neutral-500">WPM</span>
                </div>

                <div className="p-4 rounded-xl bg-white/5 mb-8 text-left">
                    <h3 className="text-sm font-medium text-neutral-300 mb-2">{dailyText.title || "Daily Wisdom"}</h3>
                    <p className="text-neutral-500 text-sm line-clamp-3 italic">"{dailyText.content}"</p>
                </div>

                <Link href="/archive" className="w-full py-3 rounded-full bg-white text-black font-medium hover:bg-neutral-200 transition-colors inline-block">
                    View Archive
                </Link>
            </motion.div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto min-h-[80vh] flex flex-col items-center justify-center p-4">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Today's Read</h1>
                <p className="text-neutral-500">Read the text once. No turning back.</p>
            </div>

            <GameReader
                content={dailyText.content || ""}
                onComplete={handleComplete}
            />
        </div>
    );
}
