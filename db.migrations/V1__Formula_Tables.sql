-- optional extension if not already enabled
create extension if not exists pgcrypto;

-- =========================================================
-- TABLE
-- =========================================================
drop table if exists public.formulas;
create table if not exists public.formulas (
  id uuid primary key default gen_random_uuid(),

  company_id uuid not null
    references public.companies(id) on delete cascade,

  label text not null,
  key text not null,
  expression text not null,

  unit text,
  decimals integer not null default 2,
  description text,
  show_portal boolean not null default true,

  created_by uuid
    references auth.users(id) on delete set null,
  updated_by uuid
    references auth.users(id) on delete set null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint formulas_label_not_blank check (btrim(label) <> ''),
  constraint formulas_key_not_blank check (btrim(key) <> ''),
  constraint formulas_expression_not_blank check (btrim(expression) <> ''),
  constraint formulas_decimals_check check (decimals >= 0 and decimals <= 8)
);

-- unique formula key inside one company
create unique index if not exists uq_formulas_company_key
  on public.formulas(company_id, lower(key));

-- optional: prevent same label twice in same company
create unique index if not exists uq_formulas_company_label
  on public.formulas(company_id, lower(label));

-- useful indexes
create index if not exists idx_formulas_company_id
  on public.formulas(company_id);

create index if not exists idx_formulas_created_by
  on public.formulas(created_by);

create index if not exists idx_formulas_updated_at
  on public.formulas(updated_at desc);

drop table if exists public.coach_formulas_overrides;
create table if not exists public.coach_formulas_overrides (
  id uuid primary key default gen_random_uuid(),
  company_formula_id uuid not null 
    references public.formulas(id) on delete cascade,
  company_id uuid not null
    references public.companies(id) on delete cascade,
  coach_user_id uuid not null 
    references auth.users(id) on delete cascade,
  label text not null,
  key text not null,
  expression text not null,
  unit text,
  decimals integer not null default 2,
  description text,
  show_portal boolean not null default true,
  created_by uuid
    references auth.users(id) on delete set null,
  updated_by uuid
    references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint coach_formulas_overrides_label_not_blank check (btrim(label) <> ''),
  constraint coach_formulas_overrides_key_not_blank check (btrim(key) <> ''),
  constraint coach_formulas_overrides_expression_not_blank check (btrim(expression) <> ''),
  constraint coach_formulas_overrides_decimals_check check (decimals >= 0 and decimals <= 8)
);

create unique index if not exists uq_coach_formulas_overrides_unique
  on public.coach_formulas_overrides(company_formula_id, coach_user_id);

create index if not exists idx_coach_formulas_overrides_company_coach
  on public.coach_formulas_overrides(company_id, coach_user_id);

-- =========================================================
-- TRIGGER
-- =========================================================
drop trigger if exists trg_formulas_set_updated_at on public.formulas;

create trigger trg_formulas_set_updated_at
before update on public.formulas
for each row
execute function public.set_updated_at();

drop trigger if exists trg_coach_formulas_overrides_set_updated_at on public.coach_formulas_overrides;

create trigger trg_coach_formulas_overrides_set_updated_at
before update on public.coach_formulas_overrides
for each row
execute function public.set_updated_at();

-- =========================================================
-- ENABLE RLS
-- =========================================================
alter table public.formulas enable row level security;
alter table public.coach_formulas_overrides enable row level security;

-- =========================================================
-- POLICIES
-- =========================================================
-- SELECT: admin, owner or coach can read
drop policy if exists "formulas_select_company_member" on public.formulas;
create policy "formulas_select_company_member"
on public.formulas
for select
to authenticated
using (
  public.is_company_owner(company_id)
	or public.has_company_role(company_id, 'admin')
	or public.has_company_role(company_id, 'coach')
);

-- INSERT: admin/coach/owner can create
drop policy if exists "formulas_insert_company_roles" on public.formulas;
create policy "formulas_insert_company_roles"
on public.formulas
for insert
to authenticated
with check (
  public.is_company_member(company_id)
  and (
    public.is_company_owner(company_id)
    or public.has_company_role(company_id, 'admin')
    or public.has_company_role(company_id, 'coach')
  )
);

-- UPDATE: admin/coach/owner can update
drop policy if exists "formulas_update_company_roles" on public.formulas;
create policy "formulas_update_company_roles"
on public.formulas
for update
to authenticated
using (
  public.is_company_member(company_id)
  and (
    public.is_company_owner(company_id)
    or public.has_company_role(company_id, 'admin')
    or public.has_company_role(company_id, 'coach')
  )
)
with check (
  public.is_company_member(company_id)
  and (
    public.is_company_owner(company_id)
    or public.has_company_role(company_id, 'admin')
    or public.has_company_role(company_id, 'coach')
  )
);

-- DELETE: usually restrict a bit more
drop policy if exists "formulas_delete_admin_owner" on public.formulas;
create policy "formulas_delete_admin_owner"
on public.formulas
for delete
to authenticated
using (
  public.is_company_member(company_id)
  and (
    public.is_company_owner(company_id)
    or public.has_company_role(company_id, 'admin')
  )
);


-- SELECT: admin, owner or coach can read
drop policy if exists "coach_formulas_overrides_select_company_member" on public.coach_formulas_overrides;
create policy "coach_formulas_overrides_select_company_member"
on public.coach_formulas_overrides
for select
to authenticated
using (
  public.is_company_owner(company_id)
	or public.has_company_role(company_id, 'admin')
	or auth.uid() = coach_user_id
);

-- INSERT: coach can create
drop policy if exists "coach_formulas_overrides_insert_company_roles" on public.coach_formulas_overrides;
create policy "coach_formulas_overrides_insert_company_roles"
on public.coach_formulas_overrides
for insert
to authenticated
with check (
  public.is_company_member(company_id)
  and (
   auth.uid() = coach_user_id
  )
);

-- UPDATE: coach can update
drop policy if exists "coach_formulas_overrides_update_company_roles" on public.coach_formulas_overrides;
create policy "coach_formulas_overrides_update_company_roles"
on public.coach_formulas_overrides
for update
to authenticated
using (
  public.is_company_member(company_id)
  and (
    auth.uid() = coach_user_id
  )
)
with check (
  public.is_company_member(company_id)
  and (
   auth.uid() = coach_user_id
  )
);

-- DELETE: usually restrict a bit more
drop policy if exists "coach_formulas_overrides_delete_company_roles" on public.coach_formulas_overrides;
create policy "coach_formulas_overrides_delete_company_roles"
on public.coach_formulas_overrides
for delete
to authenticated
using (
  public.is_company_member(company_id)
  and (
    auth.uid() = coach_user_id
  )
);

-- =========================================================
-- GRANTS
-- =========================================================

grant select, insert, update, delete
on public.formulas
to authenticated;

grant select, insert, update, delete
on public.coach_formulas_overrides
to authenticated;