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

  // Refs for mutable state accessed in animation loop
  const indexRef = useRef(index);
  const wordsRef = useRef(words);
  const isPlayingRef = useRef(isPlaying);
  const onCompleteRef = useRef(onComplete);

  // Sync refs immediately (during render) to ensure fresh data for callbacks/effects
  indexRef.current = index;
  wordsRef.current = words;
  isPlayingRef.current = isPlaying;
  onCompleteRef.current = onComplete;

  const animate = useCallback((time: number) => {
    if (lastTimeRef.current !== undefined) {
      const deltaTime = time - lastTimeRef.current;
      accumulatedTimeRef.current += deltaTime;

      const currentWords = wordsRef.current;
      const currentIndex = indexRef.current;
      const currentWord = currentWords[currentIndex];

      let duration =
        currentWord?.duration ||
        (currentWord?.wpm ? 60000 / currentWord.wpm : 200);

      if (duration < 50) duration = 50;

      if (accumulatedTimeRef.current >= duration) {
        // Prepare to advance
        while (accumulatedTimeRef.current >= duration) {
          accumulatedTimeRef.current -= duration;

          let nextIndex = indexRef.current + 1;

          if (nextIndex >= currentWords.length) {
            // Stop
            if (isPlayingRef.current && onCompleteRef.current) {
              onCompleteRef.current();
            }
            return; // Stop animation
          }

          indexRef.current = nextIndex;
          setIndex(nextIndex);
        }
      }
    }

    lastTimeRef.current = time;
    if (isPlayingRef.current && indexRef.current < wordsRef.current.length) {
      requestRef.current = requestAnimationFrame(animate);
    }
  }, []);

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      lastTimeRef.current = undefined;
      // accumulatedTimeRef.current = 0; // Don't reset time on pause, allows resume
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, animate]);

  // Handle resetting index manually
  const scrub = useCallback((newIndex: number) => {
    const safeIndex = Math.max(
      0,
      Math.min(newIndex, wordsRef.current.length - 1)
    );
    setIndex(safeIndex);
    indexRef.current = safeIndex;
    accumulatedTimeRef.current = 0;
    lastTimeRef.current = undefined;
  }, []);

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
