import { useTranslation } from 'react-i18next';
import { BottomNav } from '../components/BottomNav';
import { ChatPanel } from '../components/ChatPanel';
import { LanguageToggle } from '../components/LanguageToggle';

export function ChatRoute() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col pb-16">
      <div className="flex-1 flex flex-col">
        <div className="px-5 pt-12 pb-4 bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h1 className="text-2xl font-extrabold">{t('chat.title')}</h1>
              <p className="text-white/80 text-sm mt-1">{t('chat.subtitle')}</p>
            </div>
            <LanguageToggle />
          </div>
        </div>
        <div className="flex-1">
          <ChatPanel ailment={null} />
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
