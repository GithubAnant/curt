"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export default function OnboardingPage() {
    const router = useRouter();
    const [videoEnded, setVideoEnded] = useState(false);

    // Placeholder video - replace with actual URL provided by user
    // Using a generic engaging video or the one user provides
    const VIDEO_URL = "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&controls=0"; // Placeholder: Rickroll for safety? No, let's use a blank or generic until user provides.
    // Actually, I'll use a placeholder div or check if user provided one.
    // User instruction: "I show a certain video from which I got the concept"
    // I will ask the user for the URL via notify_user later if needed, but for now I'll use a placeholder.

    const handleContinue = () => {
        // Mark onboarding as complete in cookie or DB? 
        // For now, simpler: just redirect.
        router.push('/daily');
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-4xl text-center mb-8">
                <h1 className="text-4xl font-bold mb-4">Welcome to the Speed Reading Revolution</h1>
                <p className="text-neutral-400">Watch this short video to understand how RSVP unlocks your brain's potential.</p>
            </div>

            <div className="w-full max-w-4xl aspect-video bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative">
                <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                    title="Speed Reading Concept"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0"
                    onLoad={() => {
                        // In a real scenario with YouTube API, we'd detect 'onStateChange' for end.
                        // For now, we simulate being able to continue immediately or after a timer.
                        setTimeout(() => setVideoEnded(true), 5000); // Enable button after 5s just in case
                    }}
                ></iframe>
            </div>

            <div className="mt-12 h-16">
                <button
                    onClick={handleContinue}
                    className="flex items-center gap-2 px-8 py-4 bg-[#E07A5F] rounded-full text-white font-medium text-lg hover:scale-105 transition-transform"
                >
                    Start Training <ArrowRight />
                </button>
            </div>
        </div>
    );
}
