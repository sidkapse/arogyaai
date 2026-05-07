import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, CheckCircle, XCircle, RefreshCw, LogOut, Moon, Sun, Monitor, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../store/settings';
import { useProfile } from '../store/profile';
import { useProgress } from '../store/progress';
import { testKey } from '../lib/openai';
import { APP_VERSION, SW_VERSION } from '../lib/version';
import { onNeedRefresh, applyUpdate } from '../pwa/registerSW';
import { ALL_BADGES } from '../lib/badges';
import { BadgeChip } from '../components/BadgeChip';
import { BottomNav } from '../components/BottomNav';
import { LanguageToggle } from '../components/LanguageToggle';

export function SettingsRoute() {
  const { t } = useTranslation();
  const { openaiKey, setKey, theme, setTheme, language, setLanguage } = useSettings();
  const { signOut } = useProfile();
  const { badges, reset: resetProgress } = useProgress();
  const navigate = useNavigate();

  const [draftKey, setDraftKey] = useState(openaiKey);
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; error?: string } | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    onNeedRefresh(() => setUpdateAvailable(true));
  }, []);

  const saveKey = () => { setKey(draftKey.trim()); setTestResult(null); };

  const handleTest = async () => {
    saveKey();
    setTesting(true);
    setTestResult(null);
    const r = await testKey();
    setTestResult(r);
    setTesting(false);
  };

  const handleReset = () => {
    if (!confirm(t('settings.confirmReset'))) return;
    resetProgress();
    signOut();
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="px-5 pt-12 pb-6 bg-gradient-to-br from-slate-700 to-slate-900 text-white">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-2xl font-extrabold">{t('settings.title')}</h1>
          <LanguageToggle />
        </div>
      </div>

      <div className="px-4 py-6 space-y-6 max-w-lg mx-auto">
        {updateAvailable && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between rounded-2xl bg-brand-50 dark:bg-brand-900/30 border border-brand-200 dark:border-brand-700 px-4 py-3"
          >
            <div>
              <p className="font-semibold text-brand-700 dark:text-brand-300 text-sm">{t('settings.updateAvailable')}</p>
              <p className="text-xs text-brand-500">{t('settings.updateClick')}</p>
            </div>
            <button
              onClick={applyUpdate}
              className="flex items-center gap-1.5 rounded-full bg-brand-500 text-white px-3 py-1.5 text-xs font-semibold"
            >
              <RefreshCw size={12} /> {t('settings.update')}
            </button>
          </motion.div>
        )}

        {/* Language */}
        <section className="rounded-3xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 p-5 space-y-3">
          <h2 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <Globe size={16} /> {t('settings.language')}
          </h2>
          <div className="flex gap-2">
            {([
              { v: 'en' as const, label: t('settings.languageEn') },
              { v: 'hi' as const, label: t('settings.languageHi') },
            ]).map(({ v, label }) => (
              <button
                key={v}
                onClick={() => setLanguage(v)}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-2xl border py-2.5 text-sm font-medium transition-colors ${
                  language === v
                    ? 'bg-brand-500 border-brand-500 text-white'
                    : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-brand-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* API key */}
        <section className="rounded-3xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 p-5 space-y-3">
          <h2 className="font-bold text-slate-700 dark:text-slate-200">{t('settings.apiKey')}</h2>
          <p className="text-xs text-slate-400">{t('settings.apiKeyHint')}</p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type={showKey ? 'text' : 'password'}
                value={draftKey}
                onChange={(e) => { setDraftKey(e.target.value); setTestResult(null); }}
                placeholder="sk-…"
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 px-4 py-2.5 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={saveKey}
              className="flex-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold py-2 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              {t('settings.save')}
            </button>
            <button
              onClick={handleTest}
              disabled={testing || !draftKey.trim()}
              className="flex-1 rounded-full bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold py-2 disabled:opacity-40 transition-colors"
            >
              {testing ? t('settings.testing') : t('settings.testKey')}
            </button>
          </div>
          {testResult && (
            <div className={`flex items-center gap-2 text-sm rounded-xl px-3 py-2 ${
              testResult.ok
                ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
            }`}>
              {testResult.ok ? <CheckCircle size={15} /> : <XCircle size={15} />}
              {testResult.ok ? t('settings.keyWorks') : (testResult.error ?? t('settings.invalidKey'))}
            </div>
          )}
        </section>

        {/* Theme */}
        <section className="rounded-3xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 p-5 space-y-3">
          <h2 className="font-bold text-slate-700 dark:text-slate-200">{t('settings.theme')}</h2>
          <div className="flex gap-2">
            {([
              { v: 'light', icon: <Sun size={15} />, label: t('settings.light') },
              { v: 'dark', icon: <Moon size={15} />, label: t('settings.dark') },
              { v: 'system', icon: <Monitor size={15} />, label: t('settings.system') },
            ] as const).map(({ v, icon, label }) => (
              <button
                key={v}
                onClick={() => setTheme(v)}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-2xl border py-2 text-sm font-medium transition-colors ${
                  theme === v
                    ? 'bg-brand-500 border-brand-500 text-white'
                    : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-brand-300'
                }`}
              >
                {icon}{label}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 p-5 space-y-3">
          <h2 className="font-bold text-slate-700 dark:text-slate-200">{t('settings.badges')}</h2>
          <div className="flex flex-wrap gap-2">
            {ALL_BADGES.map((b) => (
              <BadgeChip key={b.id} badge={b} earned={badges.includes(b.id)} />
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 p-5 space-y-1">
          <h2 className="font-bold text-slate-700 dark:text-slate-200 mb-2">{t('settings.appInfo')}</h2>
          <p className="text-xs text-slate-400">{t('settings.appVersion')}: <span className="font-mono text-slate-600 dark:text-slate-300">{APP_VERSION}</span></p>
          <p className="text-xs text-slate-400">{t('settings.swVersion')}: <span className="font-mono text-slate-600 dark:text-slate-300">{SW_VERSION}</span></p>
        </section>

        <section className="rounded-3xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 p-5 space-y-3">
          <h2 className="font-bold text-red-600 dark:text-red-400">{t('settings.dangerZone')}</h2>
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 rounded-full border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 py-2.5 text-sm font-semibold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
          >
            <LogOut size={15} />
            {t('settings.resetProfile')}
          </button>
          <p className="text-xs text-red-400 text-center">{t('settings.resetWarning')}</p>
        </section>
      </div>

      <BottomNav />
    </div>
  );
}
