"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Demo words - Clear, educational, and naturally flowing
const DEMO_WORDS = [
  // Intro (250 WPM)
  'Welcome', 'to', 'Curt', '-', 'the', 'future', 'of', 'reading.',
  'This', 'is', 'a', 'demonstration', 'of', 'Rapid', 'Serial', 'Visual', 'Presentation.',
  'By', 'displaying', 'words', 'one', 'at', 'a', 'time,',
  'we', 'eliminate', 'the', 'need', 'for', 'your', 'eyes', 'to', 'move.',

  // Saccades (300 WPM)
  'Traditional', 'reading', 'requires', 'your', 'eyes', 'to', 'make', 'small', 'jumps',
  'called', 'saccades', 'across', 'every', 'line', 'of', 'text.',
  'These', 'jumps', 'waste', 'precious', 'time', 'and', 'cause', 'fatigue.',
  'With', 'Curt,', 'your', 'eyes', 'stay', 'perfectly', 'still.',

  // Comfort & ORP (350 WPM)
  'Notice', 'the', 'red', 'highlighted', 'letter', 'in', 'the', 'center.',
  'This', 'is', 'the', 'Optimal', 'Recognition', 'Point.',
  'It', 'anchors', 'your', 'gaze,', 'allowing', 'your', 'brain',
  'to', 'recognize', 'words', 'instantly', 'without', 'scanning.',

  // Flow (400 WPM)
  'As', 'you', 'continue', 'watching,', 'you', 'might', 'notice',
  'that', 'the', 'speed', 'is', 'gradually', 'increasing.',
  'Yet', 'your', 'comprehension', 'remains', 'high.',
  'This', 'is', 'because', 'your', 'brain', 'processes', 'visual', 'information',
  'much', 'faster', 'than', 'you', 'can', 'speak.',

  // Subvocalization (450 WPM)
  'Most', 'people', 'have', 'a', 'habit', 'called', 'subvocalization',
  '-', 'identifying', 'words', 'by', 'saying', 'them', 'in', 'their', 'head.',
  'This', 'inner', 'voice', 'limits', 'your', 'reading', 'speed',
  'to', 'how', 'fast', 'you', 'can', 'talk.',
  'But', 'your', 'brain', 'can', 'go', 'much', 'faster.',

  // Speed Up (500 WPM)
  'By', 'letting', 'go', 'of', 'that', 'inner', 'voice',
  'and', 'trusting', 'your', 'eyes,',
  'you', 'can', 'absorb', 'information', 'directly', 'as', 'pure', 'meaning.',
  'This', 'state', 'of', 'flow', 'makes', 'reading', 'feel', 'effortless.',

  // Challenge (600 WPM)
  'We', 'are', 'now', 'reading', 'at', 'double', 'the', 'average', 'speed.',
  'Imagine', 'finishing', 'a', 'novel', 'in', 'a', 'single', 'afternoon,',
  'or', 'breezing', 'through', 'articles', 'and', 'documents',
  'in', 'just', 'a', 'fraction', 'of', 'the', 'time.',

  // Advanced (700 WPM)
  'Your', 'brain', 'is', 'neuroplastic', 'and', 'adapts', 'quickly.',
  'Practice', 'with', 'this', 'tool', 'daily',
  'and', 'speeds', 'that', 'seem', 'impossible', 'now',
  'will', 'soon', 'feel', 'completely', 'natural',
  'and', 'comfortable.',

  // Mastery (800 WPM)
  'You', 'are', 'streaming', 'knowledge', 'directly', 'into', 'your', 'mind.',
  'Efficiency,', 'focus,', 'and', 'retention', 'all', 'improve',
  'when', 'you', 'remove', 'the', 'friction', 'of', 'eye', 'movement.',

  // Limit (900 WPM)
  'Welcome', 'to', 'your', 'new', 'reading', 'superpower.',
  'Start', 'your', 'training', 'today', 'with', 'Curt',
  'and', 'unlock', 'your', 'full', 'potential.',
];

// Speed thresholds - Gradual increase mapped to new text
const SPEED_THRESHOLDS = [
  { index: 0, wpm: 250 },     // Intro
  { index: 30, wpm: 300 },    // Saccades start
  { index: 60, wpm: 350 },    // Comfort start
  { index: 90, wpm: 400 },    // Flow start
  { index: 120, wpm: 450 },   // Subvocalization
  { index: 150, wpm: 500 },   // Speed Up
  { index: 180, wpm: 600 },   // Challenge
  { index: 210, wpm: 700 },   // Advanced
  { index: 235, wpm: 800 },   // Mastery
  { index: 255, wpm: 900 },   // Limit
];

export default function LandingPage() {
  const [demoIndex, setDemoIndex] = useState(0);
  const [isDark, setIsDark] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  // Calculate current WPM based on word position
  const getCurrentWPM = (index: number) => {
    let wpm = 300;
    for (const threshold of SPEED_THRESHOLDS) {
      if (index >= threshold.index) {
        wpm = threshold.wpm;
      }
    }
    return wpm;
  };

  const demoWPM = getCurrentWPM(demoIndex);

  // Animate demo words - gradual speed increase with loop
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

  // Restart demo
  const restartDemo = () => {
    setDemoIndex(0);
    setIsComplete(false);
  };

  const currentWord = DEMO_WORDS[demoIndex];
  const orpIndex = currentWord.length <= 3 ? 1 : 2;
  const leftPart = currentWord.slice(0, orpIndex);
  const centerChar = currentWord[orpIndex];
  const rightPart = currentWord.slice(orpIndex + 1);

  return (
    <div className={cn(
      "min-h-screen overflow-hidden transition-colors",
      isDark ? "bg-black text-white" : "bg-white text-black"
    )}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 px-8 py-6 flex items-center justify-between">
        <div className={cn(
          "text-sm tracking-[0.2em] uppercase",
          isDark ? "text-neutral-500" : "text-neutral-400"
        )}>
          CURT
        </div>
        <div className="flex items-center gap-6">
          <a
            href="https://github.com/GithubAnant/curt"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "text-xs tracking-wide transition-colors",
              isDark ? "text-neutral-600 hover:text-white" : "text-neutral-400 hover:text-black"
            )}
          >
            open source
          </a>
          <button
            onClick={() => setIsDark(!isDark)}
            className="cursor-pointer"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            <span className="text-xl font-normal text-[#E07A5F] transition-colors">
              {isDark ? 'd' : 'l'}
            </span>
          </button>
        </div>
      </nav>

      {/* Hero - Full Screen RSVP Demo */}
      <section className="h-screen flex flex-col items-center justify-center relative">
        {/* Horizontal Lines */}
        <div className={cn(
          "absolute top-1/2 -translate-y-[100px] left-0 right-0 h-px",
          isDark ? "bg-neutral-800" : "bg-neutral-200"
        )} />
        <div className={cn(
          "absolute top-1/2 translate-y-[100px] left-0 right-0 h-px",
          isDark ? "bg-neutral-800" : "bg-neutral-200"
        )} />

        {/* Vertical Guide - split into two segments */}
        <div className={cn(
          "absolute left-1/2 -translate-x-1/2 w-px",
          isDark ? "bg-neutral-700" : "bg-neutral-300"
        )} style={{ top: 'calc(50% - 100px)', height: '50px' }} />
        <div className={cn(
          "absolute left-1/2 -translate-x-1/2 w-px",
          isDark ? "bg-neutral-700" : "bg-neutral-300"
        )} style={{ top: 'calc(50% + 50px)', height: '50px' }} />

        {/* Demo Word Display - anchor letter fixed at center */}
        <div
          className="flex items-baseline justify-center text-6xl md:text-7xl lg:text-8xl"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {/* Left part - fixed width, right-aligned */}
          <span className={cn(
            "w-[200px] md:w-[280px] text-right",
            isDark ? "text-white" : "text-black"
          )}>
            {leftPart}
          </span>
          {/* Center anchor letter - just colored differently */}
          <span className="text-[#E07A5F]">
            {centerChar}
          </span>
          {/* Right part - fixed width, left-aligned */}
          <span className={cn(
            "w-[200px] md:w-[280px] text-left",
            isDark ? "text-white" : "text-black"
          )}>
            {rightPart}
          </span>
        </div>

        {/* Replay button when demo is complete */}
        {isComplete && (
          <button
            onClick={restartDemo}
            className={cn(
              "absolute top-1/2 translate-y-[60px] left-1/2 -translate-x-1/2 text-sm cursor-pointer transition-colors",
              isDark ? "text-neutral-600 hover:text-white" : "text-neutral-400 hover:text-black"
            )}
          >
            ↻ replay
          </button>
        )}

        {/* Current WPM Display */}
        <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 flex items-center gap-2">
          <span
            className={cn(
              "text-lg tabular-nums",
              isDark ? "text-neutral-500" : "text-neutral-500"
            )}
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {demoWPM}
          </span>
          <span className={cn(
            "text-xs",
            isDark ? "text-neutral-600" : "text-neutral-400"
          )}>wpm</span>
        </div>

        {/* CTA at bottom */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6">
          <p className={cn(
            "text-center max-w-md",
            isDark ? "text-neutral-500" : "text-neutral-600"
          )}>
            Speed reading through Rapid Serial Visual Presentation.
            <br />
            Train from 300 to 900+ WPM.
          </p>
          <Link
            href="/app"
            className={cn(
              "inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium transition-colors group",
              isDark
                ? "bg-white text-black hover:bg-neutral-200"
                : "bg-black text-white hover:bg-neutral-800"
            )}
          >
            Start Reading
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Minimal Info Section */}
      <section className={cn(
        "py-32 px-8 border-t",
        isDark ? "border-neutral-900" : "border-neutral-100"
      )}>
        <div className="max-w-2xl mx-auto">
          <p
            className={cn(
              "text-2xl md:text-3xl leading-relaxed font-light",
              isDark ? "text-neutral-300" : "text-neutral-700"
            )}
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Your eyes spend 80% of reading time moving between words.
            RSVP eliminates this by showing words at a fixed point.
            The <span className="text-[#E07A5F]">anchor letter</span> stays
            centered, letting your brain process faster.
          </p>

          <div className={cn(
            "mt-12 flex gap-12 text-sm",
            isDark ? "text-neutral-500" : "text-neutral-600"
          )}>
            <div>
              <div className={cn(
                "text-2xl mb-1",
                isDark ? "text-white" : "text-black"
              )}>2×</div>
              <div>Average speed increase</div>
            </div>
            <div>
              <div className={cn(
                "text-2xl mb-1",
                isDark ? "text-white" : "text-black"
              )}>900</div>
              <div>WPM achievable</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={cn(
        "py-8 px-8 border-t",
        isDark ? "border-neutral-900" : "border-neutral-100"
      )}>
        <div className={cn(
          "max-w-5xl mx-auto flex items-center justify-between text-xs tracking-wide",
          isDark ? "text-neutral-600" : "text-neutral-400"
        )}>
          <span>Can U Read This? · CURT v1.0</span>
          <a
            href="https://github.com/GithubAnant/curt"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "transition-colors",
              isDark ? "hover:text-white" : "hover:text-black"
            )}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
        </div>
      </footer>
    </div>
  );
}
