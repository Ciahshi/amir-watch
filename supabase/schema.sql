-- Amir Watch - Supabase setup

create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  source_type text not null check (source_type in ('url','upload')),
  source_url text,
  storage_path text,
  created_at timestamptz not null default now()
);

create index if not exists videos_user_id_idx on public.videos(user_id);

create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  token uuid not null unique,
  user_id uuid not null references auth.users(id) on delete cascade,
  video_id uuid not null references public.videos(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists rooms_token_idx on public.rooms(token);

alter table public.videos enable row level security;
alter table public.rooms enable row level security;

drop policy if exists "videos_select_own" on public.videos;
drop policy if exists "videos_insert_own" on public.videos;
drop policy if exists "videos_update_own" on public.videos;
drop policy if exists "videos_delete_own" on public.videos;

create policy "videos_select_own" on public.videos for select using (auth.uid() = user_id);
create policy "videos_insert_own" on public.videos for insert with check (auth.uid() = user_id);
create policy "videos_update_own" on public.videos for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "videos_delete_own" on public.videos for delete using (auth.uid() = user_id);

drop policy if exists "rooms_owner_select" on public.rooms;
drop policy if exists "rooms_owner_insert" on public.rooms;
drop policy if exists "rooms_owner_delete" on public.rooms;

create policy "rooms_owner_select" on public.rooms for select using (auth.uid() = user_id);
create policy "rooms_owner_insert" on public.rooms for insert with check (auth.uid() = user_id);
create policy "rooms_owner_delete" on public.rooms for delete using (auth.uid() = user_id);

-- Public video bucket. Database metadata remains private; a deliberately shared room may expose its video URL.
insert into storage.buckets (id, name, public)
values ('videos','videos',true)
on conflict (id) do update set public = true;

drop policy if exists "videos_storage_insert_own" on storage.objects;
drop policy if exists "videos_storage_update_own" on storage.objects;
drop policy if exists "videos_storage_delete_own" on storage.objects;

create policy "videos_storage_insert_own" on storage.objects
for insert to authenticated
with check (bucket_id='videos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "videos_storage_update_own" on storage.objects
for update to authenticated
using (bucket_id='videos' and (storage.foldername(name))[1] = auth.uid()::text)
with check (bucket_id='videos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "videos_storage_delete_own" on storage.objects
for delete to authenticated
using (bucket_id='videos' and (storage.foldername(name))[1] = auth.uid()::text);

-- Guest access to a shared room by an unguessable token.
-- The function returns only the fields needed for playback.
drop function if exists public.get_shared_room(uuid);
create or replace function public.get_shared_room(p_token uuid)
returns table(title text, video_url text)
language sql
security definer
set search_path = public
as $$
  select v.title,
         case
           when v.source_type = 'url' then v.source_url
           else 'https://' || split_part(current_setting('request.headers', true), 'host=', 2)
         end as video_url
  from public.rooms r
  join public.videos v on v.id = r.video_id
  where r.token = p_token;
$$;

-- Use this second function to resolve uploaded videos through Storage.
-- It returns the public URL generated from Supabase's storage URL.
drop function if exists public.get_shared_room_v2(uuid, text);
create or replace function public.get_shared_room_v2(p_token uuid, p_storage_base text)
returns table(title text, video_url text)
language sql
security definer
set search_path = public
as $$
  select v.title,
         case
           when v.source_type = 'url' then v.source_url
           else p_storage_base || '/storage/v1/object/public/videos/' || v.storage_path
         end
  from public.rooms r
  join public.videos v on v.id = r.video_id
  where r.token = p_token;
$$;

revoke all on function public.get_shared_room(uuid) from anon, authenticated;
grant execute on function public.get_shared_room(uuid) to anon, authenticated;
revoke all on function public.get_shared_room_v2(uuid,text) from anon, authenticated;
grant execute on function public.get_shared_room_v2(uuid,text) to anon, authenticated;
