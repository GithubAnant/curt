export function getDailySpeed(dateString: string): number {
  // Create a hash from the date string (e.g., "2024-01-17")
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    const char = dateString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  // Use the hash to pick a speed
  // Range: 300 to 900 (inclusive)
  // Steps: 50 -> (900 - 300) / 50 = 12 steps + 1 = 13 possible values
  // 300, 350, 400, ..., 900

  const minSpeed = 300;
  const maxSpeed = 900;
  const step = 50;
  const steps = (maxSpeed - minSpeed) / step + 1;

  // Ensure positive index
  const index = Math.abs(hash) % steps;

  return minSpeed + index * step;
}
