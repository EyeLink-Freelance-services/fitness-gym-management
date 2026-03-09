-- Helpers
-- =========================================================
-- TODO: updated_at trigger if frontend is not setting it
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- set active_company_id after logged in
DROP FUNCTION public.ensure_active_company();
CREATE OR REPLACE FUNCTION public.ensure_active_company()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_company uuid;
  result json;
BEGIN
	
	-- 1) if already set, return it
  SELECT p.active_company_id
  INTO v_company
  FROM public.profiles p
  WHERE p.id = auth.uid();

	-- 2) pick best existing membership
  IF v_company IS NULL THEN
    SELECT cu.company_id
    INTO v_company
    FROM public.company_user cu
    WHERE cu.user_id = auth.uid()
    ORDER BY cu.is_owner DESC, cu.joined_at DESC
    LIMIT 1;
  END IF;

	-- 3) if no company, create personal workspace + owner link
  IF v_company IS NULL THEN
    INSERT INTO public.companies(name, mode)
    VALUES ('Personal Workspace', 'personal')
    RETURNING id INTO v_company;

    INSERT INTO public.company_user(user_id, company_id, is_owner)
    VALUES (auth.uid(), v_company, true);
  END IF;

	-- 4) set profile active
  UPDATE public.profiles
  SET active_company_id = v_company,
      updated_at = now()
  WHERE id = auth.uid();

  SELECT json_build_object(
    'company_id', c.id,
    'company_name', c.name,
    'company_mode', c.mode
  )
  INTO result
  FROM public.companies c
  WHERE c.id = v_company;

  RETURN result;

END;
$$;

REVOKE ALL ON FUNCTION public.ensure_active_company() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ensure_active_company() TO authenticated;

-- Active company ids for current user (Optional)  NOT YET RAN (it is for SUPER ADMIN)
create or replace function public.current_company_ids()
returns uuid[]
language sql
stable
as $$
  select coalesce(array_agg(cu.company_id), '{}')::uuid[]
  from public.company_user cu
  where cu.user_id = auth.uid()
$$;

-- Is current user in company?
CREATE OR REPLACE FUNCTION public.is_company_member(
  _company_id uuid
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.company_user cu
    WHERE cu.company_id = _company_id
      AND cu.user_id = auth.uid()
  );
$$;

ALTER FUNCTION public.is_company_member(uuid) OWNER TO postgres;
REVOKE ALL ON FUNCTION public.is_company_member(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_company_member(uuid) TO authenticated;

-- Does current user have a role in company?
CREATE OR REPLACE FUNCTION public.has_company_role(
  _company_id uuid,
  _role text
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.company_user cu
    JOIN public.company_user_role cur
      ON cur.company_user_id = cu.id
    JOIN public.company_role cr
      ON cr.id = cur.company_role_id
    WHERE cu.company_id = _company_id
      AND cu.user_id = auth.uid()
      AND lower(cr.name) = lower(_role)
  );
$$;

ALTER FUNCTION public.has_company_role(uuid, text) OWNER TO postgres;
REVOKE ALL ON FUNCTION public.has_company_role(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_company_role(uuid, text) TO authenticated;

-- =========================================================

-- TODO: Add Check constraint for enums
-- =========================================================
do $$ begin
  create type public.company_common_role as enum ('admin','staff','coach');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.company_mode as enum ('personal','company');
exception when duplicate_object then null; end $$;

-- =========================================================

create table public.profiles
(
    id          uuid primary key references auth.users (id) on delete cascade,
    first_name  varchar(255)              not null,
    last_name   varchar(255)              not null,
    picture_url text,
    created_at  timestamptz default now() not null,
    updated_at  timestamptz default now() not null
);

create table public.companies
(
    id         uuid primary key default gen_random_uuid(),
    name       varchar(255)                   not null,
    mode       text                           not null,
    created_at timestamptz      default now() not null,
    updated_at timestamptz      default now() not null,
    deleted_at timestamptz
);

create table public.company_user
(
    id         uuid primary key default gen_random_uuid(),
    user_id    uuid    not null references auth.users (id) on delete cascade,
    company_id uuid    not null references public.companies (id) on delete cascade,
    is_owner   boolean not null default false,
    joined_at  timestamptz      default now() not null,
    unique (user_id, company_id)
);

CREATE TABLE public.company_role
(
    id         uuid primary key default gen_random_uuid(),
    company_id uuid not null references public.companies (id) on delete cascade,
    name       text not null,
    unique (company_id, name)
);

CREATE TABLE public.company_role_permission
(
    id              uuid primary key default gen_random_uuid(),
    company_role_id uuid    not null references public.company_role (id) on delete cascade,
    module          text    not null,
    can_read        boolean not null,
    can_write       boolean not null,
    can_delete      boolean not null,
    unique (company_role_id, module)
);

CREATE TABLE public.company_user_role
(
    id              uuid primary key default gen_random_uuid(),
    company_user_id uuid not null references public.company_user (id) on delete cascade,
    company_role_id uuid not null references public.company_role (id) on delete cascade,
    unique (company_user_id, company_role_id)
);

CREATE INDEX idx_companies_deleted_at ON public.companies (deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_company_user_company_id ON public.company_user (company_id);
CREATE INDEX idx_company_user_role_company_role_id ON public.company_user_role (company_role_id);
CREATE UNIQUE INDEX idx_company_one_owner ON public.company_user (company_id) WHERE is_owner = true;

-- updated: update column profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS phone VARCHAR(20) unique;

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS active_company_id uuid REFERENCES public.companies(id);

-- updated: column companies
ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS phone VARCHAR(20) unique;

ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS logo_url text,
ADD COLUMN IF NOT EXISTS brn text,
ADD COLUMN IF NOT EXISTS contact_email text,
ADD COLUMN IF NOT EXISTS contact_phone text,
ADD COLUMN IF NOT EXISTS terms text,
ADD COLUMN IF NOT EXISTS disclaimer text;

-- =============================================================

-- View
-- Select Dropdown purpose (assigned coach)
CREATE OR REPLACE VIEW public.v_company_coaches AS
SELECT
    cu.company_id,
    p.id AS coach_id,
    CONCAT(p.first_name, ' ', p.last_name) AS label
FROM public.company_user cu
JOIN public.profiles p 
    ON p.id = cu.user_id
JOIN public.company_user_role cur 
    ON cur.company_user_id = cu.id
JOIN public.company_role cr 
    ON cr.id = cur.company_role_id
WHERE cr.name = 'coach';

GRANT SELECT ON public.v_company_coaches TO authenticated;

CREATE INDEX idx_company_user_user_id 
ON public.company_user(user_id);
CREATE INDEX idx_company_user_role_company_user_id 
ON public.company_user_role(company_user_id);
CREATE INDEX idx_company_role_name 
ON public.company_role(name);

-- =============================================================

-- Policies
-- =============================================================
alter table public.companies enable row level security;
alter table public.company_user enable row level security;
alter table public.company_role enable row level security;
alter table public.company_role_permission enable row level security;
alter table public.company_user_role enable row level security;

-- companies
drop policy if exists "companies_select" on public.companies;
create policy "companies_select"
on public.companies for select
using (public.is_company_member(id));

drop policy if exists "companies_update_admin" on public.companies;
create policy "companies_update_admin"
on public.companies for update
using (public.has_company_role(id, 'admin'))
with check (public.has_company_role(id, 'admin'));

-- company_user
drop policy if exists "company_user_select" on public.company_user;
create policy "company_user_select"
on public.company_user for select
using (public.is_company_member(company_id));

drop policy if exists "company_user_admin_write" on public.company_user;
create policy "company_user_admin_write"
on public.company_user for all
using (public.has_company_role(company_id, 'admin'))
with check (public.has_company_role(company_id, 'admin'));

-- company_role
drop policy if exists "company_role_select" on public.company_role;
create policy "company_role_select"
on public.company_role for select
using (public.is_company_member(company_id));

drop policy if exists "company_role_admin_write" on public.company_role;
create policy "company_role_admin_write"
on public.company_role for all
using (public.has_company_role(company_id, 'admin'))
with check (public.has_company_role(company_id, 'admin'));

-- company_role_permission
drop policy if exists "company_role_permission_select" on public.company_role_permission;
create policy "company_role_permission_select"
on public.company_role_permission for select
using (
	Exists(
		select 1
		from public.company_role cr
		where cr.id = company_role_permission.company_role_id
		and (
      public.is_company_member(cr.company_id)
    )
	)
);

drop policy if exists "company_role_permission_admin_write" on public.company_role_permission;
create policy "company_role_permission_admin_write"
on public.company_role_permission
for all
using (
  exists (
    select 1
    from public.company_role cr
    where cr.id = company_role_permission.company_role_id
      and public.has_company_role(cr.company_id, 'admin')
  )
)
with check (
  exists (
    select 1
    from public.company_role cr
    where cr.id = company_role_permission.company_role_id
      and public.has_company_role(cr.company_id, 'admin')
  )
);

-- company_user_role
drop policy if exists "company_user_role_select" on public.company_user_role;
create policy "company_user_role_select"
on public.company_user_role
for select
using (
  exists (
    select 1
    from public.company_user cu
    where cu.id = company_user_role.company_user_id
      and public.is_company_member(cu.company_id)
  )
);

drop policy if exists "company_user_role_admin_write" on public.company_user_role;
create policy "company_user_role_admin_write"
on public.company_user_role
for all
using (
  exists (
    select 1
    from public.company_user cu
    join public.company_role cr on cr.id = company_user_role.company_role_id
    where cu.id = company_user_role.company_user_id
      and cr.id = company_user_role.company_role_id
      and public.has_company_role(cu.company_id, 'admin')
  )
)
with check (
  exists (
    select 1
    from public.company_user cu
    join public.company_role cr on cr.id = company_user_role.company_role_id
    where cu.id = company_user_role.company_user_id
      and cr.id = company_user_role.company_role_id
      and public.has_company_role(cu.company_id, 'admin')
  )
);

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.companies
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.company_user
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.company_role
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.company_role_permission
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.company_user_role
TO authenticated;

