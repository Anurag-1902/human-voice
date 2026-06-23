# HumanVoice — AI Text Humanizer

Turn AI-generated text into natural, human-sounding writing — without changing what it says.
Free to run, no accounts, no database.

## How it works

- **Frontend:** Vite + React + TypeScript + Tailwind + shadcn/ui (landing page at `/`,
  humanizer workspace at `/app`).
- **Backend:** a single Vercel serverless function, `api/humanize.ts`, that calls the
  **Google Gemini API** directly. It runs a two-pass rewrite (humanize + cleanup), supports
  four tone presets, condense mode, and a targeted "re-humanize" pass, and preserves the
  original paragraph structure. The client-side AI-detection scorer lives in `src/lib/aiScore.ts`.

There is **no Supabase, no auth, and no database** — the previous Lovable/Supabase backend was
removed because that hosted project no longer exists.

## Quick start

```bash
npm install

# free key from https://aistudio.google.com/apikey
echo 'GEMINI_API_KEY=your_key_here' > .env

npm i -g vercel
vercel dev        # http://localhost:3000  (use this, NOT npm run dev)
```

> `npm run dev` only serves the frontend and won't run `/api/humanize`. Use `vercel dev` so the
> serverless function runs locally.

## Deploy

See **DEPLOY.md**. In short: push to GitHub, import at vercel.com/new, add the `GEMINI_API_KEY`
environment variable (server-side, **not** `VITE_`-prefixed), and deploy.

## Project structure

```
api/
  humanize.ts        Vercel serverless function → Gemini (the whole pipeline)
src/
  components/        landing/, workspace/, shared/, ui/
  hooks/useHumanizer.ts   calls /api/humanize
  lib/aiScore.ts          AI-detection scorer
  pages/            Landing, AppPage (workspace), NotFound
vercel.json          Vite + SPA rewrite (excludes /api/*)
```

## Configuration

- **Model:** change the `MODEL` constant in `api/humanize.ts`
  (`gemini-2.5-flash` default, `gemini-2.5-flash-lite` cheapest, `gemini-3.5-flash` newest).
- **Env var:** `GEMINI_API_KEY` (required, server-side only).
