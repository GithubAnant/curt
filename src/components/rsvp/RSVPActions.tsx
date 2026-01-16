import React from 'react';

interface RSVPActionsProps {
    wordCount: number;
    readTime: number;
    isGenerated: boolean;
    setIsGenerated: (generated: boolean) => void;
    handleStart: () => void;
    handleGenerate: () => void;
    content: string;
}

export const RSVPActions = ({
    wordCount,
    readTime,
    isGenerated,
    setIsGenerated,
    handleStart,
    handleGenerate,
    content
}: RSVPActionsProps) => {
    return (
        <div className="mt-4 p-4 border border-neutral-800 flex items-center justify-between">
            <div className="text-sm text-neutral-500">
                {wordCount} words · ~{readTime} min
            </div>
            <div className="flex gap-3">
                {isGenerated && (
                    <button
                        onClick={() => setIsGenerated(false)}
                        className="px-4 py-2 text-sm border border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:text-white transition-colors"
                    >
                        Edit
                    </button>
                )}
                <button
                    onClick={isGenerated ? handleStart : handleGenerate}
                    disabled={!content.trim()}
                    className="px-4 py-2 text-sm bg-[#E07A5F] text-black disabled:opacity-30 hover:bg-[#d66b50] transition-colors"
                >
                    {isGenerated ? 'Start →' : 'Preview'}
                </button>
            </div>
        </div>
    );
};
