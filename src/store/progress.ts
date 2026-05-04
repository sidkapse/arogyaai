import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AilmentId } from '../lib/content';

export type AilmentProgress = {
  cardsViewed: string[]; // card ids
  cardsTotal: number;
  quizBest: number; // 0..100
  completed: boolean;
};

type ProgressStore = {
  perAilment: Partial<Record<AilmentId, AilmentProgress>>;
  xp: number;
  streakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  badges: string[];
  recordCardView: (id: AilmentId, cardId: string, total: number) => number; // returns xp delta
  recordQuiz: (id: AilmentId, score: number) => number;
  awardBadge: (badge: string) => boolean;
  touchStreak: () => void;
  reset: () => void;
};

const today = () => new Date().toISOString().slice(0, 10);

export const useProgress = create<ProgressStore>()(
  persist(
    (set, get) => ({
      perAilment: {},
      xp: 0,
      streakDays: 0,
      lastActiveDate: '',
      badges: [],
      recordCardView: (id, cardId, total) => {
        const cur = get().perAilment[id] ?? { cardsViewed: [], cardsTotal: total, quizBest: 0, completed: false };
        if (cur.cardsViewed.includes(cardId)) return 0;
        const next = { ...cur, cardsViewed: [...cur.cardsViewed, cardId], cardsTotal: total };
        set({
          perAilment: { ...get().perAilment, [id]: next },
          xp: get().xp + 5,
        });
        return 5;
      },
      recordQuiz: (id, score) => {
        const cur = get().perAilment[id] ?? { cardsViewed: [], cardsTotal: 0, quizBest: 0, completed: false };
        const wasCompleted = cur.completed;
        const next: AilmentProgress = {
          ...cur,
          quizBest: Math.max(cur.quizBest, score),
          completed: cur.completed || score >= 80,
        };
        const xpDelta = !wasCompleted && next.completed ? 50 : 0;
        set({
          perAilment: { ...get().perAilment, [id]: next },
          xp: get().xp + xpDelta,
        });
        return xpDelta;
      },
      awardBadge: (badge) => {
        if (get().badges.includes(badge)) return false;
        set({ badges: [...get().badges, badge] });
        return true;
      },
      touchStreak: () => {
        const last = get().lastActiveDate;
        const t = today();
        if (last === t) return;
        const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
        const newStreak = last === yesterday ? get().streakDays + 1 : 1;
        set({ streakDays: newStreak, lastActiveDate: t });
      },
      reset: () => set({ perAilment: {}, xp: 0, streakDays: 0, lastActiveDate: '', badges: [] }),
    }),
    { name: 'ai.progress' },
  ),
);
