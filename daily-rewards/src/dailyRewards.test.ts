import { describe, expect, it } from 'vitest';
import { canClaimToday, daysBetween, getTodayKey, shouldResetStreak } from './dailyRewards';

describe('daily reward helpers', () => {
  it('aligns dates with Dubai timezone', () => {
    const date = new Date('2026-01-01T22:00:00Z');
    expect(getTodayKey(date)).toBe('2026-01-02');
  });

  it('counts days between helper keys', () => {
    expect(daysBetween('2026-01-01', '2026-01-04')).toBe(3);
    expect(daysBetween('2026-01-05', '2026-01-05')).toBe(0);
  });

  it('resets the streak when a day is missed', () => {
    expect(shouldResetStreak('2026-01-01', '2026-01-03')).toBe(true);
    expect(shouldResetStreak('2026-01-01', '2026-01-02')).toBe(false);
  });

  it('prevents claiming twice during the same Dubai day', () => {
    expect(canClaimToday('2026-01-02', '2026-01-02')).toBe(false);
    expect(canClaimToday('2026-01-01', '2026-01-02')).toBe(true);
  });
});
