-- Run this in the Supabase SQL editor for your project.

create table if not exists schedules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  start_at timestamptz not null,
  end_at timestamptz,
  file_path text,
  created_at timestamptz not null default now()
);

alter table schedules enable row level security;

create policy "Users can view their own schedules"
  on schedules for select
  using (auth.uid() = user_id);

create policy "Users can insert their own schedules"
  on schedules for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own schedules"
  on schedules for update
  using (auth.uid() = user_id);

create policy "Users can delete their own schedules"
  on schedules for delete
  using (auth.uid() = user_id);

-- Storage bucket for attachments (run once)
insert into storage.buckets (id, name, public)
values ('attachments', 'attachments', false)
on conflict (id) do nothing;

create policy "Users can manage their own attachment files"
  on storage.objects for all
  using (bucket_id = 'attachments' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'attachments' and (storage.foldername(name))[1] = auth.uid()::text);
