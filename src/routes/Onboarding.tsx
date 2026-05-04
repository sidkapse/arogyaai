import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useProfile } from '../store/profile';

const SLIDES = [
  {
    emoji: '🩺',
    title: 'Know Your Body',
    body: 'Millions of Indians live with diabetes, thyroid issues, BP, PCOD and more — but doctors rarely explain the "why". This app does.',
    gradient: 'linear-gradient(135deg,#10b981,#0d9488)',
    bg: 'bg-emerald-500',
    blobs: ['#a7f3d0', '#6ee7b7'],
  },
  {
    emoji: '🎮',
    title: 'Learn by Playing',
    body: 'Swipe through bite-sized concept cards, test yourself with mini-quizzes, earn XP and badges as you level up your health knowledge.',
    gradient: 'linear-gradient(135deg,#8b5cf6,#7c3aed)',
    bg: 'bg-violet-500',
    blobs: ['#ddd6fe', '#c4b5fd'],
  },
  {
    emoji: '🤖',
    title: 'Ask an AI Tutor',
    body: 'Got a question? Ask our GPT-4o-mini powered tutor inside every ailment section — get answers in plain Indian English, anytime.',
    gradient: 'linear-gradient(135deg,#f97316,#ea580c)',
    bg: 'bg-orange-500',
    blobs: ['#fed7aa', '#fdba74'],
  },
];

export function Onboarding() {
  const [idx, setIdx] = useState(0);
  const navigate = useNavigate();
  const profile = useProfile((s) => s.profile);
  const dest = profile ? '/home' : '/signin';

  const next = () => {
    if (idx + 1 < SLIDES.length) setIdx(idx + 1);
    else navigate(dest);
  };

  const slide = SLIDES[idx];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Full-bleed hero area */}
      <div
        className="relative flex flex-col items-center justify-center pt-20 pb-16 px-6 flex-1"
        style={{ background: slide.gradient }}
      >
        {/* Decorative blob BG */}
        <div
          className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none"
        >
          <div
            className="absolute -top-12 -left-12 w-52 h-52 rounded-full opacity-30"
            style={{ background: slide.blobs[0] }}
          />
          <div
            className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full opacity-20"
            style={{ background: slide.blobs[1] }}
          />
        </div>

        {/* Dots */}
        <div className="absolute top-12 flex gap-2">
          {SLIDES.map((_, i) => (
            <span
              key={i}
              className="h-2 rounded-full transition-all duration-300 bg-white"
              style={{ width: i === idx ? 28 : 8, opacity: i === idx ? 1 : 0.4 }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 flex flex-col items-center text-center gap-6"
          >
            {/* Emoji blob */}
            <div
              className="w-36 h-36 rounded-[2.5rem] flex items-center justify-center shadow-2xl"
              style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }}
            >
              <span className="text-7xl">{slide.emoji}</span>
            </div>

            <div>
              <h1 className="text-3xl font-extrabold text-white mb-3">{slide.title}</h1>
              <p className="text-white/85 text-base leading-relaxed max-w-xs">{slide.body}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom action area */}
      <div className="bg-white dark:bg-slate-900 px-6 py-8 flex flex-col items-center gap-4">
        <motion.button
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.02 }}
          onClick={next}
          className="w-full max-w-xs flex items-center justify-center gap-2 rounded-full text-white font-bold py-4 text-base shadow-lg"
          style={{ background: slide.gradient }}
        >
          {idx + 1 < SLIDES.length ? 'Next' : 'Get Started'}
          <ChevronRight size={20} />
        </motion.button>

        {idx + 1 < SLIDES.length ? (
          <button
            onClick={() => navigate(dest)}
            className="text-slate-400 text-sm hover:text-slate-600 transition-colors"
          >
            Skip intro
          </button>
        ) : (
          <p className="text-xs text-slate-400 text-center max-w-xs">
            All data stays on your device. No account needed.
          </p>
        )}
      </div>
    </div>
  );
}
