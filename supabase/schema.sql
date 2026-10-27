-- Kreasi Undangan: RSVP dan buku tamu
-- Jalankan seluruh skrip ini di Supabase Dashboard > SQL Editor.
create table if not exists public.guestbook (
  id bigint generated always as identity primary key,
  invitation_slug text not null check (char_length(invitation_slug) between 1 and 120),
  guest_name text not null check (char_length(guest_name) between 1 and 60),
  attendance text not null check (attendance in ('Hadir','Tidak Hadir','Masih Ragu')),
  message text not null check (char_length(message) between 1 and 500),
  created_at timestamptz not null default now()
);

create index if not exists guestbook_invitation_created_idx
  on public.guestbook (invitation_slug, created_at desc);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.guestbook enable row level security;
alter table public.admin_users enable row level security;

create or replace function public.is_kreasi_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users a where a.user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_kreasi_admin() from public;
grant execute on function public.is_kreasi_admin() to authenticated;

drop policy if exists "Anyone can submit RSVP" on public.guestbook;
create policy "Anyone can submit RSVP"
on public.guestbook for insert to anon, authenticated
with check (
  char_length(trim(guest_name)) > 0
  and char_length(trim(message)) > 0
  and attendance in ('Hadir','Tidak Hadir','Masih Ragu')
);

drop policy if exists "Admins can read guestbook" on public.guestbook;
create policy "Admins can read guestbook"
on public.guestbook for select to authenticated
using (public.is_kreasi_admin());

drop policy if exists "Admins can update guestbook" on public.guestbook;
create policy "Admins can update guestbook"
on public.guestbook for update to authenticated
using (public.is_kreasi_admin())
with check (public.is_kreasi_admin());

drop policy if exists "Admins can delete guestbook" on public.guestbook;
create policy "Admins can delete guestbook"
on public.guestbook for delete to authenticated
using (public.is_kreasi_admin());

drop policy if exists "Admins can read admin list" on public.admin_users;
create policy "Admins can read admin list"
on public.admin_users for select to authenticated
using (public.is_kreasi_admin());

grant insert on public.guestbook to anon, authenticated;
grant select, update, delete on public.guestbook to authenticated;
grant select on public.admin_users to authenticated;
grant usage, select on sequence public.guestbook_id_seq to anon, authenticated;

-- Setelah membuat user admin di Authentication > Users, tambahkan UUID-nya:
-- insert into public.admin_users (user_id) values ('UUID_USER_ADMIN_DI_SINI');
