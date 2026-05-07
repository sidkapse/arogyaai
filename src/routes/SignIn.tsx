import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useProfile } from '../store/profile';
import { LogIn, UserPlus } from 'lucide-react';
import { LanguageToggle } from '../components/LanguageToggle';

export function SignIn() {
  const { t } = useTranslation();
  const { profile, signOut } = useProfile();
  const navigate = useNavigate();

  const resume = () => navigate('/home');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 gap-8 relative">
      <div className="absolute top-6 right-5">
        <LanguageToggle variant="plain" />
      </div>

      <div className="flex flex-col items-center gap-2">
        <span className="text-6xl">🩺</span>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">ArogyaAI</h1>
        <p className="text-slate-500 text-center max-w-xs">
          {t('signin.appTagline')}
        </p>
      </div>

      <div className="w-full max-w-xs flex flex-col gap-3">
        {profile ? (
          <>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={resume}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-3.5 shadow-md transition-colors"
            >
              <LogIn size={18} />
              {t('signin.continueAs', { name: profile.name })}
            </motion.button>
            <button
              onClick={() => { signOut(); navigate('/'); }}
              className="w-full text-sm text-slate-400 hover:text-red-500 transition-colors text-center py-2"
            >
              {t('signin.signOut')}
            </button>
          </>
        ) : (
          <>
            <motion.div whileTap={{ scale: 0.97 }}>
              <Link
                to="/signup"
                className="w-full flex items-center justify-center gap-2 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-3.5 shadow-md transition-colors"
              >
                <UserPlus size={18} />
                {t('signin.createNew')}
              </Link>
            </motion.div>
            <p className="text-center text-xs text-slate-400">
              {t('signin.noAccountNeeded')}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
