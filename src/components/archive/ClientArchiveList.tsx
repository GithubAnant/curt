"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// Removed date-fns import

interface DailyText {
    id: number;
    content: string;
    title: string | null;
    date: string;
    targetWpm: number | null;
}


interface ClientArchiveListProps {
    texts: DailyText[];
}

type SortOption = 'latest' | 'oldest' | 'longest' | 'shortest';

export default function ClientArchiveList({ texts }: ClientArchiveListProps) {
    const router = useRouter();
    const [sort, setSort] = useState<SortOption>('latest');

    const sortedTexts = useMemo(() => {
        const sorted = [...texts];
        switch (sort) {
            case 'latest':
                return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            case 'oldest':
                return sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            case 'longest':
                return sorted.sort((a, b) => b.content.length - a.content.length);
            case 'shortest':
                return sorted.sort((a, b) => a.content.length - b.content.length);
            default:
                return sorted;
        }
    }, [texts, sort]);

    const handlePlay = (text: DailyText) => {
        // Store settings for the player
        const settings = {
            content: text.content,
            speedMode: 'linear', // Default
            startWPM: 300,       // Default
            endWPM: 600,         // Default
            // We could add title/date metadata if player supported it
        };
        sessionStorage.setItem('rsvp-settings', JSON.stringify(settings));
        router.push('/app/player');
    };

    return (
        <div>
            {/* Controls */}
            <div className="flex justify-end mb-8">
                <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
                    <SelectTrigger className="w-[180px] bg-neutral-900 border-neutral-800 text-neutral-300">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 border-neutral-800 text-neutral-300">
                        <SelectItem value="latest">Latest</SelectItem>
                        <SelectItem value="oldest">Oldest</SelectItem>
                        <SelectItem value="longest">Longest</SelectItem>
                        <SelectItem value="shortest">Shortest</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* List */}
            <div className="border border-neutral-800 rounded-xl overflow-hidden divide-y divide-neutral-800">
                {sortedTexts.map((text) => {
                    const wordCount = text.content.trim().split(/\s+/).length;
                    // Estimate reading time at 300 WPM
                    const readTime = Math.ceil(wordCount / 300);

                    return (
                        <div
                            key={text.id}
                            onClick={() => handlePlay(text)}
                            className="p-6 bg-black hover:bg-neutral-900/50 transition-colors cursor-pointer group flex justify-between items-center"
                        >
                            <div>
                                <div className="text-xs text-neutral-500 mb-1 font-mono">
                                    {new Date(text.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </div>
                                <h3 className="text-lg font-medium text-white group-hover:text-[#E07A5F] transition-colors">
                                    {text.title || "Daily Challenge"}
                                </h3>
                            </div>

                            <div className="text-right">
                                <div className="text-sm text-neutral-400 font-mono">
                                    {wordCount} words
                                </div>
                                <div className="text-xs text-neutral-600 mt-1">
                                    ~{readTime} min
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {sortedTexts.length === 0 && (
                <div className="text-center py-20 text-neutral-500 border border-neutral-800 rounded-xl">
                    No archives found.
                </div>
            )}
        </div>
    );
}
