create table if not exists public.training_plans (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  created_by uuid not null references public.profiles(id),
  title text not null,
  description text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_training_plans_company_status on public.training_plans(company_id, status);

drop trigger if exists trg_training_plans_updated_at on public.training_plans;
create trigger trg_training_plans_updated_at
before update on public.training_plans
for each row execute procedure public.set_updated_at();

create table if not exists public.training_plan_sessions (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.training_plans(id) on delete cascade,
  day_index int,
  title text not null,
  notes text,
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_training_sessions_plan on public.training_plan_sessions(plan_id, order_index);

create table if not exists public.training_session_exercises (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.training_plan_sessions(id) on delete cascade,
  name text not null,
  sets int,
  reps int,
  weight numeric(10,2),
  rest_seconds int,
  tempo text,
  order_index int not null default 0
);

create index if not exists idx_training_exercises_session on public.training_session_exercises(session_id, order_index);

-- create table if not exists public.exercise_library (
--   id uuid primary key default gen_random_uuid(),
--   company_id uuid references public.companies(id) on delete cascade,
--   name text not null,
--   category text,
--   muscle_group text,
--   created_at timestamptz not null default now()
-- );

create table if not exists public.training_plan_assignments (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  plan_id uuid not null references public.training_plans(id) on delete cascade,
  member_id uuid not null references public.members(id) on delete cascade,
  assigned_by uuid not null references public.profiles(id),
  start_date date,
  status text not null default 'active' check (status in ('active','completed','cancelled')),
  -- pdf_doc_id uuid references public.documents(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (plan_id, member_id, created_at)
);

create index if not exists idx_training_assignments_member on public.training_plan_assignments(member_id, created_at desc);
create index if not exists idx_training_assignments_company on public.training_plan_assignments(company_id);

alter table public.training_plan_assignments
drop constraint if exists training_plan_assignments_plan_id_member_id_created_at_key;

alter table public.training_plan_assignments
add constraint training_plan_assignments_plan_member_unique
unique (plan_id, member_id);

alter table training_plans
add column level int;
alter table training_plans
add column updated_by uuid references public.profiles(id);

--===========================================

-- Policies
--===========================================
alter table public.training_plans enable row level security;
alter table public.training_plan_sessions enable row level security;
alter table public.training_session_exercises enable row level security;
alter table public.training_plan_assignments enable row level security;

-- Assignments: allow admin/staff, and coaches only for their members
drop policy if exists "training_assignments_select_access" on public.training_plan_assignments;
create policy "training_assignments_select_access"
on public.training_plan_assignments for select
using (public.can_access_member(member_id));

drop policy if exists "training_assignments_insert_access" on public.training_plan_assignments;
create policy "training_assignments_insert_access"
on public.training_plan_assignments for insert
with check (
  public.can_access_member(member_id)
  and assigned_by = auth.uid()
);


-- training_plans
drop policy if exists "training_plans_select_company" on public.training_plans;
create policy "training_plans_select_company"
on public.training_plans for select
using (public.is_company_member(company_id));

drop policy if exists "training_plans_write_coach_staff_admin" on public.training_plans;
create policy "training_plans_write_coach_staff_admin"
on public.training_plans for insert
with check (
  public.has_company_role(company_id,'admin')
  or public.has_company_role(company_id,'staff')
  or public.has_company_role(company_id,'coach')
);

drop policy if exists "training_plans_update_coach_staff_admin" on public.training_plans;
create policy "training_plans_update_coach_staff_admin"
on public.training_plans for update
using (
  public.has_company_role(company_id,'admin')
  or public.has_company_role(company_id,'staff')
  or public.has_company_role(company_id,'coach')
)
with check (
  public.has_company_role(company_id,'admin')
  or public.has_company_role(company_id,'staff')
  or public.has_company_role(company_id,'coach')
);

drop policy if exists "training_plans_delete_company" on public.training_plans;
create policy "training_plans_delete_company"
on public.training_plans
for delete
using (
  public.has_company_role(company_id,'admin')
  or public.has_company_role(company_id,'staff')
  or public.has_company_role(company_id,'coach')
);

-- training_plan_sessions
drop policy if exists "training_plan_sessions_select_company" on public.training_plan_sessions;
create policy "training_plan_sessions_select_company"
on public.training_plan_sessions
for select
using (
  exists (
    select 1
    from public.training_plans tp
    where tp.id = training_plan_sessions.plan_id
      and public.is_company_member(tp.company_id)
  )
);

drop policy if exists "training_plan_sessions_insert_company" on public.training_plan_sessions;
create policy "training_plan_sessions_insert_company"
on public.training_plan_sessions
for insert
with check (
  exists (
    select 1
    from public.training_plans tp
    where tp.id = training_plan_sessions.plan_id
      and (
        public.has_company_role(tp.company_id, 'admin')
        or public.has_company_role(tp.company_id, 'staff')
        or public.has_company_role(tp.company_id, 'coach')
      )
  )
);

drop policy if exists "training_plan_sessions_update_company" on public.training_plan_sessions;
create policy "training_plan_sessions_update_company"
on public.training_plan_sessions
for update
using (
  exists (
    select 1
    from public.training_plans tp
    where tp.id = training_plan_sessions.plan_id
      and (
        public.has_company_role(tp.company_id, 'admin')
        or public.has_company_role(tp.company_id, 'staff')
        or public.has_company_role(tp.company_id, 'coach')
      )
  )
)
with check (
  exists (
    select 1
    from public.training_plans tp
    where tp.id = training_plan_sessions.plan_id
      and (
        public.has_company_role(tp.company_id, 'admin')
        or public.has_company_role(tp.company_id, 'staff')
        or public.has_company_role(tp.company_id, 'coach')
      )
  )
);

drop policy if exists "training_plan_sessions_delete_company" on public.training_plan_sessions;
create policy "training_plan_sessions_delete_company"
on public.training_plan_sessions
for delete
using (
  exists (
    select 1
    from public.training_plans tp
    where tp.id = training_plan_sessions.plan_id
      and (
        public.has_company_role(tp.company_id, 'admin')
        or public.has_company_role(tp.company_id, 'staff')
        or public.has_company_role(tp.company_id, 'coach')
      )
  )
);

-- training_session_exercises
drop policy if exists "training_session_exercises_select_company" on public.training_session_exercises;
create policy "training_session_exercises_select_company"
on public.training_session_exercises
for select
using (
  exists (
    select 1
    from public.training_plan_sessions s
    join public.training_plans tp on tp.id = s.plan_id
    where s.id = training_session_exercises.session_id
      and public.is_company_member(tp.company_id)
  )
);

drop policy if exists "training_session_exercises_insert_company" on public.training_session_exercises;
create policy "training_session_exercises_insert_company"
on public.training_session_exercises
for insert
with check (
  exists (
    select 1
    from public.training_plan_sessions s
    join public.training_plans tp on tp.id = s.plan_id
    where s.id = training_session_exercises.session_id
      and (
        public.has_company_role(tp.company_id, 'admin')
        or public.has_company_role(tp.company_id, 'staff')
        or public.has_company_role(tp.company_id, 'coach')
      )
  )
);

drop policy if exists "training_session_exercises_update_company" on public.training_session_exercises;
create policy "training_session_exercises_update_company"
on public.training_session_exercises
for update
using (
  exists (
    select 1
    from public.training_plan_sessions s
    join public.training_plans tp on tp.id = s.plan_id
    where s.id = training_session_exercises.session_id
      and (
        public.has_company_role(tp.company_id, 'admin')
        or public.has_company_role(tp.company_id, 'staff')
        or public.has_company_role(tp.company_id, 'coach')
      )
  )
)
with check (
  exists (
    select 1
    from public.training_plan_sessions s
    join public.training_plans tp on tp.id = s.plan_id
    where s.id = training_session_exercises.session_id
      and (
        public.has_company_role(tp.company_id, 'admin')
        or public.has_company_role(tp.company_id, 'staff')
        or public.has_company_role(tp.company_id, 'coach')
      )
  )
);

drop policy if exists "training_session_exercises_delete_company" on public.training_session_exercises;
create policy "training_session_exercises_delete_company"
on public.training_session_exercises
for delete
using (
  exists (
    select 1
    from public.training_plan_sessions s
    join public.training_plans tp on tp.id = s.plan_id
    where s.id = training_session_exercises.session_id
      and (
        public.has_company_role(tp.company_id, 'admin')
        or public.has_company_role(tp.company_id, 'staff')
        or public.has_company_role(tp.company_id, 'coach')
      )
  )
);

--===========================================

-- RPC insert training plan with transaction
--===========================================
create or replace function public.create_training_plan_with_sessions(
  p_payload jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_plan_id uuid;
  v_session_id uuid;
  v_company_id uuid;
  v_session jsonb;
  v_exercise jsonb;
begin
  v_company_id := (p_payload->>'company_id')::uuid;

  if v_company_id is null then
    raise exception 'company_id is required';
  end if;

  if not (
    public.is_company_owner(v_company_id)
    or
    public.has_company_role(v_company_id, 'admin')
    or public.has_company_role(v_company_id, 'staff')
    or public.has_company_role(v_company_id, 'coach')
  ) then
    raise exception 'You do not have permission to create this training plan';
  end if;

  insert into public.training_plans (
    company_id,
    title,
    description,
    level,
    status,
    created_by
  )
  values (
    v_company_id,
    p_payload->>'title',
    p_payload->>'description',
    nullif(p_payload->>'level','')::int,
    p_payload->>'status',
    auth.uid()
  )
  returning id into v_plan_id;

  for v_session in
    select value
    from jsonb_array_elements(coalesce(p_payload->'sessions', '[]'::jsonb))
  loop
    insert into public.training_plan_sessions (
      plan_id,
      day_index,
      title,
      notes,
      order_index
    )
    values (
      v_plan_id,
      nullif(v_session->>'day_index', '')::int,
      v_session->>'title',
      v_session->>'notes',
      coalesce((v_session->>'order_index')::int, 0)
    )
    returning id into v_session_id;

    for v_exercise in
      select value
      from jsonb_array_elements(coalesce(v_session->'exercises', '[]'::jsonb))
    loop
      insert into public.training_session_exercises (
        session_id,
        name,
        sets,
        reps,
        weight,
        rest_seconds,
        tempo,
        order_index
      )
      values (
        v_session_id,
        v_exercise->>'name',
        nullif(v_exercise->>'sets', '')::int,
        nullif(v_exercise->>'reps', '')::int,
        nullif(v_exercise->>'weight', '')::numeric(10,2),
        nullif(v_exercise->>'rest_seconds', '')::int,
        v_exercise->>'tempo',
        coalesce((v_exercise->>'order_index')::int, 0)
      );
    end loop;
  end loop;

  return v_plan_id;
end;
$$;

ALTER FUNCTION public.create_training_plan_with_sessions(jsonb) OWNER TO postgres;
REVOKE ALL ON FUNCTION public.create_training_plan_with_sessions(jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_training_plan_with_sessions(jsonb) TO authenticated;

-- update training plan
create or replace function public.update_training_plan_with_sessions(
  p_payload jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_plan_id uuid;
  v_company_id uuid;
  v_session jsonb;
  v_exercise jsonb;
  v_session_id uuid;
begin
  v_plan_id := nullif(p_payload->>'id', '')::uuid;
  v_company_id := nullif(p_payload->>'company_id', '')::uuid;

  if v_plan_id is null then
    raise exception 'plan id is required';
  end if;

  if v_company_id is null then
    raise exception 'company_id is required';
  end if;

  if not exists (
    select 1
    from public.training_plans tp
    where tp.id = v_plan_id
      and tp.company_id = v_company_id
  ) then
    raise exception 'training plan not found';
  end if;

  if not (
    public.is_company_owner(v_company_id)
    or public.has_company_role(v_company_id, 'admin')
    or public.has_company_role(v_company_id, 'staff')
    or public.has_company_role(v_company_id, 'coach')
  ) then
    raise exception 'You do not have permission to update this training plan';
  end if;

  -- update parent plan
  update public.training_plans
  set
    title = p_payload->>'title',
    description = p_payload->>'description',
    level = nullif(p_payload->>'level', '')::int,
    status = p_payload->>'status',
    updated_by = auth.uid(),
    updated_at = now()
  where id = v_plan_id;

  -- delete exercises removed from payload
  delete from public.training_session_exercises e
  where e.session_id in (
    select s.id
    from public.training_plan_sessions s
    where s.plan_id = v_plan_id
  )
  and not exists (
    select 1
    from jsonb_array_elements(coalesce(p_payload->'sessions', '[]'::jsonb)) as session_item
    cross join jsonb_array_elements(coalesce(session_item->'exercises', '[]'::jsonb)) as exercise_item
    where nullif(exercise_item->>'id', '')::uuid = e.id
  );

  -- delete sessions removed from payload
  delete from public.training_plan_sessions s
  where s.plan_id = v_plan_id
  and not exists (
    select 1
    from jsonb_array_elements(coalesce(p_payload->'sessions', '[]'::jsonb)) as session_item
    where nullif(session_item->>'id', '')::uuid = s.id
  );

  -- upsert sessions and exercises
  for v_session in
    select value
    from jsonb_array_elements(coalesce(p_payload->'sessions', '[]'::jsonb))
  loop
    v_session_id := nullif(v_session->>'id', '')::uuid;

    -- existing session
    if v_session_id is not null and exists (
      select 1
      from public.training_plan_sessions s
      where s.id = v_session_id
        and s.plan_id = v_plan_id
    ) then
      update public.training_plan_sessions
      set
        day_index = nullif(v_session->>'day_index', '')::int,
        title = v_session->>'title',
        notes = v_session->>'notes',
        order_index = coalesce((v_session->>'order_index')::int, 0)
      where id = v_session_id;

    -- new session
    else
      insert into public.training_plan_sessions (
        plan_id,
        day_index,
        title,
        notes,
        order_index
      )
      values (
        v_plan_id,
        nullif(v_session->>'day_index', '')::int,
        v_session->>'title',
        v_session->>'notes',
        coalesce((v_session->>'order_index')::int, 0)
      )
      returning id into v_session_id;
    end if;

    -- upsert exercises for this session
    for v_exercise in
      select value
      from jsonb_array_elements(coalesce(v_session->'exercises', '[]'::jsonb))
    loop
      if nullif(v_exercise->>'id', '')::uuid is not null
         and exists (
           select 1
           from public.training_session_exercises e
           where e.id = nullif(v_exercise->>'id', '')::uuid
             and e.session_id = v_session_id
         )
      then
        update public.training_session_exercises
        set
          name = v_exercise->>'name',
          sets = nullif(v_exercise->>'sets', '')::int,
          reps = nullif(v_exercise->>'reps', '')::int,
          weight = nullif(v_exercise->>'weight', '')::numeric(10,2),
          rest_seconds = nullif(v_exercise->>'rest_seconds', '')::int,
          tempo = v_exercise->>'tempo',
          order_index = coalesce((v_exercise->>'order_index')::int, 0)
        where id = nullif(v_exercise->>'id', '')::uuid
          and session_id = v_session_id;
      else
        insert into public.training_session_exercises (
          session_id,
          name,
          sets,
          reps,
          weight,
          rest_seconds,
          tempo,
          order_index
        )
        values (
          v_session_id,
          v_exercise->>'name',
          nullif(v_exercise->>'sets', '')::int,
          nullif(v_exercise->>'reps', '')::int,
          nullif(v_exercise->>'weight', '')::numeric(10,2),
          nullif(v_exercise->>'rest_seconds', '')::int,
          v_exercise->>'tempo',
          coalesce((v_exercise->>'order_index')::int, 0)
        );
      end if;
    end loop;
  end loop;

  return v_plan_id;
end;
$$;

ALTER FUNCTION public.update_training_plan_with_sessions(jsonb) OWNER TO postgres;
REVOKE ALL ON FUNCTION public.update_training_plan_with_sessions(jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.update_training_plan_with_sessions(jsonb) TO authenticated;

--===========================================

-- GRANT
--===========================================
GRANT SELECT, INSERT, UPDATE, DELETE
ON public.training_plans
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.training_plan_sessions
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.training_session_exercises
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.training_plan_assignments
TO authenticated;
