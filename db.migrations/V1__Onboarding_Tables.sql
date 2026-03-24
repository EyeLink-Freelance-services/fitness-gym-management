--===============================

--Tables
--===============================
create table if not exists public.onboarding_invites (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  token text not null unique,
  invitation_type text not null check (invitation_type in ('personal', 'company')),
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'expired', 'cancelled')),
  company_name varchar(255),
  note text,
  accepted_by uuid references auth.users(id) on delete set null,
  accepted_at timestamptz,
  expires_at timestamptz not null,
  terms_version text,
  privacy_version text,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_onboarding_invites_email
  on public.onboarding_invites(email);

create index if not exists idx_onboarding_invites_status
  on public.onboarding_invites(status);

create index if not exists idx_onboarding_invites_expires_at
  on public.onboarding_invites(expires_at);

create table if not exists public.onboarding_invite_acceptance (
  id uuid primary key default gen_random_uuid(),
  invite_id uuid not null references public.onboarding_invites(id) on delete cascade,
  accepted_terms boolean not null default false,
  accepted_privacy boolean not null default false,
  terms_version text not null,
  privacy_version text not null,
  accepted_at timestamptz not null default now(),
  ip_address text,
  user_agent text
);

create unique index if not exists idx_onboarding_invite_acceptance_invite_id
  on public.onboarding_invite_acceptance(invite_id);

--===============================

--FUNCTIONS
--===============================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    first_name,
    last_name
  )
  values (
    new.id,
    new.email,
    '',
    ''
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

alter function public.handle_new_user() owner to postgres;
revoke all on function public.handle_new_user() from public;
grant execute on function public.handle_new_user() to authenticated;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- create profile, create company or personal coach
create or replace function public.complete_onboarding(
  p_token text,
  p_first_name text,
  p_last_name text,
  p_company_name text,
  p_company_email text,
  p_company_phone text,
  p_picture_url text text default null,
  p_phone text default null,
  p_company_logo_url text default null,
  p_company_brn text default null,
  p_company_address text default null,
  p_comapny_region text default null,
  p_comapny_post_code text default null,
  p_comapny_city text default null,
  p_comapny_terms text default null,
  p_comapny_disclaimer text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_invite public.onboarding_invites%rowtype;
  v_user_id uuid;
  v_user_email text;
  v_company_id uuid;
  v_company_user_id uuid;
  v_admin_role_id uuid;
  v_staff_role_id uuid;
  v_coach_role_id uuid;
begin
  v_user_id := auth.uid();

  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  select au.email
  into v_user_email
  from auth.users au
  where au.id = v_user_id;

  select *
  into v_invite
  from public.onboarding_invites
  where token = p_token
  limit 1;

  if v_invite.id is null then
    raise exception 'Invalid invitation token';
  end if;

  if v_invite.status <> 'pending' then
    raise exception 'Invitation is no longer available';
  end if;

  if v_invite.expires_at < now() then
    raise exception 'Invitation has expired';
  end if;

  if lower(v_user_email) <> lower(v_invite.email) then
    raise exception 'This invitation is not associated with your account';
  end if;

  if not exists (
    select 1
    from public.onboarding_invite_acceptance a
    where a.invite_id = v_invite.id
      and a.accepted_terms = true
      and a.accepted_privacy = true
  ) then
    raise exception 'Terms and privacy policy must be accepted first';
  end if;

  update public.profiles
  set
    first_name = p_first_name,
    last_name = p_last_name,
    picture_url = p_picture_url,
    phone = p_phone,
    email = v_user_email,
    updated_at = now()
  where id = v_user_id;

  if v_invite.invitation_type = 'company' then
    insert into public.companies (
      name,
      mode,
      contact_phone,
      contact_email
      logo_url,
      brn,
      address,
      region,
      post_code,
      city,
      terms,
      disclaimer
    )
    values (
      coalesce(nullif(trim(p_company_name), ''), coalesce(v_invite.company_name, 'My Company')),
      'company',
      p_company_phone,
      p_company_email,
      p_company_logo_url,
      p_company_brn,
      p_company_address,
      p_comapny_region,
      p_comapny_post_code,
      p_comapny_city,
      p_comapny_terms,
      p_comapny_disclaimer
    )
    returning id into v_company_id;

    insert into public.company_user (
      user_id,
      company_id,
      is_owner
    )
    values (
      v_user_id,
      v_company_id,
      true
    )
    returning id into v_company_user_id;

    insert into public.company_role(company_id, name)
    values
      (v_company_id, 'admin'),
      (v_company_id, 'staff'),
      (v_company_id, 'coach');
    
    perform public.seed_default_company_role_permissions(v_company_id);

    select id into v_admin_role_id
    from public.company_role
    where company_id = v_company_id and name = 'admin';

    select id into v_staff_role_id
    from public.company_role
    where company_id = v_company_id and name = 'staff';

    select id into v_coach_role_id
    from public.company_role
    where company_id = v_company_id and name = 'coach';

    insert into public.company_user_role (company_user_id, company_role_id)
    values (v_company_user_id, v_admin_role_id);

    update public.profiles
    set active_company_id = v_company_id,
        updated_at = now()
    where id = v_user_id;

    update public.onboarding_invites
    set
      status = 'accepted',
      accepted_by = v_user_id,
      accepted_at = now(),
      updated_at = now()
    where id = v_invite.id;

    return jsonb_build_object(
      'ok', true,
      'workspace_type', 'company',
      'company_id', v_company_id
    );
  end if;

  insert into public.companies (
    name,
    mode,
    contact_email
  )
  values (
    concat(p_first_name, ' ', p_last_name, ' Workspace'),
    'personal',
    v_user_email
  )
  returning id into v_company_id;

  insert into public.company_user (
    user_id,
    company_id,
    is_owner
  )
  values (
    v_user_id,
    v_company_id,
    true
  )
  returning id into v_company_user_id;

  -- insert into public.company_role (company_id, name)
  -- values
  --   (v_company_id, 'admin'),
  --   (v_company_id, 'staff'),
  --   (v_company_id, 'coach');

  -- select id into v_admin_role_id
  -- from public.company_role
  -- where company_id = v_company_id and name = 'admin';

  -- insert into public.company_user_role (company_user_id, company_role_id)
  -- values (v_company_user_id, v_admin_role_id);

  update public.profiles
  set active_company_id = v_company_id,
      updated_at = now()
  where id = v_user_id;

  update public.onboarding_invites
  set
    status = 'accepted',
    accepted_by = v_user_id,
    accepted_at = now(),
    updated_at = now()
  where id = v_invite.id;

  return jsonb_build_object(
    'ok', true,
    'workspace_type', 'personal',
    'company_id', v_company_id
  );
end;
$$;

alter function public.complete_onboarding() owner to postgres;
revoke all on function public.complete_onboarding() from public;
grant execute on function public.complete_onboarding() to authenticated;

-- default admin staff coach permission
create or replace function public.seed_default_company_role_permissions(
  p_company_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin_role_id uuid;
  v_staff_role_id uuid;
  v_coach_role_id uuid;
begin
  select id into v_admin_role_id
  from public.company_role
  where company_id = p_company_id and name = 'admin';

  select id into v_staff_role_id
  from public.company_role
  where company_id = p_company_id and name = 'staff';

  select id into v_coach_role_id
  from public.company_role
  where company_id = p_company_id and name = 'coach';

  insert into public.company_role_permission (company_role_id, module, can_read, can_write, can_delete)
  values
    (v_admin_role_id, 'dashboard.company', true, true, true),
    (v_admin_role_id, 'members', true, true, true),
    (v_admin_role_id, 'staff', true, true, true),
    (v_admin_role_id, 'coach', true, true, true),
    (v_admin_role_id, 'schema_builder', true, true, true),
    (v_admin_role_id, 'formula_builder', true, true, true),
    (v_admin_role_id, 'diet_plans', true, false, true),
    (v_admin_role_id, 'membership_plans', true, true, true),
    (v_admin_role_id, 'payments', true, true, true),
    (v_admin_role_id, 'calendar', true, true, true),
    (v_admin_role_id, 'announcements', true, true, true),
    (v_admin_role_id, 'services', true, true, true),
    (v_admin_role_id, 'settings', true, true, true)
  on conflict do nothing;

  insert into public.company_role_permission (company_role_id, module, can_read, can_write, can_delete)
  values
    (v_staff_role_id, 'dashboard.company.operational', true, false, false)
    (v_staff_role_id, 'members', true, true, false),
    (v_staff_role_id, 'training_plans', true, false, false),
    (v_staff_role_id, 'diet_plans', true, false, false),
    (v_staff_role_id, 'membership_plans', true, false, false),
    (v_staff_role_id, 'payments', true, true, false),
    (v_staff_role_id, 'calendar', true, true, false),
    (v_staff_role_id, 'announcements', true, true, true),
    (v_staff_role_id, 'services', true, true, false)
  on conflict do nothing;

  insert into public.company_role_permission (company_role_id, module, can_read, can_write, can_delete)
  values
    (v_coach_role_id, 'dashboard.company.coach', true, false, false),
    (v_coach_role_id, 'members', true, false, false),
    (v_coach_role_id, 'schema_builder', true, true, true),
    (v_coach_role_id, 'formula_builder', true, true, true),
    (v_coach_role_id, 'training_plans', true, true, false),
    (v_coach_role_id, 'diet_plans', true, true, false),
    (v_coach_role_id, 'calendar', true, true, false),
    (v_coach_role_id, 'announcements', true, false, false),
  on conflict do nothing;
end;
$$;

alter function public.seed_default_company_role_permissions() owner to postgres;
revoke all on function public.seed_default_company_role_permissions() from public;
grant execute on function public.seed_default_company_role_permissions() to authenticated;

