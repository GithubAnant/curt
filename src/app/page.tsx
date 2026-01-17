"use client";

import React from 'react';
import Link from 'next/link';
import LandingHero from '@/components/landing/LandingHero';
import LandingDemo from '@/components/landing/LandingDemo';
import LandingFeatures from '@/components/landing/LandingFeatures';
import LandingFooter from '@/components/landing/LandingFooter';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Georgia, serif' }}>

      {/* Nav */}
      <nav className="px-8 py-6 flex items-center justify-between">
        <span className="font-logo text-xl tracking-tight text-[#E07A5F]">curt</span>
        <Link
          href="https://github.com/GithubAnant/curt"
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-500 hover:text-white transition-colors text-sm"
        >
          open source
        </Link>
      </nav>

      {/* Hero */}
      <LandingHero />

      {/* Demo + CTA */}
      <LandingDemo />

      {/* Features */}
      <LandingFeatures />

      {/* Footer */}
      <LandingFooter />

    </div>
  );
}
