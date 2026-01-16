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
            "fixed right-8 top-1/2 -translate-y-1/2 w-80 max-h-[80vh] overflow-y-auto no-scrollbar rounded-2xl p-6 transition-all duration-300",
            isDark ? "bg-black/50 backdrop-blur-xl border border-neutral-800 shadow-2xl shadow-black/50" : "bg-white/50 backdrop-blur-xl border border-neutral-200 shadow-2xl shadow-neutral-200/50"
        )}>
            <div className="mb-6 sticky top-0 z-10">
                <span className={cn(
                    "text-[10px] uppercase tracking-[0.2em] font-medium",
                    isDark ? "text-neutral-500" : "text-neutral-400"
                )}>
                    Select Text
                </span>
            </div>

            <div className="space-y-3">
                {examples.map((example, i) => (
                    <button
                        key={i}
                        onClick={() => onSelect(example.content)}
                        className={cn(
                            "w-full text-left p-5 rounded-xl transition-all border group relative overflow-hidden",
                            isDark
                                ? "border-neutral-800 bg-transparent hover:border-neutral-600 hover:bg-neutral-900/40"
                                : "border-neutral-200 bg-transparent hover:border-neutral-400 hover:bg-white/60"
                        )}
                    >
                        <div className="relative z-10">
                            <h3 className={cn(
                                "text-sm font-medium mb-1.5 transition-colors",
                                isDark ? "text-neutral-300 group-hover:text-white" : "text-neutral-700 group-hover:text-black"
                            )} style={{ fontFamily: 'Georgia, serif' }}>
                                {example.title}
                            </h3>
                            <p className={cn(
                                "text-xs line-clamp-2 leading-relaxed transition-opacity font-light",
                                isDark ? "text-neutral-500 group-hover:text-neutral-400" : "text-neutral-500 group-hover:text-neutral-600"
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
