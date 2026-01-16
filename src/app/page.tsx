"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Demo words - Clear, educational, and naturally flowing
const DEMO_WORDS = [
  'Welcome', 'to', 'Curt', '-', 'the', 'future', 'of', 'reading.',
  'This', 'is', 'a', 'demonstration', 'of', 'Rapid', 'Serial', 'Visual', 'Presentation.',
  'By', 'displaying', 'words', 'one', 'at', 'a', 'time,',
  'we', 'eliminate', 'the', 'need', 'for', 'your', 'eyes', 'to', 'move.',
  'Traditional', 'reading', 'requires', 'your', 'eyes', 'to', 'make', 'small', 'jumps',
  'called', 'saccades', 'across', 'every', 'line', 'of', 'text.',
  'These', 'jumps', 'waste', 'precious', 'time', 'and', 'cause', 'fatigue.',
  'With', 'Curt,', 'your', 'eyes', 'stay', 'perfectly', 'still.',
  'Notice', 'the', 'red', 'highlighted', 'letter', 'in', 'the', 'center.',
  'This', 'is', 'the', 'Optimal', 'Recognition', 'Point.',
  'It', 'anchors', 'your', 'gaze,', 'allowing', 'your', 'brain',
  'to', 'recognize', 'words', 'instantly', 'without', 'scanning.',
];

const SPEED_THRESHOLDS = [
  { index: 0, wpm: 250 },
  { index: 30, wpm: 300 },
  { index: 60, wpm: 350 },
  { index: 90, wpm: 400 },
];

export default function LandingPage() {
  const [demoIndex, setDemoIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Calculate current WPM
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

  // Animate demo words
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
  const orpIndex = currentWord.length <= 3 ? 1 : 2;
  const leftPart = currentWord.slice(0, orpIndex);
  const centerChar = currentWord[orpIndex];
  const rightPart = currentWord.slice(orpIndex + 1);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#E07A5F] selection:text-white overflow-hidden font-sans">

      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -50, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -100, 0], y: [0, 50, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[120px]"
        />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex items-center justify-between backdrop-blur-sm bg-black/10">
        <div className="text-sm tracking-[0.2em] font-bold uppercase header-gradient">CURT</div>
        <div className="flex items-center gap-6">
          <Link href="/auth/login" className="text-sm text-neutral-400 hover:text-white transition-colors">Login</Link>
          <Link
            href="/app"
            className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-sm backdrop-blur-md transition-all"
          >
            Launch App
          </Link>
        </div>
      </nav>

      <main className="relative z-10 container mx-auto px-4 pt-32 pb-20 flex flex-col items-center justify-center min-h-screen text-center">

        {/* Floating Hero Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md"
        >
          <Sparkles size={14} className="text-[#E07A5F]" />
          <span className="text-xs font-medium tracking-wide text-neutral-300">The Future of Reading is Here</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-tight"
        >
          Read at the speed of <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E07A5F] to-purple-500">thought.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-16 leading-relaxed"
        >
          Stop scanning. Start absorbing. CURT uses Rapid Serial Visual Presentation to stream words directly into your brain.
        </motion.p>

        {/* Floating RSVP Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
          className="relative w-full max-w-3xl aspect-[16/9] md:aspect-[21/9] bg-gradient-to-b from-neutral-900/80 to-black/80 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl flex flex-col items-center justify-center overflow-hidden group"
        >
          {/* Glossy Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />

          {/* Reader Interface */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="flex items-baseline text-4xl md:text-6xl font-serif">
              <span className="w-[140px] md:w-[220px] text-right text-neutral-500 mr-1">{leftPart}</span>
              <span className="text-[#E07A5F] font-medium">{centerChar}</span>
              <span className="w-[140px] md:w-[220px] text-left text-neutral-500 ml-1">{rightPart}</span>
            </div>

            {/* WPM Indicator */}
            <div className="mt-8 flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 border border-white/5">
              <Zap size={12} className="text-[#E07A5F]" />
              <span className="text-xs font-mono text-neutral-400">{demoWPM} WPM</span>
            </div>
          </div>

          {/* Vertical Guides */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[2px] h-12 bg-gradient-to-b from-transparent via-[#E07A5F]/50 to-transparent blur-[1px]" />
        </motion.div>


        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col md:flex-row items-center gap-4 mt-16"
        >
          <Link href="/app" className="group relative px-8 py-4 bg-[#E07A5F] rounded-full text-white font-medium text-lg overflow-hidden shadow-lg shadow-[#E07A5F]/25 hover:shadow-[#E07A5F]/50 transition-all hover:scale-105 active:scale-95">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-shimmer" />
            <span className="relative flex items-center gap-2">
              Start Training Now <ArrowRight size={20} />
            </span>
          </Link>
          <Link href="/learn-more" className="px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all text-lg font-medium backdrop-blur-sm">
            How it Works
          </Link>
        </motion.div>

        {/* Feature Grid (Floating) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 w-full max-w-5xl">
          {[
            { title: "Neuroplasticity", icon: Brain, desc: "Rewire your brain for faster processing." },
            { title: "Flow State", icon: Zap, desc: "Enter deep focus effortlessly." },
            { title: "Efficiency", icon: Sparkles, desc: "2x your reading speed in weeks." }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + (i * 0.1) }}
              className="p-8 rounded-3xl bg-neutral-900/30 border border-white/5 hover:border-white/10 transition-colors backdrop-blur-md"
            >
              <feature.icon className="w-10 h-10 text-[#E07A5F] mb-4 mx-auto" />
              <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

      </main>
    </div>
  );
}
