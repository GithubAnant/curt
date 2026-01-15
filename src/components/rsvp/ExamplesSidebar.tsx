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
            "hidden lg:flex flex-col w-64 border-l p-8 overflow-y-auto max-h-screen",
            isDark ? "border-neutral-800/50" : "border-neutral-200/50"
        )}>
            <span className={cn(
                "text-[10px] uppercase tracking-[0.2em] mb-8",
                isDark ? "text-neutral-600" : "text-neutral-400"
            )}>
                Examples
            </span>

            <div className="space-y-1">
                {examples.map((example, i) => (
                    <button
                        key={i}
                        onClick={() => onSelect(example.content)}
                        className={cn(
                            "w-full text-left py-3 px-3 -mx-3 transition-all border-l-2 border-transparent hover:border-[#E07A5F]",
                            isDark
                                ? "text-neutral-500 hover:text-white"
                                : "text-neutral-500 hover:text-black"
                        )}
                        style={{ fontFamily: 'Georgia, serif' }}
                    >
                        <span className="text-sm">{example.title}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
