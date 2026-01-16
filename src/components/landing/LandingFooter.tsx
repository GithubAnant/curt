import React from 'react';
import Link from 'next/link';

export default function LandingFooter() {
    return (
        <footer className="border-t border-neutral-800 py-6">
            <div className="max-w-5xl mx-auto px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-neutral-500">
                <span><span className="text-[#E07A5F]">curt</span> · Can U Read This · <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Open Source</a></span>
                <div className="flex items-center gap-4">
                    <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                    <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                </div>
            </div>
        </footer>
    );
}
