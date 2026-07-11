# Supabase setup (real admin login + reviews database)

This gives the site a real backend: a secure admin login locked to your two
emails, and a fast database for reviews. Passwords are stored hashed by
Supabase — never in the code, never as plain text.

You do the account setup (I can't create accounts as you). The code is written
to switch on automatically once the two keys are in place.

---

## Step 1 — Create the project
1. Go to **https://supabase.com** → **Start your project** → sign in (GitHub is easiest).
2. **New project**. Pick a name (e.g. `pulsar-patch`), set a strong **database
   password** (save it in a password manager — this is the DB password, not your
   login), choose the region closest to you, and create it. Give it ~2 minutes.

## Step 2 — Grab your two keys
1. In the project, go to **Settings → API** (gear icon).
2. Copy two values:
   - **Project URL** — looks like `https://abcdxyz.supabase.co`
   - **anon public** key — a long string starting with `eyJ...`
3. These two are safe to use in the website (the anon key can only do what the
   security rules allow). **Do NOT** copy the `service_role` key anywhere — that
   one is a master key and must never touch the site.

## Step 3 — Create your two admin logins
1. Go to **Authentication → Users → Add user → Create new user**.
2. Add **`lclark0684@gmail.com`** with a password **you choose**. Check
   "Auto Confirm User" so it's active immediately.
3. Repeat for **`pulsarpatch@gmail.com`** with a password you choose.

These are the only two accounts that will exist, so they're the only ones that
can ever reach admin. You can change these passwords any time from this screen,
or later via a "forgot password" email.

## Step 4 — Create the reviews table + security rules
1. Go to **SQL Editor → New query**.
2. Open **`schema.sql`** (next to this file), copy the whole thing, paste it in,
   and click **Run**. You should see "Success."
3. This creates the `reviews` table, locks it down so the public can only read
   approved reviews and submit new ones, and lets only your two emails screen
   them. It also seeds your current live reviews.

## Step 5 — Add the keys to the website
Add these two environment variables in **Vercel** (Settings → Environment
Variables), for **Production** and **Preview**:

```
VITE_SUPABASE_URL=<your Project URL>
VITE_SUPABASE_ANON_KEY=<your anon public key>
```

For local development, also create a file named **`.env.local`** in the project
root with the same two lines. (This file is gitignored, so it stays private.)

Then **redeploy** in Vercel so the site picks them up.

---

## After that
Send me the **Project URL** (the anon key can stay in your env — I don't need to
see it), and I'll switch the site over: real admin login gated to your two
emails, and reviews stored in the database instead of per-browser. The site keeps
working exactly as it does now until the keys are in, so nothing breaks in the
meantime.
