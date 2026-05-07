import { NavLink } from 'react-router-dom';
import { Home, MessageCircle, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

export function BottomNav() {
  const { t } = useTranslation();
  const LINKS = [
    { to: '/home', icon: Home, label: t('nav.home') },
    { to: '/chat', icon: MessageCircle, label: t('nav.chat') },
    { to: '/settings', icon: Settings, label: t('nav.settings') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 pb-safe bg-white/90 dark:bg-slate-900/90 backdrop-blur border-t border-slate-100 dark:border-slate-800">
      <div className="flex justify-around max-w-lg mx-auto">
        {LINKS.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className="flex-1">
            {({ isActive }) => (
              <div className={clsx(
                'flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition-colors',
                isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 hover:text-slate-600',
              )}>
                <div className="relative">
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 -m-2 rounded-full bg-brand-50 dark:bg-brand-900/50"
                    />
                  )}
                  <Icon size={22} className="relative z-10" />
                </div>
                {label}
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
