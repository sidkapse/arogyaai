import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useProfile } from './store/profile';
import { useProgress } from './store/progress';
import { useSettings } from './store/settings';
import { Onboarding } from './routes/Onboarding';
import { SignIn } from './routes/SignIn';
import { SignUp } from './routes/SignUp';
import { Home } from './routes/Home';
import { AilmentRoute } from './routes/Ailment';
import { ChatRoute } from './routes/Chat';
import { SettingsRoute } from './routes/Settings';

function RequireProfile({ children }: { children: React.ReactNode }) {
  const profile = useProfile((s) => s.profile);
  if (!profile) return <Navigate to="/signin" replace />;
  return <>{children}</>;
}

export default function App() {
  const theme = useSettings((s) => s.theme);
  const touchStreak = useProgress((s) => s.touchStreak);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else if (theme === 'light') root.classList.remove('dark');
    else {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.matches ? root.classList.add('dark') : root.classList.remove('dark');
      const handler = (e: MediaQueryListEvent) =>
        e.matches ? root.classList.add('dark') : root.classList.remove('dark');
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, [theme]);

  useEffect(() => { touchStreak(); }, [touchStreak]);

  return (
    <Routes>
      <Route path="/" element={<Onboarding />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/home" element={<RequireProfile><Home /></RequireProfile>} />
      <Route path="/a/:ailmentId" element={<RequireProfile><AilmentRoute /></RequireProfile>} />
      <Route path="/chat" element={<RequireProfile><ChatRoute /></RequireProfile>} />
      <Route path="/settings" element={<RequireProfile><SettingsRoute /></RequireProfile>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
