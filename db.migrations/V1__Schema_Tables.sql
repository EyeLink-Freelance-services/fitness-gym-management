--===============================

--Tables
--===============================
create table if not exists public.client_data_schema_groups (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null,
  description text,
  accent_color text,
  icon_key text,
  unit_hint text,
  sort_order int not null default 0,
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_schema_groups_company
  on public.client_data_schema_groups(company_id);

create index if not exists idx_schema_groups_company_sort
  on public.client_data_schema_groups(company_id, sort_order);

create index if not exists idx_schema_groups_company_archived
  on public.client_data_schema_groups(company_id, archived);

create table if not exists public.client_data_schema_fields (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  group_id uuid not null references public.client_data_schema_groups(id) on delete cascade,
  label text not null,
  key text not null,
  type text not null,
  unit text,
  placeholder text,
  description text,
  required boolean not null default false,
  read_only boolean not null default false,
  show_portal boolean not null default false,
  archived boolean not null default false,
  sort_order int not null default 0,
  options jsonb not null default '[]'::jsonb,
  validation jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uq_schema_field_key_per_company unique (company_id, key)
);

create index if not exists idx_schema_fields_company
  on public.client_data_schema_fields(company_id);

create index if not exists idx_schema_fields_group
  on public.client_data_schema_fields(group_id);

create index if not exists idx_schema_fields_group_sort
  on public.client_data_schema_fields(group_id, sort_order);

create index if not exists idx_schema_fields_company_archived
  on public.client_data_schema_fields(company_id, archived);

create index if not exists idx_schema_fields_company_key
  on public.client_data_schema_fields(company_id, key);

create table if not exists public.coach_schema_group_overrides (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null
    references public.companies(id) on delete cascade,
  coach_user_id uuid not null
    references auth.users(id) on delete cascade,
  group_id uuid not null
    references public.client_data_schema_groups(id) on delete cascade,
  name text,
  description text,
  accent_color text,
  icon_key text,
  unit_hint text,
  sort_order int,
  archived boolean,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uq_coach_group_override unique (coach_user_id, group_id)
);

create index if not exists idx_coach_group_overrides_company_coach
  on public.coach_schema_group_overrides(company_id, coach_user_id);

create index if not exists idx_coach_group_overrides_group
  on public.coach_schema_group_overrides(group_id);


create table if not exists public.coach_schema_field_overrides (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null
    references public.companies(id) on delete cascade,
  coach_user_id uuid not null
    references auth.users(id) on delete cascade,
  field_id uuid not null
    references public.client_data_schema_fields(id) on delete cascade,
  group_override_id uuid
    references public.coach_schema_group_overrides(id) on delete set null,
  label text,
  unit text,
  placeholder text,
  description text,
  required boolean,
  read_only boolean,
  show_portal boolean,
  archived boolean,
  sort_order int,
  options jsonb,
  validation jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uq_coach_field_override unique (coach_user_id, field_id)
);

create index if not exists idx_coach_field_overrides_company_coach
  on public.coach_schema_field_overrides(company_id, coach_user_id);

create index if not exists idx_coach_field_overrides_field
  on public.coach_schema_field_overrides(field_id);


create table if not exists public.member_dynamic_field_values (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  member_id uuid not null references public.members(id) on delete cascade,
  field_id uuid not null references public.client_data_schema_fields(id) on delete cascade,
  value jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uq_member_field_value unique (member_id, field_id)
);

create index if not exists idx_member_dynamic_values_company
  on public.member_dynamic_field_values(company_id);

create index if not exists idx_member_dynamic_values_member
  on public.member_dynamic_field_values(member_id);

create index if not exists idx_member_dynamic_values_field
  on public.member_dynamic_field_values(field_id);

create index if not exists idx_member_dynamic_values_member_field
  on public.member_dynamic_field_values(member_id, field_id);

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.client_data_schema_groups
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.client_data_schema_fields
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.coach_schema_group_overrides
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.coach_schema_field_overrides
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.member_dynamic_field_values
TO authenticated;

--===============================

--Policies
--===============================
alter table public.client_data_schema_groups enable row level security;
alter table public.client_data_schema_fields enable row level security;
alter table public.coach_schema_group_overrides enable row level security;
alter table public.coach_schema_field_overrides enable row level security;
alter table public.member_dynamic_field_values enable row level security;

drop policy if exists "schema_groups_select"
on public.client_data_schema_groups;  
create policy "schema_groups_select"
on public.client_data_schema_groups
for select
to authenticated
using (
  public.is_company_owner(company_id)
  or public.has_company_role(company_id, 'admin')
  or public.has_company_role(company_id, 'coach')
);

drop policy if exists "schema_groups_insert"
on public.client_data_schema_groups;
create policy "schema_groups_insert"
on public.client_data_schema_groups
for insert
to authenticated
with check (
  public.is_company_owner(company_id)
  or public.has_company_role(company_id, 'admin')
  or public.has_company_role(company_id, 'coach')
);

drop policy if exists "schema_groups_update"
on public.client_data_schema_groups;
create policy "schema_groups_update"
on public.client_data_schema_groups
for update
to authenticated
using (
  public.is_company_owner(company_id)
  or public.has_company_role(company_id, 'admin')
  or public.has_company_role(company_id, 'coach')
)
with check (
  public.is_company_owner(company_id)
  or public.has_company_role(company_id, 'admin')
  or public.has_company_role(company_id, 'coach')
);

drop policy if exists "schema_groups_delete" on public.client_data_schema_groups;
create policy "schema_groups_delete"
on public.client_data_schema_groups
for delete
to authenticated
using (
  public.is_company_owner(company_id)
  or public.has_company_role(company_id, 'admin')
);

drop policy if exists "schema_fields_update"
on public.client_data_schema_fields;
create policy "schema_fields_update"
on public.client_data_schema_fields
for update
to authenticated
using (
  public.is_company_owner(company_id)
  or public.has_company_role(company_id, 'admin')
  or public.has_company_role(company_id, 'coach')
)
with check (
  public.is_company_owner(company_id)
  or public.has_company_role(company_id, 'admin')
  or public.has_company_role(company_id, 'coach')
);

drop policy if exists "schema_fields_delete"
on public.client_data_schema_fields;
create policy "schema_fields_delete"
on public.client_data_schema_fields
for delete
to authenticated
using (
  public.is_company_owner(company_id)
  or public.has_company_role(company_id, 'admin')
  or public.has_company_role(company_id, 'coach')
);


create policy "coach_group_overrides_select"
on public.coach_schema_group_overrides
for select
to authenticated
using (
  public.is_company_member(company_id)
  and (
    auth.uid() = coach_user_id
    or public.is_company_owner(company_id)
    or public.has_company_role(company_id, 'admin')
  )
);

create policy "coach_group_overrides_insert"
on public.coach_schema_group_overrides
for insert
to authenticated
with check (
  public.is_company_member(company_id)
  and (
    auth.uid() = coach_user_id
  )
);

create policy "coach_group_overrides_update"
on public.coach_schema_group_overrides
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

create policy "coach_group_overrides_delete"
on public.coach_schema_group_overrides
for delete
to authenticated
using (
  public.is_company_member(company_id)
  and (
    auth.uid() = coach_user_id
  )
);

create policy "coach_field_overrides_select"
on public.coach_schema_field_overrides
for select
to authenticated
using (
  public.is_company_member(company_id)
  and (
    auth.uid() = coach_user_id
    or public.is_company_owner(company_id)
    or public.has_company_role(company_id, 'admin')
  )
);

create policy "coach_field_overrides_insert"
on public.coach_schema_field_overrides
for insert
to authenticated
with check (
  public.is_company_member(company_id)
  and (
    auth.uid() = coach_user_id
  )
);

create policy "coach_field_overrides_update"
on public.coach_schema_field_overrides
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

create policy "coach_field_overrides_delete"
on public.coach_schema_field_overrides
for delete
to authenticated
using (
  public.is_company_member(company_id)
  and (
    auth.uid() = coach_user_id
  )
);

drop policy if exists "member_dynamic_values_select"
on public.member_dynamic_field_values;
create policy "member_dynamic_values_select"
on public.member_dynamic_field_values
for select
to authenticated
using (
  public.is_company_member(company_id)
);

drop policy if exists "member_dynamic_values_insert"
on public.member_dynamic_field_values;
create policy "member_dynamic_values_insert"
on public.member_dynamic_field_values
for insert
to authenticated
with check (
  public.is_company_owner(company_id)
  or public.has_company_role(company_id, 'admin')
  or public.has_company_role(company_id, 'coach')
);

drop policy if exists "member_dynamic_values_update" on public.member_dynamic_field_values;
create policy "member_dynamic_values_update"
on public.member_dynamic_field_values
for update
to authenticated
using (
  public.is_company_owner(company_id)
  or public.has_company_role(company_id, 'admin')
  or public.has_company_role(company_id, 'coach')
)
with check (
  public.is_company_owner(company_id)
  or public.has_company_role(company_id, 'admin')
  or public.has_company_role(company_id, 'coach')
);

drop policy if exists "member_dynamic_values_delete" on public.member_dynamic_field_values;
create policy "member_dynamic_values_delete"
on public.member_dynamic_field_values
for delete
to authenticated
using (
  public.is_company_owner(company_id)
  or public.has_company_role(company_id, 'admin')
  or public.has_company_role(company_id, 'coach')
);

alter table public.client_data_schema_groups
add constraint uq_schema_groups_id_company unique (id, company_id);

alter table public.client_data_schema_fields
add constraint fk_schema_fields_group_company
foreign key (group_id, company_id)
references public.client_data_schema_groups(id, company_id)
on delete cascade;

alter table public.members
add constraint uq_members_id_company unique (id, company_id);

alter table public.client_data_schema_fields
add constraint uq_schema_fields_id_company unique (id, company_id);

alter table public.member_dynamic_field_values
add constraint fk_member_dynamic_values_member_company
foreign key (member_id, company_id)
references public.members(id, company_id)
on delete cascade;

alter table public.member_dynamic_field_values
add constraint fk_member_dynamic_values_field_company
foreign key (field_id, company_id)
references public.client_data_schema_fields(id, company_id)
on delete cascade;

create trigger trg_schema_groups_updated_at
before update on public.client_data_schema_groups
for each row
execute function public.set_updated_at();

create trigger trg_schema_fields_updated_at
before update on public.client_data_schema_fields
for each row
execute function public.set_updated_at();

drop trigger if exists trg_client_data_schema_groups_updated_at
  on public.client_data_schema_groups;
create trigger trg_client_data_schema_groups_updated_at
before update on public.client_data_schema_groups
for each row
execute function public.set_updated_at();

drop trigger if exists trg_client_data_schema_fields_updated_at
  on public.client_data_schema_fields;
create trigger trg_client_data_schema_fields_updated_at
before update on public.client_data_schema_fields
for each row
execute function public.set_updated_at();

drop trigger if exists trg_member_dynamic_field_values_updated_at
  on public.member_dynamic_field_values;
create trigger trg_member_dynamic_field_values_updated_at
before update on public.member_dynamic_field_values
for each row
execute function public.set_updated_at();

drop trigger if exists trg_coach_schema_group_overrides_updated_at
  on public.coach_schema_group_overrides;
create trigger trg_coach_schema_group_overrides_updated_at
before update on public.coach_schema_group_overrides
for each row
execute function public.set_updated_at();

drop trigger if exists trg_coach_schema_field_overrides_updated_at
  on public.coach_schema_field_overrides;
create trigger trg_coach_schema_field_overrides_updated_at
before update on public.coach_schema_field_overrides
for each row
execute function public.set_updated_at();

create trigger trg_member_dynamic_values_updated_at
before update on public.member_dynamic_field_values
for each row
execute function public.set_updated_at(); 

--view
create or replace view public.v_effective_schema_groups as
select
  g.id,
  g.company_id,
  cgo.coach_user_id,

  coalesce(cgo.name, g.name) as name,
  coalesce(cgo.description, g.description) as description,
  coalesce(cgo.accent_color, g.accent_color) as accent_color,
  coalesce(cgo.icon_key, g.icon_key) as icon_key,
  coalesce(cgo.unit_hint, g.unit_hint) as unit_hint,
  coalesce(cgo.sort_order, g.sort_order) as sort_order,
  coalesce(cgo.archived, g.archived) as archived,

  g.created_at,
  greatest(g.updated_at, coalesce(cgo.updated_at, g.updated_at)) as updated_at,
  g.id as base_group_id,
  cgo.id as coach_group_override_id
from public.client_data_schema_groups g
left join public.coach_schema_group_overrides cgo
  on cgo.group_id = g.id;

create or replace view public.v_effective_schema_fields as
select
  f.id,
  f.company_id,
  cfo.coach_user_id,

  f.group_id as base_group_id,
  coalesce(cgo.group_id, f.group_id) as effective_group_id,

  coalesce(cfo.label, f.label) as label,
  f.key as key,
  f.type as type,
  coalesce(cfo.unit, f.unit) as unit,
  coalesce(cfo.placeholder, f.placeholder) as placeholder,
  coalesce(cfo.description, f.description) as description,
  coalesce(cfo.required, f.required) as required,
  coalesce(cfo.read_only, f.read_only) as read_only,
  coalesce(cfo.show_portal, f.show_portal) as show_portal,
  coalesce(cfo.archived, f.archived) as archived,
  coalesce(cfo.sort_order, f.sort_order) as sort_order,
  coalesce(cfo.options, f.options) as options,
  coalesce(cfo.validation, f.validation) as validation,

  f.created_at,
  greatest(f.updated_at, coalesce(cfo.updated_at, f.updated_at)) as updated_at,
  f.id as base_field_id,
  cfo.id as coach_field_override_id
from public.client_data_schema_fields f
left join public.coach_schema_field_overrides cfo
  on cfo.field_id = f.id
left join public.coach_schema_group_overrides cgo
  on cgo.id = cfo.group_override_id;

grant select on public.v_effective_schema_groups to authenticated;
grant select on public.v_effective_schema_fields to authenticated;