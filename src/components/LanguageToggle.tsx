import { Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSettings } from '../store/settings';

type Props = {
  variant?: 'header' | 'plain';
};

export function LanguageToggle({ variant = 'header' }: Props) {
  const { language, setLanguage } = useSettings();
  const toggle = () => setLanguage(language === 'en' ? 'hi' : 'en');

  const baseStyles =
    variant === 'header'
      ? 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700';

  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={toggle}
      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${baseStyles}`}
      aria-label="Toggle language"
    >
      <Globe size={13} />
      <span className="leading-none">{language === 'en' ? 'EN' : 'हि'}</span>
    </motion.button>
  );
}
