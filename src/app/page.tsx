"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { RSVPDisplay } from '@/components/rsvp/RSVPDisplay';

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

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Georgia, serif' }}>

      {/* Nav */}
      <nav className="px-8 py-6 flex items-center justify-between">
        <span className="font-logo text-xl tracking-tight text-[#E07A5F]">curt</span>
        <Link
          href="/app"
          className="text-sm text-neutral-400 hover:text-[#E07A5F] transition-colors"
        >
          Open App →
        </Link>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-8 pt-16 pb-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight mb-6">
          Speed reading,
          <span className="italic text-[#E07A5F]"> simplified.</span>
        </h1>
        <p className="text-lg text-neutral-500 max-w-lg">
          Train your brain to read faster.
        </p>
      </section>

      {/* RSVP Demo - Using the RSVPDisplay component */}
      <section className="max-w-5xl mx-auto px-8 pb-4">
        <div className="relative border border-neutral-800 overflow-hidden">
          <RSVPDisplay word={currentWord} wpm={demoWPM} isDark={true} />
        </div>
      </section>

      {/* Simple CTA */}
      <section className="max-w-5xl mx-auto px-8 pb-20">
        <Link
          href="/app"
          className="inline-block px-8 py-4 bg-[#E07A5F] text-black text-sm font-medium hover:bg-[#d66b50] transition-colors"
        >
          Start Reading
        </Link>
      </section>

      {/* Features - simple list */}
      <section className="border-t border-neutral-800 py-16">
        <div className="max-w-5xl mx-auto px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <h3 className="font-normal mb-2 text-white">One word at a time</h3>
              <p className="text-sm text-neutral-500">RSVP technology eliminates eye movement, letting you focus purely on comprehension.</p>
            </div>
            <div>
              <h3 className="font-normal mb-2 text-white">Progressive speed</h3>
              <p className="text-sm text-neutral-500">Start slow, finish fast. Your reading speed increases as you go.</p>
            </div>
            <div>
              <h3 className="font-normal mb-2 text-white">Paste anything</h3>
              <p className="text-sm text-neutral-500">Articles, books, notes. Paste any text and start reading immediately.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800 py-6">
        <div className="max-w-5xl mx-auto px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-neutral-500">
          <span><span className="text-[#E07A5F]">curt</span> · Can U Read This · <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Open Source</a></span>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
