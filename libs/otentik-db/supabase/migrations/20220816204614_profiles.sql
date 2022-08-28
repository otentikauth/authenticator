/**
* USER PROFILE
* Note: This table contains user data. Users should only be able to view and update their own data.
*/
create table profiles (
  id uuid references auth.users not null primary key,
  realname varchar(255),
  avatar_url text,
  passphrase text,
  password_hints text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table profiles enable row level security;
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

/**
* This trigger automatically creates a user entry when a new user signs up via Supabase Auth.
*/
create function public.handle_new_user()
returns trigger as
$$
  begin
    insert into public.profiles (id, realname, avatar_url, passphrase, password_hints)
    values (new.id, new.raw_user_meta_data ->> 'realname', new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'passphrase', new.raw_user_meta_data ->> 'password_hints');
    return new;
  end;
$$
language plpgsql security definer;

create trigger on_auth_user_created after insert on auth.users
  for each row execute procedure public.handle_new_user();


create function public.handle_profiles_updated_at()
returns trigger as
$$
  begin
    new.updated_at = now();
    return new;
  end;
$$
language plpgsql security definer;

create trigger on_profiles_updated before update on profiles
  for each row execute procedure handle_profiles_updated_at();

-- Set up Realtime!
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;
alter publication supabase_realtime add table profiles;
