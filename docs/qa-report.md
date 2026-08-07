# QA report — private beta (pre-founder review)

**Date:** August 7, 2026  
**Live URL:** https://archive411.vercel.app  
**Status:** Automated checks mostly green · **Redeploy required** for archive save fix · Founder walkthrough pending

---

## Summary for Mariah

The app is ready for a **founder walkthrough**, not for public beta invites yet.

| Gate | Result |
|------|--------|
| Catalog integrity (32/44) | ✅ Passed |
| Core journey (auth, build, Supabase) | ✅ Passed |
| Two-user RLS isolation | ✅ Passed |
| Live Vercel save to Archive | ⚠️ Bug found & fixed locally — **redeploy needed** |
| Real phone manual QA | ⏳ Mariah / team (checklist below) |
| Founder approval | ⏳ Schedule walkthrough |
| Beta tester invites | 🛑 **Blocked** until founder approves |

---

## Automated test results

### `npm run catalog:verify` — PASSED

- 32 designers, 44 products
- 0 `example.com` URLs
- 0 stock/AI images
- Profile-sensitive lookbook scoring OK

### `npm run beta:test` — PASSED (core + API on fixed build)

- Email sign-up / sign-in (no confirmation delay)
- Build My Look (feminine Y2K + streetwear masculine differ)
- Supabase archive save + list
- `POST /api/recommendations/build` → 200
- `POST /api/lookbooks` → 200 (after auth fix)
- `GET /api/lookbooks` → 200

### `npm run beta:rls` — PASSED

- User B cannot read User A lookbooks (direct select)
- User B cannot update or delete User A data
- User B `GET /api/lookbooks/{id}` → 404
- User A data intact after User B attack attempts

### `npm run vercel:journey` — PARTIAL on current deploy

Against **https://archive411.vercel.app** (before redeploy):

| Step | Result |
|------|--------|
| GET /intro | ✅ 200 |
| Sign up / sign in | ✅ |
| Build API | ✅ |
| Replace item API | ✅ |
| Save to Archive API | ❌ 500 (fixed in repo, not deployed) |
| Collections API | ❌ 401 (fixed in repo, not deployed) |
| Search / Surprise APIs | ✅ |
| Designers page | ✅ |

**Fix applied:** API routes now use `getRequestSupabase()` so Bearer tokens and cookie sessions both satisfy RLS on writes. Collections and saved-designers routes updated consistently.

**Action:** Push to GitHub → Vercel redeploy → re-run `PLAYWRIGHT_BASE_URL=https://archive411.vercel.app npm run vercel:journey`

---

## Manual QA checklist (Vercel + phone)

Use **https://archive411.vercel.app** after redeploy.

### Full user journey (~15 min)

- [ ] `/intro` → Skip → `/auth`
- [ ] Sign up with test email + password
- [ ] `/build` — complete questionnaire → lookbook generates
- [ ] Replace one item on lookbook detail
- [ ] **Save to My Archive**
- [ ] Refresh page — lookbook still visible
- [ ] Sign out → sign in — Archive still there
- [ ] `/search` — Search looks → lookbook
- [ ] `/surprise` — random lookbook
- [ ] `/collections` — create a collection
- [ ] `/designers` — open a profile → external link works

### Real phone (iPhone Safari + Android Chrome if available)

- [ ] Sign up flow
- [ ] Build My Look (all steps scroll correctly)
- [ ] Product drawer / sheet opens and closes
- [ ] Bottom nav (Home, Search, Create, Archive, Profile)
- [ ] Archive scroll + refresh persistence
- [ ] External product links open in new tab/browser

### Coming soon / placeholder audit

| UI | Behavior | OK? |
|----|----------|-----|
| Quick Generate (Create menu) | Non-clickable div, `aria-disabled` | ✅ |
| `/generate` page | “Coming soon” + links to Build / Home | ✅ |
| Save / Follow designer | Buttons **disabled**, labeled “(soon)” | ✅ |
| Designer dashboard sections | Text-only cards, not buttons | ✅ |
| Registry nav link | **Removed** from desktop header (was silent redirect) | ✅ Fixed |

---

## Founder walkthrough — schedule with Mariah

**Do not promote to production or invite beta testers until this passes.**

1. Share live URL: https://archive411.vercel.app  
2. Share demo script: [`founder-handoff.md`](./founder-handoff.md) (~20 min)  
3. Mariah tests on **mobile Safari** (primary)  
4. Walk approval gates in founder-handoff  
5. After ✅: promote production, set `NEXT_PUBLIC_APP_URL`, invite beta list  

**Suggested calendar invite title:**  
`Archive411 Private Beta — Founder Review (Mariah)`

**Agenda:**
- Intro + auth (5 min)
- Build My Look + Archive persistence (5 min)
- Search, Surprise, Collections, Designers (5 min)
- Mobile UX + approval gates (5 min)

---

## Commands reference

```bash
npm run catalog:verify
npm run beta:test
npm run beta:rls
PLAYWRIGHT_BASE_URL=https://archive411.vercel.app npm run vercel:journey
npm run e2e:vercel          # requires: npx playwright install chromium
npm run e2e:mobile          # iPhone + Pixel viewports
npm run qa:all              # verify + beta:test + rls
```

---

## Known blockers before beta invites

1. **Redeploy** Vercel with auth/RLS API fix (this commit)
2. **Mariah founder walkthrough** approval
3. **Phone manual QA** (cannot be fully automated)
4. Confirm Supabase: email confirmation off, redirect URLs set

---

## Do not do yet

- ❌ Promote beyond current preview/production without founder sign-off  
- ❌ Send beta tester invites  
- ❌ Enable public marketing / social launch
