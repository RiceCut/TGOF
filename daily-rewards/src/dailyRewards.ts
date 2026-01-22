const DAYS_IN_MS = 1000 * 60 * 60 * 24;
const DUBAI_OFFSET_MINUTES = 4 * 60; // Asia/Dubai is UTC+4

const pad = (value: number) => String(value).padStart(2, '0');

function fromDubaiDate(date: Date): Date {
  const utcMs = date.getTime();
  const dubaiMs = utcMs + DUBAI_OFFSET_MINUTES * 60 * 1000;
  return new Date(dubaiMs);
}

function toKeyFromDubai(date: Date): string {
  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());
  return `${year}-${month}-${day}`;
}

function parseKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export type RewardType = 'gold' | 'xp' | 'loot';

export interface Reward {
  type: RewardType;
  quantity: number;
  label: string;
}

export const DAILY_REWARDS: Reward[] = [
  { type: 'gold', quantity: 60, label: 'Pièces dora' },
  { type: 'xp', quantity: 20, label: 'XP concentrée' },
  { type: 'gold', quantity: 90, label: 'Pièces de jade' },
  { type: 'loot', quantity: 1, label: 'Fragment de relique' },
  { type: 'xp', quantity: 35, label: 'XP de maîtrise' },
  { type: 'gold', quantity: 130, label: 'Sachet de poussière dargent' },
  { type: 'loot', quantity: 2, label: 'Boîte de chance' }
];

export function getTodayKey(reference?: Date): string {
  const target = reference ? reference : new Date();
  return toKeyFromDubai(fromDubaiDate(target));
}

export function isSameDay(a: string, b: string): boolean {
  return a === b;
}

export function daysBetween(startKey: string, endKey: string): number {
  const start = parseKey(startKey);
  const end = parseKey(endKey);
  const deltaMs = end.getTime() - start.getTime();
  return Math.round(deltaMs / DAYS_IN_MS);
}

export function shouldResetStreak(lastClaimKey: string, referenceKey?: string): boolean {
  const today = referenceKey ?? getTodayKey();
  return daysBetween(lastClaimKey, today) > 1;
}

export function canClaimToday(lastClaimKey: string | null, referenceKey?: string): boolean {
  const today = referenceKey ?? getTodayKey();
  if (!lastClaimKey) return true;
  return !isSameDay(lastClaimKey, today);
}

export function getCurrentDayIndex(streak: number): number {
  const max = DAILY_REWARDS.length;
  if (streak < 0) return 0;
  return streak % max;
}
