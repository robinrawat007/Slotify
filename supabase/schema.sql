-- ============================================================
-- SLOTIFY — Supabase Database Schema
-- Run this in your Supabase project SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── PROFILES ───────────────────────────────────────────────
-- Auto-created when a user signs up via Supabase Auth trigger
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text not null default '',
  avatar_url  text,
  role        text not null default 'user' check (role in ('user', 'admin')),
  skill_level text default 'Intermediate',
  sport       text default 'Football',
  created_at  timestamptz default now()
);

-- Trigger: create profile row automatically on new user signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── VENUES ─────────────────────────────────────────────────
create table if not exists public.venues (
  id              uuid primary key default uuid_generate_v4(),
  owner_id        uuid references public.profiles(id) on delete set null,
  name            text not null,
  location        text not null,
  distance        text,
  price_per_hour  integer not null,
  rating          numeric(2,1) default 4.0 check (rating between 0 and 5),
  reviews         integer default 0,
  sports          text[] not null default '{}',
  image_url       text,
  latitude        double precision,
  longitude       double precision,
  created_at      timestamptz default now()
);

-- ─── SLOTS ──────────────────────────────────────────────────
create table if not exists public.slots (
  id           uuid primary key default uuid_generate_v4(),
  venue_id     uuid not null references public.venues(id) on delete cascade,
  time         text not null,          -- e.g. "06:00 AM"
  is_available boolean default true,
  created_at   timestamptz default now()
);

-- ─── BOOKINGS ───────────────────────────────────────────────
create table if not exists public.bookings (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  venue_id     uuid not null references public.venues(id) on delete cascade,
  slot_ids     uuid[] not null default '{}',
  date         date not null,
  status       text not null default 'upcoming' check (status in ('upcoming', 'past', 'cancelled')),
  total_amount integer not null,
  created_at   timestamptz default now()
);

-- ─── MATCHES ────────────────────────────────────────────────
create table if not exists public.matches (
  id               uuid primary key default uuid_generate_v4(),
  host_id          uuid not null references public.profiles(id) on delete cascade,
  title            text not null,
  sport            text not null,
  venue_name       text not null,
  date             text not null,
  time             text not null,
  price_per_player integer not null,
  skill_level      text not null default 'Beginner',
  max_players      integer not null default 10,
  players_joined   integer not null default 1,
  created_at       timestamptz default now()
);

-- Match participants join table
create table if not exists public.match_players (
  match_id   uuid references public.matches(id) on delete cascade,
  user_id    uuid references public.profiles(id) on delete cascade,
  joined_at  timestamptz default now(),
  primary key (match_id, user_id)
);

-- ─── REVIEWS ────────────────────────────────────────────────
create table if not exists public.reviews (
  id         uuid primary key default uuid_generate_v4(),
  venue_id   uuid not null references public.venues(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  rating     integer not null check (rating between 1 and 5),
  comment    text,
  created_at timestamptz default now(),
  unique (venue_id, user_id)
);

-- ─── ROW LEVEL SECURITY ─────────────────────────────────────
alter table public.profiles   enable row level security;
alter table public.venues     enable row level security;
alter table public.slots      enable row level security;
alter table public.bookings   enable row level security;
alter table public.matches    enable row level security;
alter table public.match_players enable row level security;
alter table public.reviews    enable row level security;

-- Profiles: anyone can read, only self can update
create policy "Profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile"      on public.profiles for update using (auth.uid() = id);

-- Venues: anyone can read, only admins/owners can insert/update
create policy "Venues are viewable by everyone"   on public.venues for select using (true);
create policy "Admins can manage venues"          on public.venues for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Slots: anyone can read
create policy "Slots are viewable by everyone"    on public.slots for select using (true);

-- Bookings: users can only see their own
create policy "Users view own bookings"           on public.bookings for select using (auth.uid() = user_id);
create policy "Users can create bookings"         on public.bookings for insert with check (auth.uid() = user_id);
create policy "Users can cancel own bookings"     on public.bookings for update using (auth.uid() = user_id);

-- Matches: anyone can view, auth users can create
create policy "Matches are viewable by everyone"  on public.matches for select using (true);
create policy "Auth users can create matches"     on public.matches for insert with check (auth.uid() = host_id);
create policy "Hosts can update own matches"      on public.matches for update using (auth.uid() = host_id);

-- Match players: auth users can join
create policy "Anyone can view players"           on public.match_players for select using (true);
create policy "Auth users can join matches"       on public.match_players for insert with check (auth.uid() = user_id);

-- Reviews: anyone can read
create policy "Reviews are viewable by everyone"  on public.reviews for select using (true);
create policy "Auth users can write reviews"      on public.reviews for insert with check (auth.uid() = user_id);

-- ─── SEED DATA (optional, for dev) ──────────────────────────
insert into public.venues (name, location, distance, price_per_hour, rating, reviews, sports, image_url, latitude, longitude)
values
  ('Greenfield Sports Arena', 'Sector 15, Gurgaon', '2.1 km', 1200, 4.8, 124,
   array['Football', 'Cricket'], 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=800', 28.4595, 77.0266),
  ('Champions Cricket Ground', 'Dwarka, Delhi', '3.5 km', 800, 4.5, 89,
   array['Cricket', 'Football'], 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800', 28.5921, 77.0468),
  ('ProCourt Badminton', 'Noida Sector 62', '5.2 km', 1500, 4.7, 201,
   array['Badminton', 'Tennis'], 'https://images.unsplash.com/photo-1545809074-59472b3f5ecc?q=80&w=800', 28.6270, 77.3741)
on conflict do nothing;

-- ─── FUNCTIONS & RPCS ───────────────────────────────────────

-- Join Match: Increment player count
create or replace function public.increment_match_players(match_id uuid)
returns void language plpgsql security definer as $$
begin
  update public.matches
  set players_joined = players_joined + 1
  where id = match_id;
end;
$$;

-- Atomic Booking: Create booking and mark slots as unavailable in one go
create or replace function public.create_booking_atomic(
  p_user_id uuid,
  p_venue_id uuid,
  p_slot_ids uuid[],
  p_date date,
  p_total_amount integer
) returns uuid language plpgsql security definer as $$
declare
  v_booking_id uuid;
begin
  -- Check if any slots are already booked (extra safety)
  if exists (
    select 1 from public.slots 
    where id = any(p_slot_ids) and is_available = false
  ) then
    raise exception 'One or more slots are already booked';
  end if;

  -- Create the booking
  insert into public.bookings (user_id, venue_id, slot_ids, date, total_amount)
  values (p_user_id, p_venue_id, p_slot_ids, p_date, p_total_amount)
  returning id into v_booking_id;

  -- Mark slots as unavailable
  update public.slots
  set is_available = false
  where id = any(p_slot_ids);

  return v_booking_id;
end;
$$;
