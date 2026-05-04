import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, Star, Award } from 'lucide-react';
import { useProfile } from '../store/profile';
import { useProgress } from '../store/progress';
import { AILMENTS } from '../lib/content';
import { getPalette } from '../lib/colors';
import { ProgressRing } from '../components/ProgressRing';
import { BottomNav } from '../components/BottomNav';

export function Home() {
  const profile = useProfile((s) => s.profile);
  const { xp, streakDays, badges, perAilment } = useProgress();
  const completedCount = Object.values(perAilment).filter((p) => p?.completed).length;

  return (
    <div className="min-h-screen pb-24 bg-slate-50 dark:bg-slate-950">
      {/* Top header */}
      <div className="bg-gradient-to-br from-brand-500 to-teal-500 px-5 pt-12 pb-8 text-white relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/10" />
        <div className="absolute bottom-0 left-1/3 w-24 h-24 rounded-full bg-white/5" />

        <p className="text-brand-100 text-sm font-medium">Welcome back,</p>
        <h1 className="text-2xl font-extrabold mt-0.5">{profile?.name ?? 'Friend'} 👋</h1>

        {/* Stats row */}
        <div className="flex gap-3 mt-4 flex-wrap">
          <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-3.5 py-1.5 text-sm font-semibold backdrop-blur-sm">
            <Star size={14} fill="white" /> {xp} XP
          </div>
          <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-3.5 py-1.5 text-sm font-semibold backdrop-blur-sm">
            <Flame size={14} /> {streakDays}d streak
          </div>
          <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-3.5 py-1.5 text-sm font-semibold backdrop-blur-sm">
            <Award size={14} /> {badges.length} badges
          </div>
        </div>

        {/* Overall progress */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-white/70 mb-1.5">
            <span>Overall progress</span>
            <span>{completedCount} / {AILMENTS.length} complete</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-2 rounded-full bg-white/80"
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / AILMENTS.length) * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Section heading */}
      <div className="px-5 pt-6 pb-2">
        <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200">Ailment Sections</h2>
        <p className="text-sm text-slate-400 mt-0.5">Tap any section to start learning</p>
      </div>

      {/* Ailment grid */}
      <div className="px-4 pb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {AILMENTS.map((a, i) => {
          const prog = perAilment[a.id];
          const pal = getPalette(a.color);
          const cardsViewed = prog?.cardsViewed.length ?? 0;
          const cardsTotal = prog?.cardsTotal || a.cards.length;
          const quizBest = prog?.quizBest ?? 0;
          const done = prog?.completed ?? false;
          const pct = done
            ? 100
            : Math.round((cardsViewed / cardsTotal) * 60 + (quizBest / 100) * 40);

          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                to={`/a/${a.id}`}
                className="flex flex-col rounded-3xl overflow-hidden shadow-sm hover:shadow-lg active:scale-95 transition-all bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
              >
                {/* Coloured top strip */}
                <div className="h-1.5" style={{ background: pal.gradient }} />

                {/* Card body */}
                <div className="p-4 flex flex-col items-center gap-3">
                  {/* Emoji + ring */}
                  <div className="relative">
                    <ProgressRing pct={pct} size={64} stroke={5} color={pal.hex500}>
                      <span
                        className="text-2xl"
                        style={{ transform: 'rotate(90deg)', display: 'inline-block' }}
                      >
                        {a.hero}
                      </span>
                    </ProgressRing>
                    {done && (
                      <span className="absolute -top-1 -right-1 text-sm">✅</span>
                    )}
                  </div>

                  {/* Title */}
                  <p className="text-center text-xs font-bold text-slate-700 dark:text-slate-200 leading-tight">
                    {a.title}
                  </p>

                  {/* Progress % pill */}
                  <div
                    className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                    style={{
                      background: done ? pal.hex50 : '#f1f5f9',
                      color: done ? pal.hex700 : '#64748b',
                      border: `1px solid ${done ? pal.hex200 : '#e2e8f0'}`,
                    }}
                  >
                    {done ? '✓ Done' : `${pct}%`}
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
}
