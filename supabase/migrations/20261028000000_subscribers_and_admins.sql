-- Email signups from the landing page.
create table public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique
    check (char_length(email) <= 254 and email = lower(email) and email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$'),
  created_at timestamptz not null default now()
);

-- People allowed into the admin dashboard. Creating an account grants nothing
-- on its own; access is given by adding the user's id here (see README).
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;

alter table public.subscribers enable row level security;
alter table public.admins enable row level security;

grant insert on public.subscribers to anon, authenticated;
grant select on public.subscribers to authenticated;
grant select on public.admins to authenticated;

-- Visitors can add their email but never read the list back.
create policy "Anyone can subscribe"
  on public.subscribers for insert
  to anon, authenticated
  with check (true);

create policy "Admins can read subscribers"
  on public.subscribers for select
  to authenticated
  using ((select public.is_admin()));

create policy "Users can see their own admin row"
  on public.admins for select
  to authenticated
  using (user_id = (select auth.uid()));
