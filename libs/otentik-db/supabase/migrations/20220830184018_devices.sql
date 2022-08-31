create table devices (
  id BIGSERIAL PRIMARY KEY,
  user_id uuid references auth.users not null,
  device_uuid uuid not null,
  unique_id varchar(24) not null,
  os_platform varchar(255) not null,
  os_version varchar(255) not null,
  host_name varchar(255) not null,
  alias_name varchar(255),
  activated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_online_at timestamp with time zone default null,
  unique(unique_id)
);

alter table devices enable row level security;
create policy "Can only view own connected devices." on devices for select using (auth.uid() = user_id);
create policy "Users can insert their own devices data." on devices for insert with check (auth.uid() = user_id);
create policy "Users can update own devices data." on devices for update using (auth.uid() = user_id);
create policy "Users can delete own devices data." on devices for delete using (auth.uid() = user_id);
