do $$ begin
 create type public.coach_status as enum ('active', 'inactive');
exception when duplicate_object then null; end $$;

-- =========================================================
-- TABLE
-- =========================================================

DROP TABLE IF EXISTS public.company_coach_details cascade; 

create table if not exists public.company_coach_details (
  id uuid primary key default gen_random_uuid(),
  company_user_id uuid not null references public.company_user(id) on delete cascade,
  email text not null,
  specialization text not null,
  certifications text,
  year_exp int,
  bio text,
  availability text not null,
  status public.coach_status not null default 'active',
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint chk_company_coach_details_year_exp
    check (year_exp is null or year_exp >= 0)
);

-- =========================================================
-- INDEXES
-- =========================================================

drop index if exists uq_company_coach_details_company_user_active;
create unique index if not exists uq_company_coach_details_company_user_active
  on public.company_coach_details(company_user_id)
  where deleted_at is null;

drop index if exists idx_company_coach_details_company_user_id;
create index if not exists idx_company_coach_details_company_user_id
  on public.company_coach_details(company_user_id);

drop index if exists idx_company_coach_details_email;
create index if not exists idx_company_coach_details_email
  on public.company_coach_details(email);

drop index if exists idx_company_coach_details_status;
create index if not exists idx_company_coach_details_status
  on public.company_coach_details(status);

drop index if exists idx_company_coach_details_deleted_at;
create index if not exists idx_company_coach_details_deleted_at
  on public.company_coach_details(deleted_at);

drop index if exists idx_company_coach_details_company_user_deleted;
create index if not exists idx_company_coach_details_company_user_deleted
  on public.company_coach_details(company_user_id, deleted_at);

-- =========================================================
-- GRANTS
-- =========================================================

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.company_coach_details
TO authenticated;

-- =========================================================
-- TRIGGER
-- =========================================================

DROP TRIGGER IF EXISTS trg_company_coach_details_set_updated_at
  ON public.company_coach_details;

CREATE TRIGGER trg_company_coach_details_set_updated_at
BEFORE UPDATE ON public.company_coach_details
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- ENABLE RLS
-- =========================================================

ALTER TABLE public.company_coach_details ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- POLICIES
-- =========================================================

drop policy if exists "company_coach_details_select"
on public.company_coach_details;

create policy "company_coach_details_select"
on public.company_coach_details
for select
to authenticated
using (
  deleted_at is null
  and exists (
    select 1
    from public.company_user cu
    where cu.id = company_coach_details.company_user_id
      and public.is_company_member(cu.company_id)
  )
);

drop policy if exists "company_coach_details_insert"
on public.company_coach_details;

create policy "company_coach_details_insert"
on public.company_coach_details
for insert
to authenticated
with check (
  exists (
    select 1
    from public.company_user cu
    where cu.id = company_coach_details.company_user_id
      and public.is_company_member(cu.company_id)
      and (
        public.is_company_owner(cu.company_id)
        or public.has_company_role(cu.company_id, 'admin')
        or public.has_company_role(cu.company_id, 'staff')
      )
  )
);

drop policy if exists "company_coach_details_update"
on public.company_coach_details;

create policy "company_coach_details_update"
on public.company_coach_details
for update
to authenticated
using (
  deleted_at is null
  and exists (
    select 1
    from public.company_user cu
    where cu.id = company_coach_details.company_user_id
      and public.is_company_member(cu.company_id)
      and (
        public.is_company_owner(cu.company_id)
        or public.has_company_role(cu.company_id, 'admin')
        or public.has_company_role(cu.company_id, 'staff')
      )
  )
)
with check (
  exists (
    select 1
    from public.company_user cu
    where cu.id = company_coach_details.company_user_id
      and public.is_company_member(cu.company_id)
      and (
        public.is_company_owner(cu.company_id)
        or public.has_company_role(cu.company_id, 'admin')
        or public.has_company_role(cu.company_id, 'staff')
      )
  )
);

drop policy if exists "company_coach_details_delete"
on public.company_coach_details;

create policy "company_coach_details_delete"
on public.company_coach_details
for delete
to authenticated
using (
  deleted_at is null
  and exists (
    select 1
    from public.company_user cu
    where cu.id = company_coach_details.company_user_id
      and public.is_company_member(cu.company_id)
      and (
        public.is_company_owner(cu.company_id)
        or public.has_company_role(cu.company_id, 'admin')
      )
  )
);

--=================================================

-- RPC COMPANY COACH INSERT
--=================================================
drop function if exists public.create_company_coach(
  uuid,
  uuid,
  text,
  text,
  text,
  text,
  text,
  text,
  int,
  text,
  text,
  public.coach_status
);
create or replace function public.create_company_coach(
  p_user_id uuid,
  p_company_id uuid,
  p_first_name text,
  p_last_name text,
  p_email text,
  p_phone text,
  p_specialization text,
  p_certifications text default null,
  p_year_exp int default null,
  p_bio text default null,
  p_availability text default null,
  p_status public.coach_status default 'active'
)
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_company_id uuid;
  v_company_user_id uuid;
  v_coach_role_id uuid;
  v_profile_id uuid;
  v_coach_details_id uuid;
begin
  -- =====================================================
  -- VALIDATIONS
  -- =====================================================

  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  if p_user_id is null then
    raise exception 'p_user_id is required';
  end if;

  if p_company_id is null then
    raise exception 'p_company_id is required';
  end if;

  if p_first_name is null or btrim(p_first_name) = '' then
    raise exception 'first_name is required';
  end if;

  if p_last_name is null or btrim(p_last_name) = '' then
    raise exception 'last_name is required';
  end if;

  if p_email is null or btrim(p_email) = '' then
    raise exception 'email is required';
  end if;

  if p_specialization is null or btrim(p_specialization) = '' then
    raise exception 'specialization is required';
  end if;

  if p_availability is null or btrim(p_availability) = '' then
    raise exception 'availability is required';
  end if;

  if p_year_exp is not null and p_year_exp < 0 then
    raise exception 'year_exp must be greater than or equal to 0';
  end if;

  -- =====================================================
  -- CHECK COMPANY EXISTS
  -- =====================================================

  select c.id
  into v_company_id
  from public.companies c
  where c.id = p_company_id
    and c.deleted_at is null
  limit 1;

  if v_company_id is null then
    raise exception 'Company not found';
  end if;

  -- =====================================================
  -- CHECK CURRENT USER PERMISSION
  -- owner/admin/staff can create a coach
  -- =====================================================

  if not (
    public.is_company_owner(v_company_id)
    or public.has_company_role(v_company_id, 'admin')
    or public.has_company_role(v_company_id, 'staff')
  ) then
    raise exception 'You do not have permission to create a coach for this company';
  end if;

  -- =====================================================
  -- CHECK COACH ROLE EXISTS
  -- =====================================================

  select cr.id
  into v_coach_role_id
  from public.company_role cr
  where cr.company_id = v_company_id
    and lower(cr.name) = 'coach'
  limit 1;

  if v_coach_role_id is null then
    raise exception 'Coach role does not exist for this company';
  end if;

  -- =====================================================
  -- PROFILE INSERT
  -- if already exists, keep existing row
  -- =====================================================

  insert into public.profiles (
    id,
    first_name,
    last_name,
    phone
  )
  values (
    p_user_id,
    btrim(p_first_name),
    btrim(p_last_name),
    p_phone::varchar
  )
  on conflict (id) do update
    set first_name = excluded.first_name,
        last_name = excluded.last_name,
        updated_at = now()
  returning id into v_profile_id;

  -- =====================================================
  -- COMPANY USER INSERT
  -- =====================================================

  insert into public.company_user (
    user_id,
    company_id,
    is_owner
  )
  values (
    p_user_id,
    v_company_id,
    false
  )
  returning id into v_company_user_id;

  -- =====================================================
  -- COMPANY USER ROLE INSERT
  -- =====================================================

  insert into public.company_user_role (
    company_user_id,
    company_role_id
  )
  values (
    v_company_user_id,
    v_coach_role_id
  );

  -- =====================================================
  -- COMPANY COACH DETAILS INSERT
  -- =====================================================

  insert into public.company_coach_details (
    company_user_id,
    email,
    specialization,
    certifications,
    year_exp,
    bio,
    availability,
    status,
    created_by,
    updated_by
  )
  values (
    v_company_user_id,
    btrim(lower(p_email)),
    btrim(p_specialization),
    nullif(btrim(p_certifications), ''),
    p_year_exp,
    nullif(btrim(p_bio), ''),
    btrim(p_availability),
    p_status,
    auth.uid(),
    auth.uid()
  )
  returning id into v_coach_details_id;

  -- =====================================================
  -- RETURN
  -- =====================================================

  return jsonb_build_object(
    'ok', true,
    'message', 'Coach created successfully',
    'data', jsonb_build_object(
      'profile_id', v_profile_id,
      'company_id', v_company_id,
      'company_user_id', v_company_user_id,
      'coach_role_id', v_coach_role_id,
      'coach_details_id', v_coach_details_id,
      'user_id', p_user_id
    )
  );
end;
$$;

alter function public.create_company_coach(
  uuid,
  uuid,
  text,
  text,
  text,
  text,
  text,
  text,
  int,
  text,
  text,
  public.coach_status
) owner to postgres;

revoke all on function public.create_company_coach(
  uuid,
  uuid,
  text,
  text,
  text,
  text,
  text,
  text,
  int,
  text,
  text,
  public.coach_status
) from public;

grant execute on function public.create_company_coach(
  uuid,
  uuid,
  text,
  text,
  text,
  text,
  text,
  text,
  int,
  text,
  text,
  public.coach_status
) to authenticated;


drop view if exists public.v_company_coaches_complete;

create or replace view public.v_company_coaches_complete
as
select
  ccd.id,
  cu.company_id,
  cu.user_id,
  p.first_name,
  p.last_name,
  ccd.specialization,
  ccd.certifications,
  ccd.year_exp,
  ccd.bio,
  ccd.availability,
  ccd.email,
  p.phone,
  count(m.id)::int as clients,
  ccd.status::text as status,
  ccd.created_by,
  ccd.updated_by
from public.company_coach_details ccd
join public.company_user cu
  on cu.id = ccd.company_user_id
join public.profiles p
  on p.id = cu.user_id
left join public.members m
  on m.assigned_coach_id = p.id
 and m.company_id = cu.company_id
 and m.deleted_at is null
where ccd.deleted_at is null
group by
  ccd.id,
  cu.company_id,
  cu.user_id,
  p.first_name,
  p.last_name,
  ccd.specialization,
  ccd.certifications,
  ccd.year_exp,
  ccd.bio,
  ccd.availability,
  ccd.email,
  p.phone,
  ccd.status,
  ccd.created_by,
  ccd.updated_by;