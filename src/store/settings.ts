import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import i18n from '../i18n';

export type Language = 'en' | 'hi';

type SettingsStore = {
  openaiKey: string;
  theme: 'light' | 'dark' | 'system';
  language: Language;
  setKey: (k: string) => void;
  setTheme: (t: 'light' | 'dark' | 'system') => void;
  setLanguage: (l: Language) => void;
};

export const useSettings = create<SettingsStore>()(
  persist(
    (set) => ({
      openaiKey: '',
      theme: 'system',
      language: 'en',
      setKey: (openaiKey) => set({ openaiKey }),
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => {
        i18n.changeLanguage(language);
        set({ language });
      },
    }),
    {
      name: 'ai.settings',
      onRehydrateStorage: () => (state) => {
        // Sync i18n with persisted language on app load
        try {
          if (state?.language) i18n.changeLanguage(state.language);
        } catch (e) {
          console.warn('Failed to sync i18n on rehydrate:', e);
        }
      },
    },
  ),
);
