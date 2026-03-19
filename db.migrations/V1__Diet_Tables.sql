create table if not exists public.diet_plans (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  created_by uuid not null references public.profiles(id),
  updated_by uuid references public.profiles(id),
  title text not null,
  description text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_diet_plans_company_status on public.diet_plans(company_id, status);

drop trigger if exists trg_diet_plans_updated_at on public.diet_plans;
create trigger trg_diet_plans_updated_at
before update on public.diet_plans
for each row execute procedure public.set_updated_at();

create table if not exists public.diet_plan_meals (
  id uuid primary key default gen_random_uuid(),
  diet_plan_id uuid not null references public.diet_plans(id) on delete cascade,
  day_index int,
  meal_type text not null check (meal_type in ('breakfast','lunch','dinner','snack')),
  notes text,
  order_index int not null default 0
);

create index if not exists idx_diet_meals_plan on public.diet_plan_meals(diet_plan_id, order_index);

create table if not exists public.diet_meal_items (
  id uuid primary key default gen_random_uuid(),
  meal_id uuid not null references public.diet_plan_meals(id) on delete cascade,
  food_name text not null,
  quantity text not null,
  notes text,
  order_index int not null default 0
);

create index if not exists idx_diet_items_meal on public.diet_meal_items(meal_id, order_index);

--===========================================

-- Policies
--===========================================
alter table public.diet_plans enable row level security;
alter table public.diet_plan_meals enable row level security;
alter table public.diet_meal_items enable row level security;


drop policy if exists "diet_plans_select_company" on public.diet_plans;
create policy "diet_plans_select_company"
on public.diet_plans for select
using (public.is_company_member(company_id));

drop policy if exists "diet_plans_write_coach_staff_admin" on public.diet_plans;
create policy "diet_plans_write_coach_staff_admin"
on public.diet_plans for insert
with check (
  public.has_company_role(company_id,'admin')
  or public.has_company_role(company_id,'staff')
  or public.has_company_role(company_id,'coach')
);

drop policy if exists "diet_plans_update_coach_staff_admin" on public.diet_plans;
create policy "diet_plans_update_coach_staff_admin"
on public.diet_plans for update
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

-- ===========================================
-- DELETE policy for diet_plans
-- ===========================================
drop policy if exists "diet_plans_delete_coach_staff_admin" on public.diet_plans;
create policy "diet_plans_delete_coach_staff_admin"
on public.diet_plans
for delete
using (
  public.has_company_role(company_id, 'admin')
  or public.has_company_role(company_id, 'staff')
  or public.has_company_role(company_id, 'coach')
);

-- ===========================================
-- diet_plan_meals policies
-- ===========================================

drop policy if exists "diet_plan_meals_select_company" on public.diet_plan_meals;
create policy "diet_plan_meals_select_company"
on public.diet_plan_meals
for select
using (
  exists (
    select 1
    from public.diet_plans dp
    where dp.id = diet_plan_meals.diet_plan_id
      and public.is_company_member(dp.company_id)
  )
);

drop policy if exists "diet_plan_meals_insert_coach_staff_admin" on public.diet_plan_meals;
create policy "diet_plan_meals_insert_coach_staff_admin"
on public.diet_plan_meals
for insert
with check (
  exists (
    select 1
    from public.diet_plans dp
    where dp.id = diet_plan_meals.diet_plan_id
      and (
        public.has_company_role(dp.company_id, 'admin')
        or public.has_company_role(dp.company_id, 'staff')
        or public.has_company_role(dp.company_id, 'coach')
      )
  )
);

drop policy if exists "diet_plan_meals_update_coach_staff_admin" on public.diet_plan_meals;
create policy "diet_plan_meals_update_coach_staff_admin"
on public.diet_plan_meals
for update
using (
  exists (
    select 1
    from public.diet_plans dp
    where dp.id = diet_plan_meals.diet_plan_id
      and (
        public.has_company_role(dp.company_id, 'admin')
        or public.has_company_role(dp.company_id, 'staff')
        or public.has_company_role(dp.company_id, 'coach')
      )
  )
)
with check (
  exists (
    select 1
    from public.diet_plans dp
    where dp.id = diet_plan_meals.diet_plan_id
      and (
        public.has_company_role(dp.company_id, 'admin')
        or public.has_company_role(dp.company_id, 'staff')
        or public.has_company_role(dp.company_id, 'coach')
      )
  )
);

drop policy if exists "diet_plan_meals_delete_coach_staff_admin" on public.diet_plan_meals;
create policy "diet_plan_meals_delete_coach_staff_admin"
on public.diet_plan_meals
for delete
using (
  exists (
    select 1
    from public.diet_plans dp
    where dp.id = diet_plan_meals.diet_plan_id
      and (
        public.has_company_role(dp.company_id, 'admin')
        or public.has_company_role(dp.company_id, 'staff')
        or public.has_company_role(dp.company_id, 'coach')
      )
  )
);

-- ===========================================
-- diet_meal_items policies
-- ===========================================

drop policy if exists "diet_meal_items_select_company" on public.diet_meal_items;
create policy "diet_meal_items_select_company"
on public.diet_meal_items
for select
using (
  exists (
    select 1
    from public.diet_plan_meals dpm
    join public.diet_plans dp on dp.id = dpm.diet_plan_id
    where dpm.id = diet_meal_items.meal_id
      and public.is_company_member(dp.company_id)
  )
);

drop policy if exists "diet_meal_items_insert_coach_staff_admin" on public.diet_meal_items;
create policy "diet_meal_items_insert_coach_staff_admin"
on public.diet_meal_items
for insert
with check (
  exists (
    select 1
    from public.diet_plan_meals dpm
    join public.diet_plans dp on dp.id = dpm.diet_plan_id
    where dpm.id = diet_meal_items.meal_id
      and (
        public.has_company_role(dp.company_id, 'admin')
        or public.has_company_role(dp.company_id, 'staff')
        or public.has_company_role(dp.company_id, 'coach')
      )
  )
);

drop policy if exists "diet_meal_items_update_coach_staff_admin" on public.diet_meal_items;
create policy "diet_meal_items_update_coach_staff_admin"
on public.diet_meal_items
for update
using (
  exists (
    select 1
    from public.diet_plan_meals dpm
    join public.diet_plans dp on dp.id = dpm.diet_plan_id
    where dpm.id = diet_meal_items.meal_id
      and (
        public.has_company_role(dp.company_id, 'admin')
        or public.has_company_role(dp.company_id, 'staff')
        or public.has_company_role(dp.company_id, 'coach')
      )
  )
)
with check (
  exists (
    select 1
    from public.diet_plan_meals dpm
    join public.diet_plans dp on dp.id = dpm.diet_plan_id
    where dpm.id = diet_meal_items.meal_id
      and (
        public.has_company_role(dp.company_id, 'admin')
        or public.has_company_role(dp.company_id, 'staff')
        or public.has_company_role(dp.company_id, 'coach')
      )
  )
);

drop policy if exists "diet_meal_items_delete_coach_staff_admin" on public.diet_meal_items;
create policy "diet_meal_items_delete_coach_staff_admin"
on public.diet_meal_items
for delete
using (
  exists (
    select 1
    from public.diet_plan_meals dpm
    join public.diet_plans dp on dp.id = dpm.diet_plan_id
    where dpm.id = diet_meal_items.meal_id
      and (
        public.has_company_role(dp.company_id, 'admin')
        or public.has_company_role(dp.company_id, 'staff')
        or public.has_company_role(dp.company_id, 'coach')
      )
  )
);

--===========================================

-- RPC 
--===========================================
-- Create diet plan
create or replace function public.create_diet_plan_with_meals(
  p_payload jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_plan_id uuid;
  v_meal_id uuid;
  v_company_id uuid;
  v_user_id uuid;
  v_meal jsonb;
  v_item jsonb;
begin
  v_user_id := auth.uid();
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
    raise exception 'You do not have permission to create this diet plan';
  end if;

  insert into public.diet_plans (
    company_id,
    created_by,
    updated_by,
    title,
    description,
    status
  )
  values (
    v_company_id,
    v_user_id,
    v_user_id,
    p_payload->>'title',
    p_payload->>'description',
    p_payload->>'status'
  )
  returning id into v_plan_id;

  for v_meal in
    select value
    from jsonb_array_elements(coalesce(p_payload->'meals', '[]'::jsonb))
  loop
    insert into public.diet_plan_meals (
      diet_plan_id,
      day_index,
      meal_type,
      notes,
      order_index
    )
    values (
      v_plan_id,
      nullif(v_meal->>'day_index', '')::int,
      v_meal->>'meal_type',
      nullif(trim(v_meal->>'notes'), ''),
      coalesce((v_meal->>'order_index')::int, 0)
    )
    returning id into v_meal_id;

    for v_item in
      select value
      from jsonb_array_elements(coalesce(v_meal->'items', '[]'::jsonb))
    loop
      insert into public.diet_meal_items (
        meal_id,
        food_name,
        quantity,
        notes,
        order_index
      )
      values (
        v_meal_id,
        trim(v_item->>'food_name'),
        trim(v_item->>'quantity'),
        nullif(trim(v_item->>'notes'), ''),
        coalesce((v_item->>'order_index')::int, 0)
      );
    end loop;
  end loop;

  return v_plan_id;
end;
$$;

ALTER FUNCTION public.create_diet_plan_with_meals(jsonb) OWNER TO postgres;
REVOKE ALL ON FUNCTION public.create_diet_plan_with_meals(jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_diet_plan_with_meals(jsonb) TO authenticated;

-- update diet plan
create or replace function public.update_diet_plan_with_meals(
  p_payload jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_plan_id uuid;
  v_existing_company_id uuid;
  v_meal_id uuid;
  v_user_id uuid;
  v_meal jsonb;
  v_item jsonb;

begin
  v_user_id := auth.uid();
  v_plan_id := (p_payload->>'id')::uuid;

  if v_plan_id is null then
    raise exception 'id is required';
  end if;

  select dp.company_id
  into v_existing_company_id
  from public.diet_plans dp
  where dp.id = v_plan_id;

  if v_existing_company_id is null then
    raise exception 'Diet plan not found';
  end if;

  if not (
    public.is_company_owner(v_company_id)
    or
    public.has_company_role(v_existing_company_id, 'admin')
    or public.has_company_role(v_existing_company_id, 'staff')
    or public.has_company_role(v_existing_company_id, 'coach')
  ) then
    raise exception 'You do not have permission to update this diet plan';
  end if;

  update public.diet_plans
  set
    title = p_payload->>'title',
    description = p_payload->>'description',
    status = p_payload->>'status',
    updated_by = v_user_id
  where id = v_plan_id;

  delete from public.diet_plan_meals
  where diet_plan_id = v_plan_id;

  for v_meal in
    select value
    from jsonb_array_elements(coalesce(p_payload->'meals', '[]'::jsonb))
  loop
    insert into public.diet_plan_meals (
      diet_plan_id,
      day_index,
      meal_type,
      notes,
      order_index
    )
    values (
      v_plan_id,
      nullif(v_meal->>'day_index', '')::int,
      v_meal->>'meal_type',
      nullif(trim(v_meal->>'notes'), ''),
      coalesce((v_meal->>'order_index')::int, 0)
    )
    returning id into v_meal_id;

    for v_item in
      select value
      from jsonb_array_elements(coalesce(v_meal->'items', '[]'::jsonb))
    loop
      insert into public.diet_meal_items (
        meal_id,
        food_name,
        quantity,
        notes,
        order_index
      )
      values (
        v_meal_id,
        trim(v_item->>'food_name'),
        trim(v_item->>'quantity'),
        nullif(trim(v_item->>'notes'), ''),
        coalesce((v_item->>'order_index')::int, 0)
      );
    end loop;
  end loop;

  return v_plan_id;
end;
$$;

ALTER FUNCTION public.update_diet_plan_with_meals(jsonb) OWNER TO postgres;
REVOKE ALL ON FUNCTION public.update_diet_plan_with_meals(jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.update_diet_plan_with_meals(jsonb) TO authenticated;

--===========================================

-- GRANT
--===========================================
GRANT SELECT, INSERT, UPDATE, DELETE
ON public.diet_plans
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.diet_plan_meals
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.diet_meal_items
TO authenticated;
