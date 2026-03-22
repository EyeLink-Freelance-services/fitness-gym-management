create table if not exists public.membership_plans (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null,
  price numeric(10,2) not null default 0,
  entree_fee numeric(10,2) not null default 0,
  duration_days int not null default 30,
  is_monthly boolean not null default true,
  description text,
  is_active boolean not null default true,
  created_by uuid not null references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_membership_plans_company_active on public.membership_plans(company_id, is_active);

drop trigger if exists trg_membership_plans_updated_at on public.membership_plans;
create trigger trg_membership_plans_updated_at
before update on public.membership_plans
for each row execute procedure public.set_updated_at();

create table if not exists public.member_memberships (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  member_id uuid not null references public.members(id) on delete cascade,
  plan_id uuid not null references public.membership_plans(id) on delete restrict,
  start_date date not null,
  end_date date not null,
  status text not null default 'active' check (status in ('active','expired','cancelled')),
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create index if not exists idx_member_memberships_member on public.member_memberships(member_id, end_date desc);
create index if not exists idx_member_memberships_plan_id on public.member_memberships(plan_id);

/* --- Helper: can access member (admin/staff OR assigned coach) --- */
create or replace function public.can_access_member(p_member_id uuid)
returns boolean
language sql
stable
SECURITY DEFINER
SET search_path = public, auth
as $$
  select exists (
    select 1
    from public.members m
    where m.id = p_member_id
      and (
        public.is_company_owner(m.company_id)
        or public.has_company_role(m.company_id, 'admin')
        or public.has_company_role(m.company_id, 'staff')
        or (public.has_company_role(m.company_id, 'coach') and m.assigned_coach_id = auth.uid())
      )
  );
$$;

ALTER FUNCTION public.can_access_member(uuid) OWNER TO postgres;
REVOKE ALL ON FUNCTION public.can_access_member(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.can_access_member(uuid) TO authenticated;

ALTER TABLE membership_plans
ADD COLUMN features text[];

alter table public.membership_plans enable row level security;
alter table public.member_memberships enable row level security;

drop policy if exists "membership_plans_select_company" on public.membership_plans;
create policy "membership_plans_select_company"
on public.membership_plans for select
using (public.is_company_member(company_id));

drop policy if exists "membership_plans_write_staff_admin" on public.membership_plans;
create policy "membership_plans_write_staff_admin"
on public.membership_plans for insert
with check (
  public.is_company_owner(company_id)
  or public.has_company_role(company_id,'admin')
  or public.has_company_role(company_id,'staff')
);

drop policy if exists "membership_plans_update_admin_staff" on public.membership_plans;
create policy "membership_plans_update_admin_staff"
on public.membership_plans
for update
using (
  public.is_company_owner(company_id)
  or public.has_company_role(company_id, 'admin')
  or public.has_company_role(company_id, 'staff')
)
with check (
  public.is_company_owner(company_id)
  or public.has_company_role(company_id, 'admin')
  or public.has_company_role(company_id, 'staff')
);

drop policy if exists "member_memberships_select_access" on public.member_memberships;
create policy "member_memberships_select_access"
on public.member_memberships for select
using (public.can_access_member(member_id));

drop policy if exists "member_memberships_insert_staff_admin" on public.member_memberships;
create policy "member_memberships_insert_staff_admin"
on public.member_memberships for insert
with check (
  (
    public.has_company_role(company_id,'admin') 
    or public.is_company_owner(company_id)
    or public.has_company_role(company_id,'staff')
  )
  and created_by = auth.uid()
);

-- member memberships update policy todo

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.membership_plans
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.member_memberships
TO authenticated;
