export type SpeedMode = "linear" | "block" | "constant";

export const BLOCK_SPEEDS = [300, 450, 600, 750, 900];

export const calculateWpm = (
  speedMode: SpeedMode,
  startWPM: number,
  endWPM: number,
  index: number,
  totalWords: number
): number => {
  if (totalWords === 0) return startWPM;

  if (speedMode === "constant") {
    return startWPM; // Or just use startWPM as the constant speed
  }

  if (speedMode === "linear") {
    const progress = totalWords > 1 ? index / (totalWords - 1) : 0;
    return Math.round(startWPM + progress * (endWPM - startWPM));
  }

  // Block mode
  const blockIndex = Math.floor((index / totalWords) * BLOCK_SPEEDS.length);
  return BLOCK_SPEEDS[Math.min(blockIndex, BLOCK_SPEEDS.length - 1)];
};
