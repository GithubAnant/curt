"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Demo words
const DEMO_WORDS = [
  'Welcome', 'to', 'Curt.', 'This', 'is', 'RSVP', 'reading.',
  'Words', 'appear', 'one', 'at', 'a', 'time.',
  'Your', 'eyes', 'stay', 'still.', 'Focus', 'on', 'the', 'red', 'letter.',
];

const SPEED_THRESHOLDS = [
  { index: 0, wpm: 300 },
  { index: 8, wpm: 350 },
  { index: 15, wpm: 400 },
];

export default function LandingPage() {
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
  const orpIndex = currentWord.length <= 3 ? 0 : Math.floor(currentWord.length / 3);
  const leftPart = currentWord.slice(0, orpIndex);
  const centerChar = currentWord[orpIndex] || '';
  const rightPart = currentWord.slice(orpIndex + 1);

  return (
    <div className="min-h-screen bg-white text-black">

      {/* Nav */}
      <nav className="px-8 py-6 flex items-center justify-between">
        <span className="font-logo text-2xl tracking-tight">curt</span>
        <div className="flex items-center gap-8 text-sm">
          <Link href="/daily" className="hover:underline">Daily</Link>
          <Link href="/archive" className="hover:underline">Archive</Link>
          <Link href="/app" className="hover:underline font-medium">Open App →</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-8 pt-16 pb-12">
        <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl leading-[1.1] tracking-tight mb-6">
          Speed reading,<br />
          <span className="italic">simplified.</span>
        </h1>
        <p className="text-xl text-neutral-500 max-w-lg">
          Train your brain to read faster. One word at a time.
        </p>
      </section>

      {/* RSVP Demo - The original dark reader with gray borders */}
      <section className="max-w-5xl mx-auto px-8 pb-20">
        <div className="relative bg-black overflow-hidden">

          {/* Top border line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-neutral-700"></div>

          {/* Left vertical line */}
          <div className="absolute top-0 bottom-0 left-1/4 w-px bg-neutral-800"></div>

          {/* Center vertical line (top) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-8 bg-neutral-700"></div>

          {/* Right vertical line */}
          <div className="absolute top-0 bottom-0 right-1/4 w-px bg-neutral-800"></div>

          {/* The word display */}
          <div className="py-20 flex items-center justify-center">
            <div className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight">
              <span className="text-neutral-500">{leftPart}</span>
              <span className="text-red-500">{centerChar}</span>
              <span className="text-neutral-500">{rightPart}</span>
            </div>
          </div>

          {/* Bottom section with lines */}
          <div className="absolute bottom-0 left-0 right-0">
            {/* Horizontal line */}
            <div className="h-px bg-neutral-700"></div>

            {/* Bottom bar */}
            <div className="h-10 bg-black flex items-center justify-between px-6">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                <span className="text-xs text-neutral-600 font-mono uppercase tracking-wider">Signal: Stable</span>
              </div>
              <span className="text-xs text-neutral-500 font-mono">{demoWPM} wpm</span>
            </div>
          </div>

          {/* Center vertical line (bottom) */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-px h-8 bg-neutral-700"></div>
        </div>
      </section>

      {/* Simple CTA */}
      <section className="max-w-5xl mx-auto px-8 pb-20">
        <div className="flex items-center gap-6">
          <Link
            href="/app"
            className="px-8 py-4 bg-black text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
          >
            Start Reading
          </Link>
          <Link
            href="/daily"
            className="text-sm underline"
          >
            Try today's challenge
          </Link>
        </div>
      </section>

      {/* Features - simple list */}
      <section className="border-t border-neutral-200 py-16">
        <div className="max-w-5xl mx-auto px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <h3 className="font-medium mb-2">One word at a time</h3>
              <p className="text-sm text-neutral-500">RSVP technology eliminates eye movement, letting you focus purely on comprehension.</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Progressive speed</h3>
              <p className="text-sm text-neutral-500">Start slow, finish fast. Your reading speed increases as you go.</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Daily practice</h3>
              <p className="text-sm text-neutral-500">New text every day. Build a streak. Track your progress.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 py-8">
        <div className="max-w-5xl mx-auto px-8 text-sm text-neutral-500">
          © 2026 curt
        </div>
      </footer>
    </div>
  );
}
