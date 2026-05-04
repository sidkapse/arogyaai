import { useProgress } from '../store/progress';
import type { AilmentId } from './content';

export type Badge = {
  id: string;
  label: string;
  emoji: string;
  description: string;
};

export const ALL_BADGES: Badge[] = [
  { id: 'first-steps', label: 'First Steps', emoji: '🌱', description: 'Completed your first ailment section' },
  { id: 'diet-master', label: 'Diet Master', emoji: '🥗', description: 'Completed 5 ailment sections' },
  { id: 'all-rounder', label: 'All-Rounder', emoji: '🏆', description: 'Completed all 9 ailment sections' },
  { id: 'quiz-pro', label: 'Quiz Pro', emoji: '🎯', description: 'Scored ≥90% on 5 quizzes' },
  { id: 'curious-mind', label: 'Curious Mind', emoji: '🔍', description: 'Viewed every concept card in 3 ailments' },
];

export const BADGE_MAP: Record<string, Badge> = Object.fromEntries(
  ALL_BADGES.map((b) => [b.id, b]),
);

/** Call after quiz or card view to check + award any newly earned badges.
 *  Returns array of newly awarded Badge objects. */
export function evaluateBadges(): Badge[] {
  const { perAilment, badges, recordQuiz: _r, awardBadge, ...state } = useProgress.getState();
  void _r; void state;
  const newly: Badge[] = [];

  const award = (id: string) => {
    if (!badges.includes(id)) {
      awardBadge(id);
      const b = BADGE_MAP[id];
      if (b) newly.push(b);
    }
  };

  const completed = Object.values(perAilment).filter((p) => p?.completed).length;
  if (completed >= 1) award('first-steps');
  if (completed >= 5) award('diet-master');
  if (completed >= 9) award('all-rounder');

  // quiz-pro: count ailments with quizBest >= 90
  const ninetyPlus = Object.values(perAilment).filter((p) => (p?.quizBest ?? 0) >= 90).length;
  if (ninetyPlus >= 5) award('quiz-pro');

  // curious-mind: ailments where all cards viewed
  const allCardsCount = Object.values(perAilment).filter(
    (p) => p && p.cardsViewed.length >= p.cardsTotal && p.cardsTotal > 0,
  ).length;
  if (allCardsCount >= 3) award('curious-mind');

  return newly;
}

export function completedAilments(): AilmentId[] {
  const { perAilment } = useProgress.getState();
  return Object.entries(perAilment)
    .filter(([, p]) => p?.completed)
    .map(([id]) => id as AilmentId);
}
