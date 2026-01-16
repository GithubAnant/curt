"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ArchiveEntry {
    date: string;
    textId: string;
    title?: string;
    wpm: number;
}

export default function ArchivePage() {
    const [archive, setArchive] = useState<ArchiveEntry[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('curt-archive');
        if (stored) {
            setArchive(JSON.parse(stored));
        }
    }, []);

    return (
        <div className="min-h-screen bg-white text-black">
            <nav className="px-8 py-6 flex justify-between items-center border-b border-neutral-200">
                <Link href="/" className="font-logo text-lg">curt</Link>
                <div className="flex items-center gap-6 text-sm">
                    <Link href="/daily" className="hover:underline">Daily</Link>
                    <Link href="/app" className="hover:underline">Open App</Link>
                </div>
            </nav>

            <main className="max-w-3xl mx-auto px-8 py-12">
                <h1 className="text-3xl font-medium mb-8">Archive</h1>

                {archive.length === 0 ? (
                    <div className="text-center py-16 border border-neutral-200">
                        <p className="text-neutral-500 mb-4">No readings yet.</p>
                        <Link href="/daily" className="text-sm underline">
                            Complete today's challenge →
                        </Link>
                    </div>
                ) : (
                    <div className="border border-neutral-200 divide-y divide-neutral-200">
                        {archive.slice().reverse().map((entry, i) => (
                            <div key={i} className="p-6 flex justify-between items-center">
                                <div>
                                    <div className="text-xs text-neutral-500 mb-1">{entry.date}</div>
                                    <div className="font-medium">{entry.title || "Daily Challenge"}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-medium">{entry.wpm}</div>
                                    <div className="text-xs text-neutral-500">wpm</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
