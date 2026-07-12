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
  did_it_work  int  check (did_it_work between 1 and 10),
  recommend    int  check (recommend between 1 and 10),
  verified     boolean not null default true,
  status       text not null default 'pending' check (status in ('pending','live','denied')),
  held         boolean not null default false
);

-- For a table that already exists (adds newer columns safely).
alter table public.reviews add column if not exists did_it_work int check (did_it_work between 1 and 10);
alter table public.reviews add column if not exists recommend   int check (recommend   between 1 and 10);
alter table public.reviews add column if not exists verified    boolean not null default true;

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

-- ── Seed the real reviews (only if the table is empty) ────────────────────
insert into public.reviews (stars, text, author, status, verified, created_at)
select * from (values
  (5, 'These have become a staple amongst my fellow parents at hockey tournaments (we''re all in the same hotel and don''t have to drive anywhere, so...). It works every time for everyone who uses it!', 'SEAN', 'live', true, timestamptz '2026-02-12'),
  (5, 'I''ve tried multiple patches and never really understood the whole hangover-cure thing from just a patch. But as soon as I tried Pulsar Patch, I kid you not, I felt completely normal the next day. I was not expecting that feeling, especially with the amount of alcohol I intake.', 'GABRIELLA', 'live', true, timestamptz '2025-09-12'),
  (5, 'The patch worked great! Slapped it on right before we started drinking and woke up feeling good the next day with no headache or hangover. I usually wake up with a massive headache and this time I didn''t. I had tried some anti-hangover drinks before and to start off, they taste nasty, left a nasty taste in my mouth and didn''t work. The patch is very unnoticeable and you forget it''s even on. I highly recommend you try it.', 'CHRIS M.', 'live', true, timestamptz '2025-07-12'),
  (5, 'Love it! Easy to use and very effective!', 'ADAM', 'live', true, timestamptz '2025-07-10'),
  (5, 'Very easily accessible and looks nice as well, can tell there was effort put into this.', 'SAMUEL', 'live', true, timestamptz '2025-07-08')
) as seed(stars, text, author, status, verified, created_at)
where not exists (select 1 from public.reviews);
