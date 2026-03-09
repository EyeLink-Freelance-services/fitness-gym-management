-- Enums
-- =========================================================

do $$ begin
 create type public.member_status as enum ('active', 'inactive');
exception when duplicate_object then null; end $$;

-- =========================================================
-- run in transactional way
create or replace function public.create_member_with_membership(
  p_company_id uuid,
  p_first_name text,
  p_last_name text,
  p_dob date,
  p_gender text,
  p_phone text,
  p_email text,
  p_emergency_contact_phone text,
  p_member_status public.member_status,
  p_created_by uuid,
  p_plan_id uuid,
  p_end_date date,
  p_assigned_coach_id uuid default null,
  p_member_code text default null,
  p_address text default null,
  p_emergency_contact_name text default null,
  p_medical_notes text default null,

  p_start_date date default current_date,
  p_membership_status text default 'active'
)
returns table (
  member_id uuid,
  membership_id uuid
)
language plpgsql
security invoker
as $$
declare
  v_member_id uuid;
  v_membership_id uuid;
begin
  insert into public.members (
    company_id,
    assigned_coach_id,
    member_code,
    first_name,
    last_name,
    dob,
    gender,
    phone,
    email,
    address,
    emergency_contact_name,
    emergency_contact_phone,
    medical_notes,
    status,
    created_by
  )
  values (
    p_company_id,
    p_assigned_coach_id,
    p_member_code,
    p_first_name,
    p_last_name,
    p_dob,
    p_gender,
    p_phone,
    p_email,
    p_address,
    p_emergency_contact_name,
    p_emergency_contact_phone,
    p_medical_notes,
    coalesce(p_member_status, 'active'::public.member_status),
    p_created_by
  )
  returning id into v_member_id;

  insert into public.member_memberships (
    company_id,
    member_id,
    plan_id,
    start_date,
    end_date,
    status,
    created_by
  )
  values (
    p_company_id,
    v_member_id,
    p_plan_id,
    p_start_date,
    p_end_date,
    coalesce(p_membership_status, 'active'),
    p_created_by
  )
  returning id into v_membership_id;

  return query
  select v_member_id, v_membership_id;
end;
$$;

ALTER FUNCTION public.create_member_with_membership(
  uuid,
  text,
  text,
  date,
  text,
  text,
  text,
  text,
  public.member_status,
  uuid,
  uuid,
  date,
  uuid,
  text,
  text,
  text,
  text,
  date,
  text
) OWNER TO postgres;

REVOKE ALL ON FUNCTION public.create_member_with_membership(
  uuid,
  text,
  text,
  date,
  text,
  text,
  text,
  text,
  public.member_status,
  uuid,
  uuid,
  date,
  uuid,
  text,
  text,
  text,
  text,
  date,
  text
) FROM PUBLIC;

-- GRANT EXECUTE ON FUNCTION public.create_member_with_membership(
--   uuid,
--   text,
--   text,
--   date,
--   text,
--   text,
--   text,
--   text,
--   public.member_status,
--   uuid,
--   uuid,
--   date,
--   uuid,
--   text,
--   text,
--   text,
--   text,
--   date,
--   text
-- ) TO authenticated;

create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  assigned_coach_id uuid references public.profiles(id),
	member_code text,
  first_name text not null,
  last_name text not null,
  dob date,
  gender text,
  phone text,
  email text,
  address text,
  emergency_contact_name text,
  emergency_contact_phone text,
  medical_notes text,
  status public.member_status not null default 'active',
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists idx_members_company on public.members(company_id);
create index if not exists idx_members_company_status on public.members(company_id, status);
create index if not exists idx_members_company_coach on public.members(company_id, assigned_coach_id);
create unique index if not exists uq_members_company_member_code on public.members(company_id, member_code) where member_code is not null;

drop trigger if exists trg_members_updated_at ON public.members;
CREATE TRIGGER trg_set_updated_at
BEFORE UPDATE ON members
FOR EACH ROW
WHEN (OLD.updated_at IS DISTINCT FROM NEW.updated_at) -- only if value changed
EXECUTE FUNCTION public.set_updated_at();

create table if not exists public.member_measurements (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  member_id uuid not null references public.members(id) on delete cascade,
  recorded_by uuid references public.profiles(id),
  recorded_at timestamptz not null default now(),
  weight numeric(6,2),
  body_fat numeric(5,2),
  notes text,
  metrics jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_measurements_member_time on public.member_measurements(member_id, recorded_at desc);

create table if not exists public.member_medical_history (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  created_by uuid references public.profiles(id),
  title text not null,
  details text,
  created_at timestamptz not null default now()
);

-- =========================================================

-- Policies 
-- =========================================================
alter table public.members enable row level security;
alter table public.member_measurements enable row level security;
alter table public.member_medical_history enable row level security;

drop policy if exists "members_select_member" on public.members;
create policy "members_select_member"
on public.members for select
using (public.is_company_member(company_id) and deleted_at is null);

drop policy if exists "members_write_staff_admin" on public.members;
create policy "members_write_staff_admin"
on public.members for insert
with check (public.has_company_role(company_id,'admin') or public.has_company_role(company_id,'staff'));

drop policy if exists "members_update_staff_admin" on public.members;
create policy "members_update_staff_admin"
on public.members for update
using (public.has_company_role(company_id,'admin') or public.has_company_role(company_id,'staff'))
with check (public.has_company_role(company_id,'admin') or public.has_company_role(company_id,'staff'));

-- -- coach can update members only if assigned (optional)
-- drop policy if exists "members_update_coach_assigned" on public.members;
-- create policy "members_update_coach_assigned"
-- on public.members for update
-- using (public.has_company_role(company_id,'coach') and assigned_coach_id = auth.uid())
-- with check (public.has_company_role(company_id,'coach') and assigned_coach_id = auth.uid());

-- admin can view, staff can view and coach can view members_medical_history only if assigned
drop policy if exists "member_medical_history_select" on public.member_medical_history;
create policy "member_medical_history_select"
on public.member_medical_history
for select
using (
  exists (
    select 1
    from public.members m
    where m.id = member_medical_history.member_id
    and (
      public.has_company_role(m.company_id,'admin')
      or public.has_company_role(m.company_id,'staff')
      or m.assigned_coach_id = auth.uid()
    )
  )
);

-- admin and staff can insert
drop policy if exists "member_medical_history_insert" on public.member_medical_history;
create policy "member_medical_history_insert"
on public.member_medical_history
for insert
with check (
  exists (
    select 1
    from public.members m
    where m.id = member_medical_history.member_id
    and (
      public.has_company_role(m.company_id,'admin')
      or public.has_company_role(m.company_id,'staff')
    )
  )
);

-- admin and staff can update
drop policy if exists "member_medical_history_update" on public.member_medical_history;
create policy "member_medical_history_update"
on public.member_medical_history
for update
using(
	exists (
    select 1
    from public.members m
    where m.id = member_medical_history.member_id
    and (
      public.has_company_role(m.company_id,'admin')
      or public.has_company_role(m.company_id,'staff')
    )
  )
)
with check (
  exists (
    select 1
    from public.members m
    where m.id = member_medical_history.member_id
    and (
      public.has_company_role(m.company_id,'admin')
      or public.has_company_role(m.company_id,'staff')
    )
  )
);

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.members
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.member_measurements
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.member_medical_history
TO authenticated;

-- Can refine later by module permissions.