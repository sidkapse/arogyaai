# ArogyaAI — Codebase Guide

## Project Overview

ArogyaAI teaches Indians about 9 common ailments (diabetes, thyroid, cholesterol, BP, fatty liver, kidney stones, gall stones, UTI, PCOD/PCOS) through gamified micro-lessons. App is PWA, offline-capable, zero-backend. All data stored locally in `localStorage`.

- **User flow:** Onboarding → SignUp → Home (9 ailment grid) → Ailment section (learn cards → quiz) → Chat with AI
- **Gamification:** XP, streaks, badges, progress rings per ailment
- **AI:** GPT-4o-mini via browser SDK, per-ailment context injection

## Key Files

```
src/
  routes/
    Onboarding.tsx    # 3-slide intro
    SignIn/SignUp.tsx # Local profile creation
    Home.tsx          # Ailment grid + stats header
    Ailment.tsx       # Card player, tabs (learn/diet/lifestyle/redflags/quiz)
    Chat.tsx          # Global AI tutor
    Settings.tsx      # API key, theme, badges, version, reset
  components/
    ConceptCard.tsx   # Swipeable concept cards (back/next)
    Quiz.tsx          # 5-question per ailment (MCQ + T/F)
    ChatPanel.tsx     # Streaming chat UI
    ProgressRing.tsx  # SVG progress circle
    BottomNav.tsx     # Fixed nav bar
  lib/
    openai.ts         # GPT-4o-mini client factory + streaming
    colors.ts         # Palette hex values per ailment
    badges.ts         # Badge unlock rules
    content.ts        # Type defs + ailment loader
    version.ts        # APP_VERSION + SW_VERSION (baked at build)
  content/
    *.json            # 9 ailment JSONs (cards, food, quiz, lifestyle, redflags)
  store/
    profile.ts        # User profile (name, age, gender, birth date)
    progress.ts       # XP, streaks, per-ailment progress, badges
    settings.ts       # OpenAI key, theme choice
```

## Tech Stack

- **React 18** + TypeScript + Vite
- **Tailwind CSS** + Framer Motion (animations)
- **Zustand** (state, persisted to localStorage)
- **vite-plugin-pwa** (service worker, offline)
- **OpenAI SDK** (browser-side, user-provided key)

## Build & Deploy

```bash
npm install
npm run dev        # Vite dev server @ localhost:5173/arogyaai/
npm run build      # TypeScript check + Vite bundle + CP 404.html fallback
npm run preview    # Local preview of production build
```

GitHub Pages:
- Repo: `arogyaai`
- Base path: `/arogyaai/`
- Deploy: Commit to `main` → GitHub Actions → Auto-deploy to `username.github.io/arogyaai/`

## Key Design Decisions

1. **Single local profile per device** — no multi-user, no accounts
2. **Dynamic Tailwind classes purged at build** — use `colors.ts` hex values + inline styles for ailment-specific colors
3. **Safelist in tailwind.config.ts** — unlocks color variants (large CSS ~148 KB gzipped)
4. **Code splitting** — vendor/motion/ai/index chunks to keep main ~38 KB gzipped
5. **ConceptCard back button** — swipe right or click Back to replay cards
6. **Chat drawer** — bottom sheet modal, ChatPanel has close button (X in header)
7. **PWA offline-first** — precaches content JSONs, routes via service worker, OpenAI calls fail gracefully if no key

## Common Tasks

**Add a new ailment:**
1. Create `src/content/[ailment-id].json` (copy diabetes.json as template)
2. Add to `AILMENTS` export in `src/lib/content.ts`
3. Add color to `palette` map in `src/lib/colors.ts`
4. Rebuild

**Change colors:**
- Ailment color: edit `content/[ailment].json` `color` field
- Hex values: edit `src/lib/colors.ts` palette
- Do NOT hardcode color classes — always use `palette` prop + inline styles

**Update app version:**
- Bump `version` in `package.json`
- Rebuild → `__APP_VERSION__` baked in, PWA shows "Update available" to existing users

**Test locally:**
- `npm run dev` → http://localhost:5173/arogyaai/
- DevTools → Application → Service Workers → register + caching visible
- Settings → paste OpenAI key → Test Key

## Known Limitations

- Single profile only (would need IndexedDB for multi-user)
- No analytics/backend logging
- Offline chat doesn't work (no API key stored, fetch blocked)
- Tailwind safelist bloats CSS (could use CSS vars instead)
- Icons are SVG placeholders (swap `public/icons/` for real PNGs)

## TODOs for v2

- [ ] Swap illustrations from placeholders to real unDraw SVGs
- [ ] Add Dosha quiz + personalized recommendations
- [ ] Add offline-first chat via local LLM (ONNX.js)
- [ ] Export user progress as PDF
- [ ] Add spaced repetition quizzes
- [ ] Dark mode toggle (currently follows system)
- [ ] Add admin CMS for content edits
