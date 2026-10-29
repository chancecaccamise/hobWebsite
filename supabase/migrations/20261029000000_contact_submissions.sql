-- Messages from the website's contact form.
create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 200),
  email text not null
    check (char_length(email) <= 254 and email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$'),
  phone text check (char_length(phone) <= 40),
  subject text check (char_length(subject) <= 200),
  message text not null check (char_length(message) between 1 and 5000),
  -- Category picked on the form (e.g. "General", "Order"). Free text so the
  -- options can change on the form without a migration.
  inquiry_type text check (char_length(inquiry_type) <= 100),
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index contact_submissions_created_at_idx on public.contact_submissions (created_at desc);

alter table public.contact_submissions enable row level security;

grant insert on public.contact_submissions to anon, authenticated;
grant select, delete on public.contact_submissions to authenticated;
-- Admins can only change read state, never edit what someone sent.
grant update (read_at) on public.contact_submissions to authenticated;

create policy "Anyone can send a message"
  on public.contact_submissions for insert
  to anon, authenticated
  with check (read_at is null);

create policy "Admins can read messages"
  on public.contact_submissions for select
  to authenticated
  using ((select public.is_admin()));

create policy "Admins can mark messages read"
  on public.contact_submissions for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Admins can delete messages"
  on public.contact_submissions for delete
  to authenticated
  using ((select public.is_admin()));
