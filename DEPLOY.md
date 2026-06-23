# Deploying HumanVoice (free, no backend services)

This is a **Vite + React SPA** with a single **Vercel serverless function** (`api/humanize.ts`)
that calls **Google Gemini** directly. No Supabase, no auth, no database. The only thing you
need is one free Gemini API key.

## 1. Get a free Gemini API key

Go to https://aistudio.google.com/apikey and create a key. Gemini's Flash models have a free
tier that's plenty for a personal tool. No credit card required to start.

## 2. Run it locally

Local dev must use **`vercel dev`**, not `npm run dev` — plain Vite only serves the frontend
and won't run the `/api/humanize` function (you'd get "failed to humanize").

```bash
npm install
npm i -g vercel          # one-time
# put your key in .env:
echo 'GEMINI_API_KEY=your_key_here' > .env
vercel dev               # http://localhost:3000
```

## 3. Deploy to Vercel

**Git import (recommended):**
1. Push this repo to GitHub.
2. Import it at https://vercel.com/new — Vercel auto-detects Vite.
3. Project → Settings → Environment Variables → add `GEMINI_API_KEY` (your key). Do **not**
   prefix it with `VITE_` — it must stay server-side.
4. Deploy. Every push redeploys.

**Or CLI:**
```bash
vercel                       # preview deploy
vercel env add GEMINI_API_KEY
vercel --prod                # production
```

## Notes

- Switch models by changing the `MODEL` constant in `api/humanize.ts`
  (`gemini-2.5-flash`, `gemini-2.5-flash-lite`, or `gemini-3.5-flash`).
- If you hit "Rate limit reached," you're bumping the free-tier limits — wait a moment, or
  enable billing in Google AI Studio for higher limits.
- The function runs two passes (rewrite + cleanup), so a humanize takes a few seconds.
