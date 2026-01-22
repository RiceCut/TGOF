import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Reward,
  DAILY_REWARDS,
  canClaimToday,
  daysBetween,
  getCurrentDayIndex,
  getTodayKey,
  shouldResetStreak
} from '../dailyRewards';

const STORAGE_KEY = 'tgo-daily-rewards-state';

interface StoredState {
  streak: number;
  lastClaimDate: string | null;
}

const readStoredState = (): StoredState => {
  if (typeof window === 'undefined') {
    return { streak: 0, lastClaimDate: null };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { streak: 0, lastClaimDate: null };
    return JSON.parse(raw);
  } catch {
    return { streak: 0, lastClaimDate: null };
  }
};

const persistState = (state: StoredState) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
};

export function useDailyRewards(onApplyReward: (reward: Reward) => void) {
  const initialState = useMemo(() => readStoredState(), []);
  const [streak, setStreak] = useState<number>(initialState.streak);
  const [lastClaimDate, setLastClaimDate] = useState<string | null>(initialState.lastClaimDate);

  const todayKey = getTodayKey();

  useEffect(() => {
    persistState({ streak, lastClaimDate });
  }, [streak, lastClaimDate]);

  useEffect(() => {
    if (!lastClaimDate) return;
    if (streak === 0) return;
    if (shouldResetStreak(lastClaimDate, todayKey)) {
      setStreak(0);
    }
  }, [lastClaimDate, streak, todayKey]);

  const canClaim = canClaimToday(lastClaimDate, todayKey);
  const nextRewardIndex = getCurrentDayIndex(streak);
  const nextReward = DAILY_REWARDS[nextRewardIndex];
  const currentReward = streak > 0 ? DAILY_REWARDS[(streak - 1) % DAILY_REWARDS.length] : null;
  const cycleProgress = Math.min(streak, DAILY_REWARDS.length);
  const grid = useMemo(() => {
    return DAILY_REWARDS.map((reward, index) => {
      const status: 'claimed' | 'next' | 'locked' =
        index < cycleProgress ? 'claimed' : index === nextRewardIndex ? 'next' : 'locked';
      return { day: index + 1, reward, status };
    });
  }, [cycleProgress, nextRewardIndex]);

  const claim = useCallback(() => {
    if (!canClaim) return null;
    const today = getTodayKey();
    const diff = lastClaimDate ? daysBetween(lastClaimDate, today) : null;
    const isConsecutive = diff === 1 && streak > 0;
    const nextStreak = isConsecutive ? streak + 1 : 1;
    const reward = DAILY_REWARDS[(nextStreak - 1) % DAILY_REWARDS.length];
    onApplyReward(reward);
    setStreak(nextStreak);
    setLastClaimDate(today);
    return reward;
  }, [canClaim, lastClaimDate, onApplyReward, streak, todayKey]);

  return {
    streak,
    lastClaimDate,
    canClaim,
    nextReward,
    currentReward,
    grid,
    claim
  };
}
