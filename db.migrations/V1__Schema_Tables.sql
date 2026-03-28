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
ON public.member_dynamic_field_values
TO authenticated;

--===============================

--Policies
--===============================
alter table public.client_data_schema_groups enable row level security;
alter table public.client_data_schema_fields enable row level security;
alter table public.member_dynamic_field_values enable row level security;

drop policy if exists "schema_groups_select"
on public.client_data_schema_groups  
create policy if not exists "schema_groups_select"
on public.client_data_schema_groups
for select
to authenticated
using (
  public.is_company_owner(company_id)
  or public.has_company_role(company_id, 'admin')
  or public.has_company_role(company_id, 'coach')
);

drop policy if exists "schema_groups_insert"
on public.client_data_schema_groups
create policy if not exists "schema_groups_insert"
on public.client_data_schema_groups
for insert
to authenticated
with check (
  public.is_company_owner(company_id)
  or public.has_company_role(company_id, 'admin')
  or public.has_company_role(company_id, 'coach')
);

drop policy if exists "schema_groups_update"
on public.client_data_schema_groups
create policy if not exists "schema_groups_update"
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

drop policy if exists "schema_groups_delete" on public.client_data_schema_groups
create policy if not exists "schema_groups_delete"
on public.client_data_schema_groups
for delete
to authenticated
using (
  public.is_company_owner(company_id)
  or public.has_company_role(company_id, 'admin')
  or public.has_company_role(company_id, 'coach')
);

drop policy if exists "schema_fields_update"
on public.client_data_schema_fields
create policy if not exists "schema_fields_update"
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
on public.client_data_schema_fields
create policy if not exists "schema_fields_delete"
on public.client_data_schema_fields
for delete
to authenticated
using (
  public.is_company_owner(company_id)
  or public.has_company_role(company_id, 'admin')
  or public.has_company_role(company_id, 'coach')
);

drop policy if exists "member_dynamic_values_select"
on public.member_dynamic_field_values
create policy if not exists "member_dynamic_values_select"
on public.member_dynamic_field_values
for select
to authenticated
using (
  public.is_company_member(company_id)
);

drop policy if exists  
create policy if not exists "member_dynamic_values_insert"
on public.member_dynamic_field_values
for insert
to authenticated
with check (
  public.is_company_owner(company_id)
  or public.has_company_role(company_id, 'admin')
  or public.has_company_role(company_id, 'coach')
);

drop policy if exists  
create policy if not exists "member_dynamic_values_update"
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

drop policy if exists  
create policy if not exists "member_dynamic_values_delete"
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

create trigger trg_member_dynamic_values_updated_at
before update on public.member_dynamic_field_values
for each row
execute function public.set_updated_at(); 