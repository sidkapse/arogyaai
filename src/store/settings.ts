import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type SettingsStore = {
  openaiKey: string;
  theme: 'light' | 'dark' | 'system';
  setKey: (k: string) => void;
  setTheme: (t: 'light' | 'dark' | 'system') => void;
};

export const useSettings = create<SettingsStore>()(
  persist(
    (set) => ({
      openaiKey: '',
      theme: 'system',
      setKey: (openaiKey) => set({ openaiKey }),
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'ai.settings' },
  ),
);
