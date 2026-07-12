-- Replace the placeholder reviews with the 5 real ones from the old Pulsar site.
-- Run this ONCE in the Supabase SQL editor. Safe to re-run.
--
-- It (1) makes sure the `verified` column exists, (2) removes the old
-- placeholder live reviews (any real pending submissions are left alone), and
-- (3) inserts the real reviews with real-ish dates so "5 months ago" etc. show.

-- 1. Verified flag (all these are verified buyers)
alter table public.reviews add column if not exists verified boolean not null default true;

-- 2. Clear the old placeholder live reviews
delete from public.reviews where status = 'live';

-- 3. Insert the real reviews (dates chosen so the site shows the right "X ago")
insert into public.reviews (stars, text, author, status, verified, created_at) values
  (5, 'These have become a staple amongst my fellow parents at hockey tournaments (we''re all in the same hotel and don''t have to drive anywhere, so...). It works every time for everyone who uses it!', 'SEAN', 'live', true, timestamptz '2026-02-12'),
  (5, 'I''ve tried multiple patches and never have seem to really understand the whole hangover cure thing from just a patch. But as soon as I tried Pulsar Patch, I kid you not, I felt completely normal the next day. I was not expecting that feeling especially with the amount of alcohol I do intake. I have already recommend several friends this product and they all LOVE it.', 'GABRIELLA', 'live', true, timestamptz '2025-09-12'),
  (5, 'The patch worked great! Slapped it on right before we started drinking and woke up feeling good the next day with no headache or hangover. I usually wake up with a massive headache and this time I didn''t. I had tried some anti-hangover drinks before and to start off, they taste nasty, left a nasty taste in my mouth and didn''t work. The patch is very unnoticeable and you forget it''s even on. I highly recommend you try it.', 'CHRIS M.', 'live', true, timestamptz '2025-07-12'),
  (5, 'Love it! Easy to use and very effective!', 'ADAM', 'live', true, timestamptz '2025-07-10'),
  (5, 'Very easily accessible and looks nice as well, can tell there was effort put into this.', 'SAMUEL', 'live', true, timestamptz '2025-07-08');

-- Optional: clear leftover test rows still sitting in the screening queue
-- (the DIAG / SETUP TEST ones). Uncomment to run.
-- delete from public.reviews where status = 'pending' and (author ilike '%test%' or author ilike '%diag%');
