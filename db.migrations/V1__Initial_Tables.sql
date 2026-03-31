-- =========================================================
-- HELPERS
-- =========================================================

-- TODO: updated_at trigger if frontend is not setting it
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- =========================================================
-- TABLES
-- =========================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  picture_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  mode TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.company_user (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  is_owner BOOLEAN NOT NULL DEFAULT FALSE,
  joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE (user_id, company_id)
);

CREATE TABLE IF NOT EXISTS public.company_role (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  UNIQUE (company_id, name)
);

CREATE TABLE IF NOT EXISTS public.company_role_permission (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_role_id UUID NOT NULL REFERENCES public.company_role(id) ON DELETE CASCADE,
  module TEXT NOT NULL,
  can_read BOOLEAN NOT NULL,
  can_write BOOLEAN NOT NULL,
  can_delete BOOLEAN NOT NULL,
  UNIQUE (company_role_id, module)
);

CREATE TABLE IF NOT EXISTS public.company_user_role (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_user_id UUID NOT NULL REFERENCES public.company_user(id) ON DELETE CASCADE,
  company_role_id UUID NOT NULL REFERENCES public.company_role(id) ON DELETE CASCADE,
  UNIQUE (company_user_id, company_role_id)
);

-- =========================================================
-- INDEXES
-- =========================================================

DROP INDEX IF EXISTS idx_companies_deleted_at;
CREATE INDEX IF NOT EXISTS idx_companies_deleted_at
  ON public.companies(deleted_at)
  WHERE deleted_at IS NULL;

DROP INDEX IF EXISTS idx_company_user_company_id;
CREATE INDEX IF NOT EXISTS idx_company_user_company_id
  ON public.company_user(company_id);

DROP INDEX IF EXISTS idx_company_user_user_id;
CREATE INDEX IF NOT EXISTS idx_company_user_user_id
  ON public.company_user(user_id);

DROP INDEX IF EXISTS idx_company_user_role_company_role_id;
CREATE INDEX IF NOT EXISTS idx_company_user_role_company_role_id
  ON public.company_user_role(company_role_id);

DROP INDEX IF EXISTS idx_company_user_role_company_user_id;
CREATE INDEX IF NOT EXISTS idx_company_user_role_company_user_id
  ON public.company_user_role(company_user_id);

DROP INDEX IF EXISTS idx_company_role_name;
CREATE INDEX IF NOT EXISTS idx_company_role_name
  ON public.company_role(name);

DROP INDEX IF EXISTS idx_company_one_owner;
CREATE UNIQUE INDEX IF NOT EXISTS idx_company_one_owner
  ON public.company_user(company_id)
  WHERE is_owner = TRUE;

-- =========================================================
-- ALTER TABLES
-- =========================================================

-- updated: update column profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS phone VARCHAR(20) UNIQUE,
ADD COLUMN IF NOT EXISTS active_company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN NOT NULL DEFAULT FALSE;

-- updated: column companies
ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS phone VARCHAR(20) UNIQUE;

ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS brn TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS post_code TEXT,
ADD COLUMN IF NOT EXISTS region TEXT,
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS contact_phone TEXT,
ADD COLUMN IF NOT EXISTS terms TEXT,
ADD COLUMN IF NOT EXISTS disclaimer TEXT;

--=========================================================
-- HELPERS
--=========================================================

-- is super admin (about creating companies)
DROP FUNCTION IF EXISTS public.is_super_admin();

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.is_super_admin = TRUE
  );
$$;

ALTER FUNCTION public.is_super_admin() OWNER TO postgres;
REVOKE ALL ON FUNCTION public.is_super_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_super_admin() TO authenticated;

-- Is current user in company?
DROP FUNCTION IF EXISTS public.is_company_member(UUID);

CREATE OR REPLACE FUNCTION public.is_company_member(
  _company_id UUID
)
RETURNS BOOLEAN
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

ALTER FUNCTION public.is_company_member(UUID) OWNER TO postgres;
REVOKE ALL ON FUNCTION public.is_company_member(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_company_member(UUID) TO authenticated;

-- Does current user have a role in company?
DROP FUNCTION IF EXISTS public.has_company_role(UUID, TEXT);

CREATE OR REPLACE FUNCTION public.has_company_role(
  _company_id UUID,
  _role TEXT
)
RETURNS BOOLEAN
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
      AND LOWER(cr.name) = LOWER(_role)
  );
$$;

ALTER FUNCTION public.has_company_role(UUID, TEXT) OWNER TO postgres;
REVOKE ALL ON FUNCTION public.has_company_role(UUID, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_company_role(UUID, TEXT) TO authenticated;

-- is company owner?
DROP FUNCTION IF EXISTS public.is_company_owner(UUID);

CREATE OR REPLACE FUNCTION public.is_company_owner(
  _company_id UUID
)
RETURNS BOOLEAN
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
      AND cu.is_owner = TRUE
  );
$$;

ALTER FUNCTION public.is_company_owner(UUID) OWNER TO postgres;
REVOKE ALL ON FUNCTION public.is_company_owner(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_company_owner(UUID) TO authenticated;

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

-- =========================================================
-- VIEW
-- =========================================================

-- Select Dropdown purpose (assigned coach)
DROP VIEW IF EXISTS public.v_company_coaches;

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

-- =========================================================
-- RPC
-- =========================================================

-- set active_company_id after logged in or personal workspace otherwise no need both but super admin
DROP FUNCTION IF EXISTS public.ensure_active_company_or_personal_workspace();

CREATE OR REPLACE FUNCTION public.ensure_active_company_or_personal_workspace()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_user_id UUID;
  v_company UUID;
  v_company_user_id UUID;
  v_is_super_admin BOOLEAN;
  result JSONB;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- check platform-level super admin
  v_is_super_admin := public.is_super_admin();

  -- 1) if already set on profile, use it
  SELECT p.active_company_id
  INTO v_company
  FROM public.profiles p
  WHERE p.id = v_user_id;

  -- 2) otherwise pick best existing membership
  IF v_company IS NULL THEN
    SELECT cu.company_id
    INTO v_company
    FROM public.company_user cu
    WHERE cu.user_id = v_user_id
    ORDER BY cu.is_owner DESC, cu.joined_at DESC
    LIMIT 1;
  END IF;

  -- 3) if no company:
  --    - super admin: do NOT create personal/company workspace
  --    - normal user: create personal workspace + owner link
  IF v_company IS NULL THEN
    IF v_is_super_admin THEN
      UPDATE public.profiles
      SET active_company_id = NULL,
          updated_at = NOW()
      WHERE id = v_user_id;

      SELECT jsonb_build_object(
        'profile', jsonb_build_object(
          'id', p.id,
          'first_name', p.first_name,
          'last_name', p.last_name,
          'picture_url', p.picture_url,
          'active_company_id', NULL,
          'is_super_admin', TRUE
        ),
        'company', NULL,
        'company_user', NULL,
        'roles', '[]'::JSONB,
        'permissions', '[]'::JSONB
      )
      INTO result
      FROM public.profiles p
      WHERE p.id = v_user_id;

      RETURN result;
    ELSE
      INSERT INTO public.companies(name, mode)
      VALUES ('Personal Workspace', 'personal')
      RETURNING id INTO v_company;

      INSERT INTO public.company_user(user_id, company_id, is_owner)
      VALUES (v_user_id, v_company, TRUE)
      RETURNING id INTO v_company_user_id;
    END IF;
  END IF;

  -- 4) ensure active company is stored on profile
  UPDATE public.profiles
  SET active_company_id = v_company,
      updated_at = NOW()
  WHERE id = v_user_id;

  -- 5) get company_user id for that active company
  IF v_company_user_id IS NULL THEN
    SELECT cu.id
    INTO v_company_user_id
    FROM public.company_user cu
    WHERE cu.user_id = v_user_id
      AND cu.company_id = v_company
    LIMIT 1;
  END IF;

  -- 6) return full auth/menu context
  SELECT jsonb_build_object(
    'profile', jsonb_build_object(
      'id', p.id,
      'first_name', p.first_name,
      'last_name', p.last_name,
      'picture_url', p.picture_url,
      'active_company_id', p.active_company_id,
      'is_super_admin', v_is_super_admin
    ),
    'company', jsonb_build_object(
      'id', c.id,
      'name', c.name,
      'mode', c.mode
    ),
    'company_user', CASE
      WHEN cu.id IS NULL THEN NULL
      ELSE jsonb_build_object(
        'id', cu.id,
        'user_id', cu.user_id,
        'company_id', cu.company_id,
        'is_owner', cu.is_owner,
        'joined_at', cu.joined_at
      )
    END,
    'roles', COALESCE(roles_data.roles, '[]'::JSONB),
    'permissions', COALESCE(perms_data.permissions, '[]'::JSONB)
  )
  INTO result
  FROM public.profiles p
  JOIN public.companies c
    ON c.id = v_company
  LEFT JOIN public.company_user cu
    ON cu.user_id = p.id
   AND cu.company_id = c.id
  LEFT JOIN LATERAL (
    SELECT jsonb_agg(
      DISTINCT jsonb_build_object(
        'id', cr.id,
        'name', cr.name
      )
    ) AS roles
    FROM public.company_user_role cur
    JOIN public.company_role cr
      ON cr.id = cur.company_role_id
    WHERE cur.company_user_id = cu.id
  ) roles_data ON TRUE
  LEFT JOIN LATERAL (
    SELECT jsonb_agg(
      DISTINCT jsonb_build_object(
        'role_id', cr.id,
        'role_name', cr.name,
        'module', crp.module,
        'can_read', crp.can_read,
        'can_write', crp.can_write,
        'can_delete', crp.can_delete
      )
    ) AS permissions
    FROM public.company_user_role cur
    JOIN public.company_role cr
      ON cr.id = cur.company_role_id
    JOIN public.company_role_permission crp
      ON crp.company_role_id = cr.id
    WHERE cur.company_user_id = cu.id
  ) perms_data ON TRUE
  WHERE p.id = v_user_id;

  RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION public.ensure_active_company_or_personal_workspace() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ensure_active_company_or_personal_workspace() TO authenticated;

-- =========================================================
-- POLICIES
-- =========================================================

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_user ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_role ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_role_permission ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_user_role ENABLE ROW LEVEL SECURITY;

-- companies
DROP POLICY IF EXISTS "companies_select" ON public.companies;
CREATE POLICY "companies_select"
ON public.companies
FOR SELECT
USING (
  public.is_company_member(id)
  OR public.is_super_admin()
);

DROP POLICY IF EXISTS "companies_update_admin" ON public.companies;
CREATE POLICY "companies_update_admin"
ON public.companies
FOR UPDATE
USING (
  public.has_company_role(id, 'admin')
)
WITH CHECK (
  public.has_company_role(id, 'admin')
);

DROP POLICY IF EXISTS "companies_write_super_admin" ON public.companies;
CREATE POLICY "companies_write_super_admin"
ON public.companies
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_super_admin()
);

-- company_user
DROP POLICY IF EXISTS "company_user_select" ON public.company_user;
CREATE POLICY "company_user_select"
ON public.company_user
FOR SELECT
USING (
  public.is_company_member(company_id)
);

DROP POLICY IF EXISTS "company_user_admin_write" ON public.company_user;
CREATE POLICY "company_user_admin_write"
ON public.company_user
FOR ALL
USING (
  public.has_company_role(company_id, 'admin')
)
WITH CHECK (
  public.has_company_role(company_id, 'admin')
);

-- company_role
DROP POLICY IF EXISTS "company_role_select" ON public.company_role;
CREATE POLICY "company_role_select"
ON public.company_role
FOR SELECT
USING (
  public.is_company_member(company_id)
);

DROP POLICY IF EXISTS "company_role_admin_write" ON public.company_role;
CREATE POLICY "company_role_admin_write"
ON public.company_role
FOR ALL
USING (
  public.has_company_role(company_id, 'admin')
)
WITH CHECK (
  public.has_company_role(company_id, 'admin')
);

-- company_role_permission
DROP POLICY IF EXISTS "company_role_permission_select" ON public.company_role_permission;
CREATE POLICY "company_role_permission_select"
ON public.company_role_permission
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.company_role cr
    WHERE cr.id = company_role_permission.company_role_id
      AND public.is_company_member(cr.company_id)
  )
);

DROP POLICY IF EXISTS "company_role_permission_admin_write" ON public.company_role_permission;
CREATE POLICY "company_role_permission_admin_write"
ON public.company_role_permission
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.company_role cr
    WHERE cr.id = company_role_permission.company_role_id
      AND public.has_company_role(cr.company_id, 'admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.company_role cr
    WHERE cr.id = company_role_permission.company_role_id
      AND public.has_company_role(cr.company_id, 'admin')
  )
);

-- company_user_role
DROP POLICY IF EXISTS "company_user_role_select" ON public.company_user_role;
CREATE POLICY "company_user_role_select"
ON public.company_user_role
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.company_user cu
    WHERE cu.id = company_user_role.company_user_id
      AND public.is_company_member(cu.company_id)
  )
);

DROP POLICY IF EXISTS "company_user_role_admin_write" ON public.company_user_role;
CREATE POLICY "company_user_role_admin_write"
ON public.company_user_role
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.company_user cu
    JOIN public.company_role cr
      ON cr.id = company_user_role.company_role_id
    WHERE cu.id = company_user_role.company_user_id
      AND cr.id = company_user_role.company_role_id
      AND public.has_company_role(cu.company_id, 'admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.company_user cu
    JOIN public.company_role cr
      ON cr.id = company_user_role.company_role_id
    WHERE cu.id = company_user_role.company_user_id
      AND cr.id = company_user_role.company_role_id
      AND public.has_company_role(cu.company_id, 'admin')
  )
);

-- =========================================================
-- GRANTS
-- =========================================================

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