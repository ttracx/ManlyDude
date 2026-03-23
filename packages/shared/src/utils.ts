/**
 * Format duration in seconds to a human-readable string (e.g., "1h 23m 45s")
 */
export function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

  return parts.join(' ');
}

/**
 * Calculate estimated one-rep max using the Epley formula
 * @param weight - Weight lifted
 * @param reps - Number of reps performed
 * @returns Estimated 1RM
 */
export function calculateOneRepMax(weight: number, reps: number): number {
  if (reps <= 0 || weight <= 0) return 0;
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30));
}

/**
 * Format weight with unit suffix
 * @param weightKg - Weight in kilograms
 * @param unit - Display unit ('kg' or 'lbs')
 */
export function formatWeight(weightKg: number, unit: 'kg' | 'lbs' = 'kg'): string {
  if (unit === 'lbs') {
    const lbs = Math.round(weightKg * 2.20462 * 10) / 10;
    return `${lbs} lbs`;
  }
  return `${Math.round(weightKg * 10) / 10} kg`;
}

/**
 * Calculate total volume for a set (weight x reps)
 */
export function calculateVolume(weight: number, reps: number): number {
  return weight * reps;
}

/**
 * Generate a UUID v4 (for offline-first ID generation)
 */
export function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
