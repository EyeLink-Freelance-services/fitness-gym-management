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
ADD COLUMN IF NOT EXISTS phone VARCHAR(20) unique,
ADD COLUMN IF NOT EXISTS active_company_id uuid REFERENCES public.companies(id) on delete set null,
add column if not exists is_super_admin boolean not null default false;

-- updated: column companies
ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS phone VARCHAR(20) unique;

ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS logo_url text,
ADD COLUMN IF NOT EXISTS brn text,
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS post_code text,
ADD COLUMN IF NOT EXISTS region text,
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

-- FUNCTION
-- =============================================================

-- set active_company_id after logged in or personal workspace otherwise no need both but super admin
DROP FUNCTION public.ensure_active_company_or_personal_workspace();
create or replace function public.ensure_active_company_or_personal_workspace()
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_user_id uuid;
  v_company uuid;
  v_company_user_id uuid;
  v_is_super_admin boolean;
  result jsonb;
begin
  v_user_id := auth.uid();

  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  -- check platform-level super admin
  v_is_super_admin := public.is_super_admin();

  -- 1) if already set on profile, use it
  select p.active_company_id
  into v_company
  from public.profiles p
  where p.id = v_user_id;

  -- 2) otherwise pick best existing membership
  if v_company is null then
    select cu.company_id
    into v_company
    from public.company_user cu
    where cu.user_id = v_user_id
    order by cu.is_owner desc, cu.joined_at desc
    limit 1;
  end if;

  -- 3) if no company:
  --    - super admin: do NOT create personal/company workspace
  --    - normal user: create personal workspace + owner link
  if v_company is null then
    if v_is_super_admin then
      update public.profiles
      set active_company_id = null,
          updated_at = now()
      where id = v_user_id;

      select jsonb_build_object(
        'profile', jsonb_build_object(
          'id', p.id,
          'first_name', p.first_name,
          'last_name', p.last_name,
          'picture_url', p.picture_url,
          'active_company_id', null
        ),
        'company', null,
        'company_user', null,
        'roles', '[]'::jsonb,
        'permissions', '[]'::jsonb,
        'is_super_admin', true
      )
      into result
      from public.profiles p
      where p.id = v_user_id;

      return result;
    else
      insert into public.companies(name, mode)
      values ('Personal Workspace', 'personal')
      returning id into v_company;

      insert into public.company_user(user_id, company_id, is_owner)
      values (v_user_id, v_company, true)
      returning id into v_company_user_id;
    end if;
  end if;

  -- 4) ensure active company is stored on profile
  update public.profiles
  set active_company_id = v_company,
      updated_at = now()
  where id = v_user_id;

  -- 5) get company_user id for that active company
  if v_company_user_id is null then
    select cu.id
    into v_company_user_id
    from public.company_user cu
    where cu.user_id = v_user_id
      and cu.company_id = v_company
    limit 1;
  end if;

  -- 6) return full auth/menu context
  select jsonb_build_object(
    'profile', jsonb_build_object(
      'id', p.id,
      'first_name', p.first_name,
      'last_name', p.last_name,
      'picture_url', p.picture_url,
      'active_company_id', p.active_company_id
    ),
    'company', jsonb_build_object(
      'id', c.id,
      'name', c.name,
      'mode', c.mode
    ),
    'company_user', case
      when cu.id is null then null
      else jsonb_build_object(
        'id', cu.id,
        'user_id', cu.user_id,
        'company_id', cu.company_id,
        'is_owner', cu.is_owner,
        'joined_at', cu.joined_at
      )
    end,
    'roles', coalesce(roles_data.roles, '[]'::jsonb),
    'permissions', coalesce(perms_data.permissions, '[]'::jsonb),
    'is_super_admin', v_is_super_admin
  )
  into result
  from public.profiles p
  join public.companies c
    on c.id = v_company
  left join public.company_user cu
    on cu.user_id = p.id
   and cu.company_id = c.id
  left join lateral (
    select jsonb_agg(
      distinct jsonb_build_object(
        'id', cr.id,
        'name', cr.name
      )
    ) as roles
    from public.company_user_role cur
    join public.company_role cr
      on cr.id = cur.company_role_id
    where cur.company_user_id = cu.id
  ) roles_data on true
  left join lateral (
    select jsonb_agg(
      distinct jsonb_build_object(
        'role_id', cr.id,
        'role_name', cr.name,
        'module', crp.module,
        'can_read', crp.can_read,
        'can_write', crp.can_write,
        'can_delete', crp.can_delete
      )
    ) as permissions
    from public.company_user_role cur
    join public.company_role cr
      on cr.id = cur.company_role_id
    join public.company_role_permission crp
      on crp.company_role_id = cr.id
    where cur.company_user_id = cu.id
  ) perms_data on true
  where p.id = v_user_id;

  return result;
end;
$$;

REVOKE ALL ON FUNCTION public.ensure_active_company_or_personal_workspace() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ensure_active_company_or_personal_workspace() TO authenticated;

-- is super admin (about creating companies)
create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.is_super_admin = true
  );
$$;

alter function public.is_super_admin() owner to postgres;
revoke all on function public.is_super_admin() from public;
grant execute on function public.is_super_admin() to authenticated;

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

-- is company owner?
CREATE OR REPLACE FUNCTION public.is_company_owner(
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
      AND cu.is_owner = true
  );
$$;

ALTER FUNCTION public.is_company_owner(uuid) OWNER TO postgres;
REVOKE ALL ON FUNCTION public.is_company_owner(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_company_owner(uuid) TO authenticated;

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
using (public.is_company_member(id) or public.is_super_admin());

drop policy if exists "companies_update_admin" on public.companies;
create policy "companies_update_admin"
on public.companies for update
using (public.has_company_role(id, 'admin'))
with check (public.has_company_role(id, 'admin'));

drop policy if exists "companies_write_super_admin" on public.companies;
create policy "companies_write_super_admin"
on public.companies
for insert
to authenticated
with check (public.is_super_admin());

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

-- =========================================================

-- TODO: Add Check constraint for enums
-- =========================================================
do $$ begin
  create type public.company_common_role as enum ('admin','staff','coach');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.company_mode as enum ('personal','company');
exception when duplicate_object then null; end $$;

--=============================================

--GRANT
--============================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
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

