import { useState, useEffect, useRef, useCallback } from "react";

export interface RSVPWord {
  word: string;
  wpm: number; // The speed at which THIS word should be displayed (or rather, the delay AFTER this word)
  // Optionally support a specific duration in ms directly
  duration?: number;
}

interface UseRSVPProps {
  words: RSVPWord[]; // Pre-processed list of words with their specific speeds
  isPlaying: boolean;
  onComplete?: () => void;
}

export function useRSVP({ words, isPlaying, onComplete }: UseRSVPProps) {
  const [index, setIndex] = useState(0);
  const requestRef = useRef<number>(undefined);
  const lastTimeRef = useRef<number>(undefined);
  const accumulatedTimeRef = useRef<number>(0);

  // Reset when words change? Maybe not, allow dynamic updates.
  // But if words length changes drastically, might want to reset index or clamp it.

  const animate = useCallback(
    (time: number) => {
      if (lastTimeRef.current !== undefined) {
        const deltaTime = time - lastTimeRef.current;
        accumulatedTimeRef.current += deltaTime;

        const currentWord = words[index];
        // Calculate duration: 60000ms / wpm = ms per word
        // e.g. 300 wpm = 200ms per word
        let duration =
          currentWord?.duration ||
          (currentWord?.wpm ? 60000 / currentWord.wpm : 200);

        // Safety clamp
        if (duration < 50) duration = 50;

        if (accumulatedTimeRef.current >= duration) {
          // Prepare to advance
          // We preserve the "overshoot" time to keep the rhythm perfect?
          // Or reset to 0? Preserving is better for long-term sync,
          // but simple reset is safer against visually skipping frames if lag spike.
          // Let's reset but subtract duration to keep phase if it's small drift.

          while (accumulatedTimeRef.current >= duration) {
            accumulatedTimeRef.current -= duration;

            setIndex((prevIndex) => {
              const nextIndex = prevIndex + 1;
              if (nextIndex >= words.length) {
                // Stop
                return prevIndex; // Stay on last word
              }
              return nextIndex;
            });

            // If we reached the end in the loop, break
            if (index >= words.length - 1) break;

            // Update duration for the *next* word (loop iteration)
            // But we can't easily access the *next* state inside this state updater closure efficiently
            // without refs.
            // So simpler approach: Just one step per frame is safest for React state updates.
          }
        }
      }

      lastTimeRef.current = time;
      if (index < words.length - 1 && isPlaying) {
        requestRef.current = requestAnimationFrame(animate);
      } else if (index >= words.length - 1 && isPlaying && onComplete) {
        onComplete();
      }
    },
    [index, words, isPlaying, onComplete]
  );

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      lastTimeRef.current = undefined;
      accumulatedTimeRef.current = 0; // Reset accumulation on pause? Or Keep? Reset feels "Snappier" on play.
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, animate]);

  // Handle resetting index manually if needed
  const scrub = (newIndex: number) => {
    setIndex(Math.max(0, Math.min(newIndex, words.length - 1)));
    accumulatedTimeRef.current = 0;
    lastTimeRef.current = undefined;
  };

  return {
    index,
    currentWord: words[index],
    progress: index / (words.length || 1),
    scrub,
    isFinished: index >= words.length - 1,
  };
}

// Utility to calculate ORP
export function getORPIndex(word: string): number {
  const len = word.length;
  if (len === 1) return 0;
  if (len >= 2 && len <= 5) return 1;
  if (len >= 6 && len <= 9) return 2;
  if (len >= 10 && len <= 13) return 3;
  return 4;
}
