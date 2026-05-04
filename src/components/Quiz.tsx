import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, ChevronRight, Star } from 'lucide-react';
import type { QuizQuestion } from '../lib/content';
import type { AilmentPalette } from '../lib/colors';
import clsx from 'clsx';

type Props = {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
  palette: AilmentPalette;
};

export function Quiz({ questions, onComplete, palette }: Props) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [showResult, setShowResult] = useState(false);

  const q = questions[idx];
  const answered = selected !== null;
  const correct = selected === q.correct;

  const next = () => {
    if (selected === null) return;
    const updated = [...answers, correct];
    if (idx + 1 < questions.length) {
      setAnswers(updated);
      setSelected(null);
      setIdx(idx + 1);
    } else {
      setAnswers(updated);
      setShowResult(true);
      const pct = Math.round((updated.filter(Boolean).length / questions.length) * 100);
      onComplete(pct);
    }
  };

  if (showResult) {
    const score = Math.round((answers.filter(Boolean).length / questions.length) * 100);
    const pass = score >= 80;
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-5 py-10 text-center"
      >
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center text-5xl shadow-xl"
          style={{ background: pass ? palette.hex50 : '#fef2f2', border: `3px solid ${pass ? palette.hex200 : '#fecaca'}` }}
        >
          {pass ? '🎉' : '💪'}
        </div>
        <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
          {pass ? 'Nailed it!' : 'Keep going!'}
        </h2>
        <div className="text-6xl font-extrabold" style={{ color: palette.hex500 }}>
          {score}%
        </div>
        <p className="text-slate-400 font-medium">
          {answers.filter(Boolean).length} / {questions.length} correct
        </p>
        {pass && (
          <div
            className="flex items-center gap-2 rounded-full px-5 py-2 font-bold text-sm text-white shadow-md"
            style={{ background: palette.gradient }}
          >
            <Star size={14} fill="white" /> +50 XP earned
          </div>
        )}
        <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
          {pass
            ? 'Section complete! Move on to the next ailment.'
            : 'Score ≥80% to mark this section complete. Try again anytime!'}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Progress bar */}
      <div className="flex justify-between text-xs text-slate-400 mb-1.5">
        <span>Question {idx + 1} / {questions.length}</span>
        <span>{answers.filter(Boolean).length} correct</span>
      </div>
      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full mb-6 overflow-hidden">
        <motion.div
          className="h-2 rounded-full"
          style={{ background: palette.gradient }}
          initial={{ width: 0 }}
          animate={{ width: `${((idx) / questions.length) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.22 }}
        >
          {/* Question */}
          <div
            className="rounded-2xl p-5 mb-5 shadow-sm"
            style={{ background: palette.hex50, border: `1.5px solid ${palette.hex200}` }}
          >
            <p className="text-base font-bold text-slate-800 dark:text-slate-100 leading-snug">
              {q.q}
            </p>
          </div>

          {/* Options */}
          <div className="flex flex-col gap-2.5 mb-4">
            {q.options.map((opt, i) => {
              const isSelected = selected === i;
              const isCorrect = i === q.correct;

              let borderColor = '#e2e8f0';
              let bgColor = '#fff';
              if (answered) {
                if (isCorrect) { borderColor = '#4ade80'; bgColor = '#f0fdf4'; }
                else if (isSelected && !isCorrect) { borderColor = '#f87171'; bgColor = '#fef2f2'; }
              } else if (isSelected) {
                borderColor = palette.hex500;
                bgColor = palette.hex50;
              }

              return (
                <motion.button
                  key={i}
                  whileTap={!answered ? { scale: 0.98 } : {}}
                  onClick={() => !answered && setSelected(i)}
                  className={clsx(
                    'w-full text-left rounded-2xl px-4 py-3.5 font-medium text-sm transition-all text-slate-700 dark:text-slate-200 shadow-sm',
                    !answered ? 'hover:shadow-md cursor-pointer' : 'cursor-default',
                  )}
                  style={{
                    border: `2px solid ${borderColor}`,
                    background: bgColor,
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span>{opt}</span>
                    {answered && isCorrect && <CheckCircle size={18} className="text-green-500 shrink-0" />}
                    {answered && isSelected && !isCorrect && <XCircle size={18} className="text-red-500 shrink-0" />}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Explanation */}
          {answered && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl p-4 text-sm mb-4 leading-relaxed ${
                correct
                  ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 border border-green-200'
                  : 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-200'
              }`}
            >
              <span className="font-bold">{correct ? '✅ Correct! ' : '❌ Not quite. '}</span>
              {q.why}
            </motion.div>
          )}

          {/* Next button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={next}
            disabled={!answered}
            className="w-full flex items-center justify-center gap-2 rounded-full py-3.5 font-semibold text-sm transition-all"
            style={
              answered
                ? { background: palette.gradient, color: '#fff', boxShadow: '0 4px 14px rgba(0,0,0,0.15)' }
                : { background: '#e2e8f0', color: '#94a3b8', cursor: 'not-allowed' }
            }
          >
            {idx + 1 < questions.length ? 'Next Question' : 'See Results'}
            <ChevronRight size={16} />
          </motion.button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
