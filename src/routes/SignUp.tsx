import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useProfile, type Profile } from '../store/profile';
import { ChevronRight } from 'lucide-react';
import { LanguageToggle } from '../components/LanguageToggle';

const MONTHS_EN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTHS_HI = ['जनवरी','फरवरी','मार्च','अप्रैल','मई','जून','जुलाई','अगस्त','सितंबर','अक्टूबर','नवंबर','दिसंबर'];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 80 }, (_, i) => CURRENT_YEAR - 10 - i);

export function SignUp() {
  const { t, i18n } = useTranslation();
  const { setProfile } = useProfile();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', birthYear: '', birthMonth: '', gender: '' });
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const months = i18n.language === 'hi' ? MONTHS_HI : MONTHS_EN;

  const set = (k: keyof typeof form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: '' }));
  };

  const validate = () => {
    const e: Partial<typeof form> = {};
    if (!form.name.trim()) e.name = t('signup.nameRequired');
    if (!form.birthYear) e.birthYear = t('signup.yearRequired');
    if (!form.birthMonth) e.birthMonth = t('signup.monthRequired');
    if (!form.gender) e.gender = t('signup.genderRequired');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    const profile: Profile = {
      id: crypto.randomUUID(),
      name: form.name.trim(),
      birthYear: parseInt(form.birthYear),
      birthMonth: parseInt(form.birthMonth),
      gender: form.gender as Profile['gender'],
      createdAt: Date.now(),
    };
    setProfile(profile);
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative">
      <div className="absolute top-6 right-5">
        <LanguageToggle variant="plain" />
      </div>

      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-5xl">👤</span>
          <h1 className="text-2xl font-extrabold mt-3 text-slate-800 dark:text-white">{t('signup.title')}</h1>
          <p className="text-slate-500 text-sm mt-1">{t('signup.subtitle')}</p>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('signup.name')}</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder={t('signup.namePlaceholder')}
              className="mt-1 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('signup.birthYear')}</label>
              <select
                value={form.birthYear}
                onChange={(e) => set('birthYear', e.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              >
                <option value="">{t('signup.selectYear')}</option>
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              {errors.birthYear && <p className="text-red-500 text-xs mt-1">{errors.birthYear}</p>}
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('signup.birthMonth')}</label>
              <select
                value={form.birthMonth}
                onChange={(e) => set('birthMonth', e.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              >
                <option value="">{t('signup.selectMonth')}</option>
                {months.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
              </select>
              {errors.birthMonth && <p className="text-red-500 text-xs mt-1">{errors.birthMonth}</p>}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('signup.gender')}</label>
            <div className="flex gap-2 mt-1">
              {(['male', 'female', 'other'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => set('gender', g)}
                  className={`flex-1 rounded-2xl border py-2.5 text-sm font-medium transition-colors ${
                    form.gender === g
                      ? 'bg-brand-500 border-brand-500 text-white'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-brand-300'
                  }`}
                >
                  {g === 'male' ? '♂ ' + t('signup.male') : g === 'female' ? '♀ ' + t('signup.female') : '⚧ ' + t('signup.other')}
                </button>
              ))}
            </div>
            {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={submit}
            className="mt-2 w-full flex items-center justify-center gap-2 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-3.5 shadow-md transition-colors"
          >
            {t('signup.startLearning')}
            <ChevronRight size={18} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
