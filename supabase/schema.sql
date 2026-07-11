-- Pulsar Patch — Supabase schema + security
-- Run this whole file once in the Supabase SQL editor (see README.md).
-- Safe to re-run: it drops and recreates the policies.

-- ── Reviews table ────────────────────────────────────────────────────────
create table if not exists public.reviews (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  stars        int  not null check (stars between 1 and 5),
  title        text,
  text         text not null,
  author       text not null,
  email        text,
  phone        text,
  order_number text,
  status       text not null default 'pending' check (status in ('pending','live','denied')),
  held         boolean not null default false
);

-- Fast lookups for the public list and the admin queue
create index if not exists reviews_status_created_idx
  on public.reviews (status, created_at desc);

-- ── Row Level Security ───────────────────────────────────────────────────
alter table public.reviews enable row level security;

-- Admin check: the signed-in user's email must be on the allow list.
-- Keep this list in sync with ADMIN_EMAILS in src/lib/supabase.js.
-- (Recreate policies cleanly each run.)
drop policy if exists "public reads live reviews"      on public.reviews;
drop policy if exists "anyone submits pending review"  on public.reviews;
drop policy if exists "admins read all reviews"        on public.reviews;
drop policy if exists "admins update reviews"          on public.reviews;

-- Anyone (even logged-out visitors) can read only APPROVED reviews.
create policy "public reads live reviews"
  on public.reviews for select
  using (status = 'live');

-- Anyone can submit a review, but only ever as 'pending' (never self-approve).
grant select, insert on public.reviews to anon, authenticated;
create policy "anyone submits pending review"
  on public.reviews for insert
  to anon, authenticated
  with check (status = 'pending');

-- Admins can read every review (the screening queue).
create policy "admins read all reviews"
  on public.reviews for select
  to authenticated
  using ((auth.jwt() ->> 'email') in ('lclark0684@gmail.com','pulsarpatch@gmail.com'));

-- Admins can change status (approve / deny / hold).
create policy "admins update reviews"
  on public.reviews for update
  to authenticated
  using      ((auth.jwt() ->> 'email') in ('lclark0684@gmail.com','pulsarpatch@gmail.com'))
  with check ((auth.jwt() ->> 'email') in ('lclark0684@gmail.com','pulsarpatch@gmail.com'));

-- ── Seed the current live reviews (only if the table is empty) ────────────
insert into public.reviews (stars, title, text, author, status)
select * from (values
  (5, 'IT REALLY WORKS!', 'I''ve tried a bunch of patches and honestly didn''t think a patch could do much for a hangover. But at least once a week I''m out having fun, and I feel so much better the next morning. No headache, no nausea. I cannot recommend this enough.', 'GABRIELA', 'live'),
  (5, 'INTERESTING, IT WORKS', 'I bought this for a concert and put it on right before we started drinking. Woke up the next day with no headache or hangover! The patch is so unnoticeable you forget it''s even on. Highly recommend.', 'JORDAN M.', 'live'),
  (5, 'LOVE IT', 'Love it! Easy to use and very effective!', 'ADAM', 'live'),
  (4, 'REALLY GOOD PRODUCT', 'Really good product. Takes about 30 min to kick in but once it does, you''re golden. Will definitely order again.', 'JESSICA', 'live'),
  (5, 'BACHELOR PARTY HERO', 'Bought this for my bachelor party and every single person was amazed the next day. We felt great!', 'CHRIS', 'live'),
  (5, 'LIFESAVER', 'As someone who gets terrible hangovers, this has been a lifesaver. Only three ingredients too, love the simplicity.', 'EMMA', 'live'),
  (3, 'DECENT', 'It helped a bit but I still felt a little rough. Maybe I needed to apply it earlier. Will try again.', 'JAKE', 'live')
) as seed(stars, title, text, author, status)
where not exists (select 1 from public.reviews);
