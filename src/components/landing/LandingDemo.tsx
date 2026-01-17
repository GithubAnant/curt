"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { RSVPDisplay } from '@/components/rsvp/RSVPDisplay';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";

const DEMO_WORDS = [
    'Welcome', 'to', 'curt.', 'This', 'is', 'RSVP', 'reading.',
    'Words', 'appear', 'one', 'at', 'a', 'time.',
    'Your', 'eyes', 'stay', 'still.', 'Focus', 'on', 'the', 'red', 'letter.',
    'This', 'method', 'eliminates', 'eye', 'movements.',
    'It', 'allows', 'you', 'to', 'absorb', 'information', 'much', 'faster.',
    'You', 'are', 'starting', 'to', 'speed', 'up.',
    'The', 'brain', 'adapts', 'quickly', 'to', 'the', 'flow.',
    'Now', 'we', 'are', 'pushing', 'the', 'limits.',
    'You', 'are', 'reading', 'at', '650', 'words', 'per', 'minute.',
    'Imagine', 'finishing', 'a', 'book', 'in', 'hours.',
    'That', 'is', 'the', 'power', 'of', 'curt.'
];

const SPEED_THRESHOLDS = [
    { index: 0, wpm: 300 },
    { index: 7, wpm: 350 },
    { index: 15, wpm: 450 },
    { index: 30, wpm: 550 },
    { index: 45, wpm: 650 },
];

export default function LandingDemo() {
    const [demoIndex, setDemoIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    const getCurrentWPM = (index: number) => {
        let wpm = 300;
        for (const threshold of SPEED_THRESHOLDS) {
            if (index >= threshold.index) wpm = threshold.wpm;
        }
        return wpm;
    };

    const demoWPM = getCurrentWPM(demoIndex);

    useEffect(() => {
        if (isComplete) {
            const timeout = setTimeout(() => {
                setDemoIndex(0);
                setIsComplete(false);
            }, 2000);
            return () => clearTimeout(timeout);
        }

        const interval = setInterval(() => {
            setDemoIndex(prev => {
                if (prev >= DEMO_WORDS.length - 1) {
                    setIsComplete(true);
                    return prev;
                }
                return prev + 1;
            });
        }, 60000 / demoWPM);

        return () => clearInterval(interval);
    }, [demoWPM, isComplete]);

    const currentWord = DEMO_WORDS[demoIndex];

    return (
        <>
            <section className="max-w-5xl mx-auto px-8 pb-4">
                <div className="relative border border-neutral-800 overflow-hidden">
                    <RSVPDisplay word={currentWord} wpm={demoWPM} isDark={true} />
                </div>
            </section>

            <section className="max-w-5xl mx-auto px-8 pb-20">
                <Dialog>
                    <DialogTrigger asChild>
                        <button className="inline-block px-8 py-4 bg-[#E07A5F] text-black text-sm font-medium hover:bg-[#d66b50] transition-colors mb-12">
                            Start Reading
                        </button>
                    </DialogTrigger>
                    <DialogContent className="bg-neutral-900 border-neutral-800 text-white sm:max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-center text-2xl font-normal mb-2" style={{ fontFamily: 'Georgia, serif' }}>Choose Mode</DialogTitle>
                            <DialogDescription className="text-center text-neutral-400 text-base">
                                Select how you want to practice today.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                            <Link href="/daily" className="w-full">
                                <DialogClose asChild>
                                    <button className="w-full h-48 md:h-56 p-6 bg-neutral-800 hover:bg-neutral-700 hover:border-[#E07A5F]/50 transition-all border border-white/5 rounded-xl flex flex-col items-center justify-center text-center group">
                                        <div className="text-xl font-medium mb-3 group-hover:text-[#E07A5F] transition-colors">Daily Challenge</div>
                                        <div className="text-sm text-neutral-400 group-hover:text-neutral-300 leading-relaxed">
                                            Curated daily text with AI generation.
                                            <br />
                                            <span className="text-xs opacity-50 mt-2 block">New text every 24h</span>
                                        </div>
                                    </button>
                                </DialogClose>
                            </Link>
                            <Link href="/app" className="w-full">
                                <DialogClose asChild>
                                    <button className="w-full h-48 md:h-56 p-6 bg-neutral-800 hover:bg-neutral-700 hover:border-[#E07A5F]/50 transition-all border border-white/5 rounded-xl flex flex-col items-center justify-center text-center group">
                                        <div className="text-xl font-medium mb-3 group-hover:text-[#E07A5F] transition-colors">Playground</div>
                                        <div className="text-sm text-neutral-400 group-hover:text-neutral-300 leading-relaxed">
                                            Paste your own text or try examples.
                                            <br />
                                            <span className="text-xs opacity-50 mt-2 block">Standard mode</span>
                                        </div>
                                    </button>
                                </DialogClose>
                            </Link>
                        </div>
                    </DialogContent>
                </Dialog>
            </section>
        </>
    );
}
