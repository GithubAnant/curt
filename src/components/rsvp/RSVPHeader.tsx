import Link from 'next/link';
import React from 'react';

export const RSVPHeader = () => {
    return (
        <nav className="px-8 py-6 flex items-center justify-between border-b border-neutral-800">
            <Link href="/" className="font-logo text-lg text-[#E07A5F]">curt</Link>
            <div className="flex items-center gap-6 text-sm">
                <Link href="/daily" className="text-neutral-400 hover:text-white transition-colors">Daily</Link>
                <Link href="/archive" className="text-neutral-400 hover:text-white transition-colors">Archive</Link>
            </div>
        </nav>
    );
};
