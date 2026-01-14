export function cleanTextForRSVP(text: string): string[] {
  // 1. Replace common number patterns
  let cleaned = text
    .replace(
      /(\d+)\.(\d+)/g,
      (match, p1, p2) => `${numberToWords(p1)} point ${numberToWords(p2)}`
    ) // 2.75 -> two point seven five
    .replace(/\b1\b/g, "one")
    .replace(/\b2\b/g, "two")
    .replace(/\b3\b/g, "three")
    .replace(/\b4\b/g, "four")
    .replace(/\b5\b/g, "five")
    .replace(/\b6\b/g, "six")
    .replace(/\b7\b/g, "seven")
    .replace(/\b8\b/g, "eight")
    .replace(/\b9\b/g, "nine")
    .replace(/\b0\b/g, "zero")
    .replace(/-/g, " "); // Replace dashes with spaces

  // 2. Remove other special chars but keep basic punctuation for rhythm (comma/period) if needed?
  // Actually, traditionally RSVP strips most punctuation or handles it as pauses.
  // For this visual fix, we just want to avoid weird chunks.

  // Split by space
  return cleaned.split(/\s+/).filter((w) => w.length > 0);
}

function numberToWords(numStr: string): string {
  // Very basic mapping for single digits found in the user prompt type of text
  const map: Record<string, string> = {
    "0": "zero",
    "1": "one",
    "2": "two",
    "3": "three",
    "4": "four",
    "5": "five",
    "6": "six",
    "7": "seven",
    "8": "eight",
    "9": "nine",
  };
  return numStr
    .split("")
    .map((d) => map[d] || d)
    .join(" ");
}
