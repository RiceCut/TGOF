import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Reward } from './dailyRewards';

type LootItem = string;

export interface GameState {
  gold: number;
  xp: number;
  inventory: LootItem[];
}

const STORAGE_KEY = 'tgo-game-state';

const initialState: GameState = {
  gold: 0,
  xp: 0,
  inventory: []
};

const readState = (): GameState => {
  if (typeof window === 'undefined') return initialState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    return JSON.parse(raw);
  } catch {
    return initialState;
  }
};

const persistState = (state: GameState) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
};

const GameStateContext = createContext<{
  state: GameState;
  applyReward: (reward: Reward) => void;
} | null>(null);

export const GameStateProvider = ({ children }: { children: ReactNode }) => {
  const baseState = useMemo(() => readState(), []);
  const [state, setState] = useState<GameState>(baseState);

  useEffect(() => {
    persistState(state);
  }, [state]);

  const applyReward = useCallback((reward: Reward) => {
    setState(prev => {
      const next: GameState = { ...prev };
      switch (reward.type) {
        case 'gold':
          next.gold += reward.quantity;
          break;
        case 'xp':
          next.xp += reward.quantity;
          break;
        case 'loot':
          next.inventory = [...prev.inventory, reward.label];
          break;
      }
      return next;
    });
  }, []);

  return <GameStateContext.Provider value={{ state, applyReward }}>{children}</GameStateContext.Provider>;
};

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within GameStateProvider');
  }
  return context;
};
