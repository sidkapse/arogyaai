# ArogyaAI

> Learn to manage common Indian ailments through AI-powered gamified micro-lessons.

**Live app:** https://&lt;your-github-username&gt;.github.io/arogyaai/

## What it does

- 9 ailment sections: Diabetes, Thyroid, Cholesterol, Blood Pressure, Fatty Liver, Kidney Stones, Gall Bladder Stones, UTI, PCOD/PCOS
- Swipeable concept cards with bite-sized explanations
- Do-eat / Don't-eat food guides
- Lifestyle tips and red-flag symptoms
- Mini quiz per ailment (earn XP + badges)
- AI Tutor chat (per-ailment context + global) powered by GPT-4o-mini
- Offline-capable PWA — installable on Android and iOS
- All data stored locally in the browser — no account, no server

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5173/arogyaai/

## GitHub Pages deployment

1. Push repo to GitHub as `arogyaai`
2. Go to **Settings → Pages → Source** → set to **GitHub Actions**
3. Push to `main` — the action builds and deploys automatically

## OpenAI API key

The app needs your own OpenAI API key for the AI Tutor chat feature.

1. Open the live app → Settings
2. Paste your `sk-…` key and click **Test Key**
3. Key is stored only in your browser's `localStorage`

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS + Framer Motion
- Zustand (state) + vite-plugin-pwa (service worker)
- OpenAI browser SDK (GPT-4o-mini)

## Version

App version is baked from `package.json` at build time. Bump `"version"` and push to release a new version. Users see an "Update available" prompt automatically.
