create table vaults (
  id uuid default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  issuer text not null,
  user_identity text not null,
  secret text unique not null,
  algorithm text not null default 'SHA1',
  kind text not null default 'TOTP',
  period numeric not null CHECK (period > 0) default 30,
  digits numeric not null CHECK (digits > 0) default 6,
  backup_code text,
  icon_path text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id),
  unique(secret),
  constraint secret_length check (char_length(secret) >= 3)
);

alter table vaults enable row level security;
create policy "Can only view own vaults data." on vaults for select using (auth.uid() = user_id);
create policy "Users can insert their own vaults data." on vaults for insert with check (auth.uid() = user_id);
create policy "Users can update own vaults data." on vaults for update using (auth.uid() = user_id);
create policy "Users can delete own vaults data." on vaults for delete using (auth.uid() = user_id);

create function public.handle_vaults_updated_at()
returns trigger as
$$
  begin
    new.updated_at = now();
    return new;
  end;
$$
language plpgsql security definer;

create trigger on_vaults_updated before update on vaults
  for each row execute procedure handle_vaults_updated_at();
