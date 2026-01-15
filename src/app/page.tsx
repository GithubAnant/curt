"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Demo words that will flash on the landing page
const DEMO_WORDS = ['can', 'you', 'read', 'this', 'fast?'];

export default function LandingPage() {
  const [demoIndex, setDemoIndex] = useState(0);
  const [demoWPM, setDemoWPM] = useState(300);
  const [isDark, setIsDark] = useState(true);

  // Animate demo words
  useEffect(() => {
    const interval = setInterval(() => {
      setDemoIndex(prev => {
        if (prev >= DEMO_WORDS.length - 1) {
          setDemoWPM(w => w >= 900 ? 300 : w + 200);
          return 0;
        }
        return prev + 1;
      });
    }, 60000 / demoWPM);

    return () => clearInterval(interval);
  }, [demoWPM]);

  const currentWord = DEMO_WORDS[demoIndex];
  const orpIndex = currentWord.length <= 3 ? 1 : 2;
  const leftPart = currentWord.slice(0, orpIndex);
  const centerChar = currentWord[orpIndex];
  const rightPart = currentWord.slice(orpIndex + 1);

  // Theme toggle - anchor letter concept
  const ThemeToggle = () => (
    <button
      onClick={() => setIsDark(!isDark)}
      className="fixed top-6 right-6 z-50 cursor-pointer"
      style={{ fontFamily: 'Georgia, serif' }}
    >
      <span className="text-2xl font-normal text-[#E07A5F] transition-colors">
        {isDark ? 'd' : 'l'}
      </span>
    </button>
  );

  return (
    <div className={cn(
      "min-h-screen overflow-hidden transition-colors",
      isDark ? "bg-black text-white" : "bg-white text-black"
    )}>
      <ThemeToggle />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 px-8 py-6">
        <div className={cn(
          "text-sm tracking-[0.2em] uppercase",
          isDark ? "text-neutral-500" : "text-neutral-400"
        )}>
          CURT
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

        {/* Vertical Guide - split into two segments to avoid gap */}
        <div className={cn(
          "absolute left-1/2 -translate-x-1/2 w-px",
          isDark ? "bg-neutral-700" : "bg-neutral-300"
        )} style={{ top: 'calc(50% - 100px)', height: '50px' }} />
        <div className={cn(
          "absolute left-1/2 -translate-x-1/2 w-px",
          isDark ? "bg-neutral-700" : "bg-neutral-300"
        )} style={{ top: 'calc(50% + 50px)', height: '50px' }} />

        {/* Demo Word Display */}
        <div
          className="flex items-baseline justify-center text-6xl md:text-7xl lg:text-8xl"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          <span className={cn(
            "min-w-[120px] text-right pr-px",
            isDark ? "text-white" : "text-black"
          )}>
            {leftPart}
          </span>
          <span className="text-[#E07A5F]">
            {centerChar}
          </span>
          <span className={cn(
            "min-w-[120px] text-left pl-px",
            isDark ? "text-white" : "text-black"
          )}>
            {rightPart}
          </span>
        </div>

        {/* Speed Indicator */}
        <div
          className={cn(
            "absolute bottom-1/3 right-12 text-lg",
            isDark ? "text-neutral-600" : "text-neutral-400"
          )}
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {demoWPM} wpm
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
              )}>900+</div>
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
          <span>CURT v1.0</span>
          <span>Can You Read This?</span>
        </div>
      </footer>
    </div>
  );
}
