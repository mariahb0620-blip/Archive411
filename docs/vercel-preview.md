# Vercel preview deploy

Use after local QA passes (`npm run beta:test`).

## Option A — Vercel Dashboard (recommended)

1. Push this branch to GitHub: `https://github.com/mariahb0620-blip/Archive411`
2. Open [vercel.com/new](https://vercel.com/new) → Import `Archive411`
3. Set environment variables for **Preview** and **Production**:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://zugvdpsdcefhukwubory.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | publishable key from Supabase → Settings → API Keys |
| `SUPABASE_SERVICE_ROLE_KEY` | secret key (server-only) |
| `NEXT_PUBLIC_APP_URL` | Your Vercel preview URL (update after first deploy) |

4. Deploy preview branch
5. Copy preview URL → Supabase Dashboard → Authentication → URL Configuration → add to **Redirect URLs**  
   (Wildcard `https://*.vercel.app/**` is already in `supabase/config.toml`; run `npx supabase config push --yes` to sync.)

## Option B — Vercel CLI

```powershell
# One-time login
npx vercel login

# Or set token from https://vercel.com/account/tokens
$env:VERCEL_TOKEN = "your-token"

# Preview deploy (uses .env.local values interactively on first run)
npm run deploy:preview
```

After deploy, set `NEXT_PUBLIC_APP_URL` in Vercel to the preview URL and redeploy.

## Pre-deploy

```bash
npm run catalog:verify && npm run build && npm run lint && npm run beta:test
```

## Production

Promote preview → production **only after founder approval** ([founder-handoff.md](./founder-handoff.md)).

## Secret key rotation

If the Supabase secret key was exposed, rotate in Dashboard → Settings → API Keys → create new secret → update `.env.local` and Vercel env vars → delete old key.
