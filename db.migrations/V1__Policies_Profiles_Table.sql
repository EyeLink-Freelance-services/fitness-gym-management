-- Add policies + grant usage on schema (required)

alter table public.profiles enable row level security;

create policy "Users can select their own profile"
on public.profiles
as PERMISSIVE
for select
to authenticated
using (auth.uid() = id);

create policy "Users can update their own profile"
on public.profiles
as PERMISSIVE
for update
to authenticated
using (auth.uid() = id);

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON public.profiles TO authenticated;
GRANT UPDATE ON public.profiles TO authenticated;