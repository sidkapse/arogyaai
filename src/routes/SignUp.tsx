import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProfile, type Profile } from '../store/profile';
import { ChevronRight } from 'lucide-react';

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 80 }, (_, i) => CURRENT_YEAR - 10 - i);

export function SignUp() {
  const { setProfile } = useProfile();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', birthYear: '', birthMonth: '', gender: '' });
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const set = (k: keyof typeof form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: '' }));
  };

  const validate = () => {
    const e: Partial<typeof form> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.birthYear) e.birthYear = 'Select year';
    if (!form.birthMonth) e.birthMonth = 'Select month';
    if (!form.gender) e.gender = 'Select gender';
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
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-5xl">👤</span>
          <h1 className="text-2xl font-extrabold mt-3 text-slate-800 dark:text-white">Create your profile</h1>
          <p className="text-slate-500 text-sm mt-1">Stays only on this device.</p>
        </div>

        <div className="flex flex-col gap-4">
          {/* Name */}
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Your name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. Priya"
              className="mt-1 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Birth year + month */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Birth year</label>
              <select
                value={form.birthYear}
                onChange={(e) => set('birthYear', e.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              >
                <option value="">Year</option>
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              {errors.birthYear && <p className="text-red-500 text-xs mt-1">{errors.birthYear}</p>}
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Birth month</label>
              <select
                value={form.birthMonth}
                onChange={(e) => set('birthMonth', e.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              >
                <option value="">Month</option>
                {MONTHS.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
              </select>
              {errors.birthMonth && <p className="text-red-500 text-xs mt-1">{errors.birthMonth}</p>}
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Gender</label>
            <div className="flex gap-2 mt-1">
              {(['male', 'female', 'other'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => set('gender', g)}
                  className={`flex-1 capitalize rounded-2xl border py-2.5 text-sm font-medium transition-colors ${
                    form.gender === g
                      ? 'bg-brand-500 border-brand-500 text-white'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-brand-300'
                  }`}
                >
                  {g === 'male' ? '♂ Male' : g === 'female' ? '♀ Female' : '⚧ Other'}
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
            Start Learning
            <ChevronRight size={18} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
