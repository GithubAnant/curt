import React from 'react';

type SpeedMode = 'linear' | 'block' | 'constant';

interface RSVPSpeedControlsProps {
    speedMode: SpeedMode;
    startWPM: number;
    endWPM: number;
    setStartWPM: (wpm: number) => void;
    setEndWPM: (wpm: number) => void;
    isGenerated: boolean;
}

export const RSVPSpeedControls = ({
    speedMode,
    startWPM,
    endWPM,
    setStartWPM,
    setEndWPM,
    isGenerated
}: RSVPSpeedControlsProps) => {
    if (isGenerated || speedMode === 'block') return null;

    return (
        <div className="mt-6 p-6 border border-neutral-800 rounded-xl bg-neutral-900/50 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
                <span className="text-neutral-500 text-sm uppercase tracking-wider font-medium">
                    {speedMode === 'constant' ? 'Speed' : 'Start Speed'}
                </span>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setStartWPM(Math.max(100, startWPM - 50))}
                        className="w-8 h-8 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors"
                    >
                        -
                    </button>
                    <span className="w-12 text-center font-mono text-lg">{startWPM}</span>
                    <button
                        onClick={() => setStartWPM(Math.min(speedMode === 'constant' ? 2000 : endWPM, startWPM + 50))}
                        className="w-8 h-8 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors"
                    >
                        +
                    </button>
                </div>
            </div>

            {speedMode !== 'constant' && (
                <>
                    <div className="hidden md:block w-px h-8 bg-neutral-800"></div>

                    <div className="flex items-center gap-4">
                        <span className="text-neutral-500 text-sm uppercase tracking-wider font-medium">End Speed</span>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setEndWPM(Math.max(startWPM, endWPM - 50))}
                                className="w-8 h-8 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors"
                            >
                                -
                            </button>
                            <span className="w-12 text-center font-mono text-lg">{endWPM}</span>
                            <button
                                onClick={() => setEndWPM(Math.min(2000, endWPM + 50))}
                                className="w-8 h-8 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors"
                            >
                                +
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
