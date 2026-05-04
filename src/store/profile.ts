import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Profile = {
  id: string;
  name: string;
  birthYear: number;
  birthMonth: number;
  gender: 'male' | 'female' | 'other';
  createdAt: number;
};

type ProfileStore = {
  profile: Profile | null;
  setProfile: (p: Profile) => void;
  signOut: () => void;
};

export const useProfile = create<ProfileStore>()(
  persist(
    (set) => ({
      profile: null,
      setProfile: (profile) => set({ profile }),
      signOut: () => set({ profile: null }),
    }),
    { name: 'ai.profile' },
  ),
);

export function ageFromProfile(p: Profile): number {
  const now = new Date();
  const y = now.getFullYear() - p.birthYear;
  const m = now.getMonth() + 1 - p.birthMonth;
  return m < 0 ? y - 1 : y;
}
