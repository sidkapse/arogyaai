# ArogyaAI — Memory & Key Facts

## Project Identity

- **Name:** ArogyaAI (Arogya = health in Sanskrit)
- **Purpose:** Teach Indians about 9 common ailments via gamified AI-powered micro-lessons
- **Hosting:** GitHub Pages static site (zero backend)
- **Data:** All local (localStorage) — no server, no accounts

## Ailments (9 total)

| ID | Title | Hero | Color | Key Concept |
|---|---|---|---|---|
| diabetes | Diabetes | 🩸 | red | High blood sugar → insulin resistance → control via diet |
| thyroid | Thyroid Imbalance | 🦋 | purple | TSH hormone → metabolism speed → iodine critical |
| cholesterol | Cholesterol | 🫀 | amber | LDL (bad) vs HDL (good) → artery buildup → fiber helps |
| bp | Blood Pressure | 💢 | rose | Force on arteries → salt intake key → exercise helps |
| fatty-liver | Fatty Liver | 🫁 | orange | Fat buildup in liver → fructose villain → weight loss reverses |
| kidney-stones | Kidney Stones | 🪨 | yellow | Mineral crystals → hydration critical → citrate prevents |
| gall-stones | Gall Bladder Stones | 🫘 | lime | Bile concentration → regular meals prevent → surgery last resort |
| uti | UTI | 🚽 | cyan | Bacterial infection → hydration flushes → antibiotics complete |
| pcod-pcos | PCOD/PCOS | 🌸 | pink | Hormonal → insulin → low-GI diet + exercise → dosha v2 |

## Color Palette (inline styles via `getPalette()`)

Each ailment maps to hex colors in `src/lib/colors.ts`:
- `hex500` — primary brand color
- `hex200` — light border
- `hex50` — lightest background
- `hex700` — dark text
- `gradient` — header gradient

Example: diabetes red → `#ef4444` (500), `#fecaca` (200), `#fef2f2` (50)

## User Journey

1. **Onboarding** (`/`) — 3 slides, swipeable, CTA "Get Started"
2. **SignIn** (`/signin`) — resume existing profile or create new
3. **SignUp** (`/signup`) — Name, birth year/month, gender → save to localStorage
4. **Home** (`/home`) — 9 ailment grid, XP/streak/badge count, bottom nav
5. **Ailment** (`/a/:ailmentId`) — 5 tabs:
   - Learn: swipeable concept cards (back/next buttons)
   - Diet: do-eat/don't-eat chips
   - Lifestyle: numbered tips
   - Red Flags: warning symptoms
   - Quiz: 5 questions (MCQ + T/F), score, XP reward
6. **Chat** (`/chat`) — Global AI tutor (no ailment context)
7. **Settings** (`/settings`) — API key, theme, app version, reset profile

Per-ailment chat via floating "Ask AI" button → opens ChatPanel with ailment context.

## Gamification Rules

- **XP:** +5 per card viewed (once), +50 per quiz pass (≥80%)
- **Streak:** Increment if `lastActiveDate` = yesterday, reset if older
- **Badges:** 5 total (First Steps, Diet Master, All-Rounder, Quiz Pro, Curious Mind)
- **Progress:** Per-ailment % = 60% cards viewed + 40% quiz best score

## State Management (Zustand + localStorage)

```
useProfile    → ai.profile     → id, name, birth date, gender
useProgress   → ai.progress    → xp, streaks, per-ailment progress, badges
useSettings   → ai.settings    → openaiKey, theme (light/dark/system)
```

## OpenAI Integration

- **Model:** GPT-4o-mini
- **Key:** User-provided in Settings, stored plaintext in localStorage
- **System prompt template:**
  ```
  "You are a friendly health educator helping an Indian user understand [ailment].
   User: {name}, age {age}, {gender}.
   Use Indian food examples. Keep replies short, plain English, avoid jargon.
   Never replace doctor advice. Flag red-flag symptoms.
   [ailment context: oneliner + top 5 cards]"
  ```
- **Streaming:** Via `streamChat()` → real-time token output to ChatPanel
- **Error:** MissingKeyError if no key → user redirected to Settings

## Design System

- **Header:** Ailment-specific gradient (from `colors.ts`)
- **Cards:** White background, coloured top strip or left border
- **Emoji blobs:** White background, coloured border (ConceptCard hero)
- **Progress ring:** Ailment color, SVG-based
- **Buttons:** Gradient background per ailment (via inline styles)
- **Dark mode:** `dark:` class prefix throughout, CSS custom properties respect prefers-color-scheme

## Build Output

- **Main bundle:** ~38 KB gzip (app logic)
- **CSS:** ~17 KB gzip (Tailwind + safelist)
- **Vendor chunk:** ~53 KB gzip (React, React-Router, Zustand)
- **Motion chunk:** ~38 KB gzip (Framer Motion)
- **AI chunk:** ~27 KB gzip (OpenAI SDK)
- **PWA precache:** ~640 KB (content JSONs + assets)
- **Deployment:** GitHub Actions → `dist/` → GitHub Pages

## Critical Implementation Notes

1. **ConceptCard** — Accept `palette` prop (not color string), use inline styles
2. **Dynamic Tailwind classes** — WILL be purged; use safelist or inline styles
3. **localStorage keys** — prefixed `ai.` (profile, progress, settings, appVersion, swVersion)
4. **Offline-first** — Service worker precaches routes + content, no server fallback for /api/
5. **Back button** — Swipe right OR click "Back" button on ConceptCard (disabled on first card)
6. **Chat close** — Single X button in ChatPanel header (not duplicated in drawer)
7. **404 fallback** — `/arogyaai/404.html` copies from index.html for SPA deep-link reload
8. **GitHub Pages base** — All assets must reference `/arogyaai/` prefix (set in vite.config.ts `base`)

## Next Steps (if continuing)

- Swap placeholder SVG icons to real unDraw illustrations
- Add Dosha assessment quiz (10+10 questions) with personalized food tips
- Implement spaced repetition quiz system (review cards on days 1, 3, 7, 14)
- Add progress export as PDF
- Consider offline LLM via ONNX.js for chat without API key
