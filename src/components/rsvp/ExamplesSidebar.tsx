"use client";

import { cn } from '@/lib/utils';
import { BookOpen } from 'lucide-react';

interface ExamplesSidebarProps {
    examples: Array<{ title: string; preview?: string; content: string }>;
    isDark: boolean;
    onSelect: (content: string) => void;
    showPreview?: boolean;
}

export function ExamplesSidebar({ examples, isDark, onSelect }: ExamplesSidebarProps) {
    return (
        <div className={cn(
            "hidden lg:block fixed right-8 top-1/2 -translate-y-1/2 w-80 max-h-[70vh] overflow-y-auto no-scrollbar rounded-2xl p-5 transition-all duration-300",
            isDark
                ? "bg-neutral-900/80 backdrop-blur-xl border border-neutral-800"
                : "bg-white/80 backdrop-blur-xl border border-neutral-200 shadow-xl"
        )}>
            <div className="mb-5 flex items-center gap-2">
                <BookOpen className={cn(
                    "w-4 h-4",
                    isDark ? "text-[#E07A5F]" : "text-[#E07A5F]"
                )} />
                <span className={cn(
                    "text-xs uppercase tracking-widest font-semibold",
                    isDark ? "text-neutral-400" : "text-neutral-500"
                )}>
                    Sample Texts
                </span>
            </div>

            <div className="space-y-2">
                {examples.map((example, i) => (
                    <button
                        key={i}
                        onClick={() => onSelect(example.content)}
                        className={cn(
                            "w-full text-left p-4 rounded-xl transition-all border group",
                            isDark
                                ? "border-neutral-800 bg-neutral-900/50 hover:border-[#E07A5F]/40 hover:bg-neutral-800/80"
                                : "border-neutral-200 bg-white hover:border-[#E07A5F]/40 hover:bg-neutral-50"
                        )}
                    >
                        <h3 className={cn(
                            "text-sm font-semibold mb-1 transition-colors",
                            isDark
                                ? "text-neutral-200 group-hover:text-[#E07A5F]"
                                : "text-neutral-800 group-hover:text-[#E07A5F]"
                        )}>
                            {example.title}
                        </h3>
                        <p className={cn(
                            "text-xs line-clamp-2 leading-relaxed",
                            isDark ? "text-neutral-500" : "text-neutral-500"
                        )}>
                            {example.preview}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
}
