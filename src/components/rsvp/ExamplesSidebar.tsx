"use client";

import { cn } from '@/lib/utils';

interface ExamplesSidebarProps {
    examples: Array<{ title: string; preview?: string; content: string }>;
    isDark: boolean;
    onSelect: (content: string) => void;
    showPreview?: boolean;
}

export function ExamplesSidebar({ examples, isDark, onSelect, showPreview = false }: ExamplesSidebarProps) {
    return (
        <div className={cn(
            "hidden lg:flex flex-col w-80 border-l overflow-y-auto max-h-screen no-scrollbar",
            isDark ? "border-neutral-800/50 bg-neutral-900/20" : "border-neutral-200/50 bg-neutral-50/50"
        )}>
            <div className="p-6 sticky top-0 backdrop-blur-sm z-10 border-b border-transparent">
                <span className={cn(
                    "text-[10px] uppercase tracking-[0.2em] font-semibold",
                    isDark ? "text-neutral-500" : "text-neutral-500"
                )}>
                    Select Text
                </span>
            </div>

            <div className="p-4 space-y-3">
                {examples.map((example, i) => (
                    <button
                        key={i}
                        onClick={() => onSelect(example.content)}
                        className={cn(
                            "w-full text-left p-4 rounded-xl transition-all border group relative overflow-hidden",
                            isDark
                                ? "border-neutral-800 hover:border-neutral-700 bg-neutral-900/50 hover:bg-neutral-800/80 text-neutral-400 hover:text-white"
                                : "border-neutral-200 hover:border-neutral-300 bg-white hover:bg-white hover:shadow-sm text-neutral-600 hover:text-black"
                        )}
                    >
                        <div className="relative z-10">
                            <h3 className={cn(
                                "text-sm font-medium mb-1 transition-colors",
                                isDark ? "text-neutral-300 group-hover:text-white" : "text-neutral-800 group-hover:text-black"
                            )} style={{ fontFamily: 'Georgia, serif' }}>
                                {example.title}
                            </h3>
                            <p className={cn(
                                "text-xs line-clamp-2 leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity",
                            )}>
                                {example.preview}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
