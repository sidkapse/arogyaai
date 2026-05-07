import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MessageCircle, BookOpen, Utensils, Heart, AlertTriangle, HelpCircle, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAilmentContent } from '../lib/content';
import { getPalette } from '../lib/colors';
import { useProgress } from '../store/progress';
import { evaluateBadges } from '../lib/badges';
import { ConceptCard } from '../components/ConceptCard';
import { Quiz } from '../components/Quiz';
import { ChatPanel } from '../components/ChatPanel';
import { BadgeChip } from '../components/BadgeChip';
import { LanguageToggle } from '../components/LanguageToggle';
import clsx from 'clsx';

type Tab = 'learn' | 'food' | 'lifestyle' | 'redflags' | 'quiz';

export function AilmentRoute() {
  const { t } = useTranslation();
  const { ailmentId } = useParams<{ ailmentId: string }>();
  const navigate = useNavigate();
  const ailment = useAilmentContent(ailmentId);

  const { recordCardView, recordQuiz } = useProgress();
  const [cardIdx, setCardIdx] = useState(0);
  const [tab, setTab] = useState<Tab>('learn');
  const [showChat, setShowChat] = useState(false);
  const [newBadges, setNewBadges] = useState<ReturnType<typeof evaluateBadges>>([]);
  const [quizDone, setQuizDone] = useState(false);

  useEffect(() => {
    if (!ailment) return;
    recordCardView(ailment.id, ailment.cards[cardIdx].id, ailment.cards.length);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardIdx]);

  if (!ailment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">{t('ailment.ailmentNotFound')}</p>
      </div>
    );
  }

  const pal = getPalette(ailment.color);

  const handleCardNext = () => {
    if (cardIdx + 1 < ailment.cards.length) {
      setCardIdx(cardIdx + 1);
    } else {
      setTab('food');
    }
  };

  const handleCardPrev = () => {
    if (cardIdx > 0) {
      setCardIdx(cardIdx - 1);
    }
  };

  const handleQuizComplete = (score: number) => {
    recordQuiz(ailment.id, score);
    setQuizDone(true);
    const earned = evaluateBadges();
    if (earned.length) setNewBadges(earned);
  };

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'learn',     label: t('tabs.learn'),     icon: <BookOpen size={14} /> },
    { id: 'food',      label: t('tabs.diet'),      icon: <Utensils size={14} /> },
    { id: 'lifestyle', label: t('tabs.lifestyle'), icon: <Heart size={14} /> },
    { id: 'redflags',  label: t('tabs.redFlags'),  icon: <AlertTriangle size={14} /> },
    { id: 'quiz',      label: t('tabs.quiz'),      icon: <HelpCircle size={14} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      {/* ── HEADER (self-contained gradient, no absolute bleed) ── */}
      <div
        className="relative overflow-hidden px-4 pt-10 pb-6 text-white"
        style={{ background: pal.gradient }}
      >
        {/* decorative blob */}
        <div
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20"
          style={{ background: 'rgba(255,255,255,0.3)' }}
        />
        <div
          className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full opacity-10"
          style={{ background: 'rgba(255,255,255,0.4)' }}
        />

        <div className="relative flex items-center justify-between mb-5">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft size={18} /> {t('common.back')}
          </button>
          <LanguageToggle />
        </div>

        <div className="relative flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
            style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)' }}
          >
            {ailment.hero}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-extrabold leading-tight">{ailment.title}</h1>
            <p className="text-white/80 text-sm mt-1 leading-snug line-clamp-2">{ailment.oneLiner}</p>
          </div>
        </div>
      </div>

      {/* ── TAB BAR ── */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-30 shadow-sm">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={clsx(
              'flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-all shrink-0',
              tab === t.id
                ? 'text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700',
            )}
            style={tab === t.id ? { background: pal.hex500 } : {}}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* ── CONTENT ── */}
      <div className="flex-1 px-4 pt-6 pb-28 max-w-2xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {tab === 'learn' && (
            <motion.div key="learn" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <ConceptCard
                card={ailment.cards[cardIdx]}
                index={cardIdx}
                total={ailment.cards.length}
                onNext={handleCardNext}
                onPrev={handleCardPrev}
                palette={pal}
              />
            </motion.div>
          )}

          {tab === 'food' && (
            <motion.div key="food" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              {/* Eat section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">✅</span>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">{t('ailment.goodToEat')}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {ailment.doEat.map((f) => (
                    <div
                      key={f.name}
                      title={f.note}
                      className="flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-medium shadow-sm bg-white dark:bg-slate-800 hover:shadow-md transition-shadow cursor-default"
                      style={{ borderColor: '#bbf7d0', color: '#065f46' }}
                    >
                      <span className="text-base">{f.emoji}</span>
                      <span className="text-slate-700 dark:text-slate-200 font-medium">{f.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Avoid section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">❌</span>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">{t('ailment.avoidThese')}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {ailment.dontEat.map((f) => (
                    <div
                      key={f.name}
                      title={f.note}
                      className="flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-medium shadow-sm bg-white dark:bg-slate-800 hover:shadow-md transition-shadow cursor-default"
                      style={{ borderColor: '#fecaca', color: '#991b1b' }}
                    >
                      <span className="text-base">{f.emoji}</span>
                      <span className="text-slate-700 dark:text-slate-200 font-medium">{f.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer: Next button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setTab('lifestyle')}
                className="mt-8 w-full flex items-center justify-center gap-2 rounded-full py-3 font-semibold text-sm transition-all text-white"
                style={{ background: pal.gradient }}
              >
                {t('common.next')} <ChevronRight size={16} />
              </motion.button>
            </motion.div>
          )}

          {tab === 'lifestyle' && (
            <motion.div key="lifestyle" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
              {ailment.lifestyle.map((tip, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-2xl bg-white dark:bg-slate-800 border shadow-sm px-4 py-4"
                  style={{ borderColor: pal.hex200 }}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5"
                    style={{ background: pal.hex500 }}
                  >
                    {i + 1}
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{tip}</p>
                </div>
              ))}

              {/* Footer: Next button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setTab('redflags')}
                className="mt-8 w-full flex items-center justify-center gap-2 rounded-full py-3 font-semibold text-sm transition-all text-white"
                style={{ background: pal.gradient }}
              >
                {t('common.next')} <ChevronRight size={16} />
              </motion.button>
            </motion.div>
          )}

          {tab === 'redflags' && (
            <motion.div key="redflags" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
              <div className="rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 px-4 py-3 mb-4">
                <p className="text-sm font-semibold text-red-700 dark:text-red-400">{t('ailment.redFlagsIntro')}</p>
              </div>
              {ailment.redFlags.map((flag, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3 rounded-2xl bg-white dark:bg-slate-800 border border-red-100 dark:border-red-800 px-4 py-4 shadow-sm"
                >
                  <span className="text-red-500 text-lg shrink-0">⚠️</span>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{flag}</p>
                </motion.div>
              ))}

              {/* Footer: Next button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setTab('quiz')}
                className="mt-8 w-full flex items-center justify-center gap-2 rounded-full py-3 font-semibold text-sm transition-all text-white"
                style={{ background: pal.gradient }}
              >
                {t('common.next')} <ChevronRight size={16} />
              </motion.button>
            </motion.div>
          )}

          {tab === 'quiz' && (
            <motion.div key="quiz" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {quizDone && newBadges.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 rounded-2xl bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700"
                >
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-2">{t('ailment.newBadges')}</p>
                  <div className="flex flex-wrap gap-2">
                    {newBadges.map((b) => <BadgeChip key={b.id} badge={b} animate />)}
                  </div>
                </motion.div>
              )}
              <Quiz questions={ailment.quiz} onComplete={handleQuizComplete} palette={pal} />

              {/* Post-quiz navigation */}
              {quizDone && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 flex gap-3">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setTab('learn')}
                    className="flex-1 flex items-center justify-center gap-2 rounded-full py-3 font-semibold text-sm transition-all border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <ArrowLeft size={16} /> {t('common.back')}
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/home')}
                    className="flex-1 flex items-center justify-center gap-2 rounded-full py-3 font-semibold text-sm transition-all text-white"
                    style={{ background: pal.gradient }}
                  >
                    {t('ailment.backHome')} <ChevronRight size={16} />
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── FLOATING CHAT ── */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => setShowChat(true)}
        className="fixed bottom-8 right-5 z-50 flex items-center gap-2 rounded-full text-white px-5 py-3 shadow-2xl font-semibold text-sm"
        style={{ background: pal.gradient }}
      >
        <MessageCircle size={17} />
        {t('ailment.askAi')}
      </motion.button>

      {/* chat backdrop */}
      <AnimatePresence>
        {showChat && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowChat(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 320 }}
              className="fixed inset-x-0 bottom-0 z-50 h-[78vh] rounded-t-3xl shadow-2xl overflow-hidden bg-white dark:bg-slate-900"
            >
              <div className="w-10 h-1 bg-slate-300 dark:bg-slate-600 rounded-full mx-auto mt-3 mb-2" />
              <div className="h-[calc(78vh-24px)]">
                <ChatPanel ailment={ailment} onClose={() => setShowChat(false)} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
