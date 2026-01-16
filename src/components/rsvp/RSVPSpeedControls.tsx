import React from 'react';

type SpeedMode = 'linear' | 'block';

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
    if (speedMode !== 'linear' || isGenerated) return null;

    return (
        <div className="mt-4 p-4 border border-neutral-800 text-sm flex items-center gap-4">
            <span className="text-neutral-500">Speed:</span>
            <input
                type="number"
                value={startWPM}
                onChange={(e) => setStartWPM(parseInt(e.target.value) || 100)}
                className="w-16 px-2 py-1 text-center border border-neutral-700 focus:outline-none focus:border-neutral-500 bg-neutral-900 text-white"
            />
            <span className="text-neutral-500">→</span>
            <input
                type="number"
                value={endWPM}
                onChange={(e) => setEndWPM(parseInt(e.target.value) || 200)}
                className="w-16 px-2 py-1 text-center border border-neutral-700 focus:outline-none focus:border-neutral-500 bg-neutral-900 text-white"
            />
            <span className="text-neutral-500">wpm</span>
        </div>
    );
};
