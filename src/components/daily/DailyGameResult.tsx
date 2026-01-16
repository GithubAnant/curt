import React from 'react';
import Link from 'next/link';

interface DailyGameResultProps {
    wpm: number;
    dailyText: {
        id: number;
        title?: string | null;
        content: string;
    };
}

export default function DailyGameResult({ wpm, dailyText }: DailyGameResultProps) {
    return (
        <div className="max-w-sm mx-auto mt-16 border border-neutral-700 bg-neutral-900">
            <div className="p-8 text-center border-b border-neutral-700">
                <div className="text-6xl font-normal mb-2 text-[#E07A5F]">{wpm}</div>
                <div className="text-neutral-500 text-sm">words per minute</div>
            </div>

            <div className="p-6 text-center">
                <div className="text-sm font-normal mb-1 text-white">{dailyText.title || "Today's Reading"}</div>
                <div className="text-xs text-neutral-500 line-clamp-2">
                    {dailyText.content.slice(0, 100)}...
                </div>
            </div>

            <div className="border-t border-neutral-700 p-4 flex gap-3">
                <Link
                    href="/"
                    className="flex-1 py-2 text-center text-sm border border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors"
                >
                    Home
                </Link>
                <Link
                    href="/app"
                    className="flex-1 py-2 text-center text-sm bg-[#E07A5F] text-black hover:bg-[#d66b50] transition-colors"
                >
                    Practice
                </Link>
            </div>
        </div>
    );
}
