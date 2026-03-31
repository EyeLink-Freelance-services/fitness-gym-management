DO $$
BEGIN
  CREATE TYPE public.coach_status AS ENUM ('active', 'inactive');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

-- =========================================================
-- TABLE
-- =========================================================

DROP TABLE IF EXISTS public.company_coach_details CASCADE;

CREATE TABLE IF NOT EXISTS public.company_coach_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_user_id UUID NOT NULL REFERENCES public.company_user(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  specialization TEXT NOT NULL,
  certifications TEXT,
  year_exp INT,
  bio TEXT,
  availability TEXT NOT NULL,
  status public.coach_status NOT NULL DEFAULT 'active',
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT chk_company_coach_details_year_exp
    CHECK (year_exp IS NULL OR year_exp >= 0)
);

-- =========================================================
-- INDEXES
-- =========================================================

DROP INDEX IF EXISTS uq_company_coach_details_company_user_active;
CREATE UNIQUE INDEX IF NOT EXISTS uq_company_coach_details_company_user_active
  ON public.company_coach_details(company_user_id)
  WHERE deleted_at IS NULL;

DROP INDEX IF EXISTS idx_company_coach_details_company_user_id;
CREATE INDEX IF NOT EXISTS idx_company_coach_details_company_user_id
  ON public.company_coach_details(company_user_id);

DROP INDEX IF EXISTS idx_company_coach_details_email;
CREATE INDEX IF NOT EXISTS idx_company_coach_details_email
  ON public.company_coach_details(email);

DROP INDEX IF EXISTS idx_company_coach_details_status;
CREATE INDEX IF NOT EXISTS idx_company_coach_details_status
  ON public.company_coach_details(status);

DROP INDEX IF EXISTS idx_company_coach_details_deleted_at;
CREATE INDEX IF NOT EXISTS idx_company_coach_details_deleted_at
  ON public.company_coach_details(deleted_at);

DROP INDEX IF EXISTS idx_company_coach_details_company_user_deleted;
CREATE INDEX IF NOT EXISTS idx_company_coach_details_company_user_deleted
  ON public.company_coach_details(company_user_id, deleted_at);

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
-- POLICIES
-- =========================================================

ALTER TABLE public.company_coach_details ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "company_coach_details_select"
ON public.company_coach_details;

CREATE POLICY "company_coach_details_select"
ON public.company_coach_details
FOR SELECT
TO authenticated
USING (
  deleted_at IS NULL
  AND EXISTS (
    SELECT 1
    FROM public.company_user cu
    WHERE cu.id = company_coach_details.company_user_id
      AND public.is_company_member(cu.company_id)
  )
);

DROP POLICY IF EXISTS "company_coach_details_insert"
ON public.company_coach_details;

CREATE POLICY "company_coach_details_insert"
ON public.company_coach_details
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.company_user cu
    WHERE cu.id = company_coach_details.company_user_id
      AND public.is_company_member(cu.company_id)
      AND (
        public.is_company_owner(cu.company_id)
        OR public.has_company_role(cu.company_id, 'admin')
        OR public.has_company_role(cu.company_id, 'staff')
      )
  )
);

DROP POLICY IF EXISTS "company_coach_details_update"
ON public.company_coach_details;

CREATE POLICY "company_coach_details_update"
ON public.company_coach_details
FOR UPDATE
TO authenticated
USING (
  deleted_at IS NULL
  AND EXISTS (
    SELECT 1
    FROM public.company_user cu
    WHERE cu.id = company_coach_details.company_user_id
      AND public.is_company_member(cu.company_id)
      AND (
        public.is_company_owner(cu.company_id)
        OR public.has_company_role(cu.company_id, 'admin')
        OR public.has_company_role(cu.company_id, 'staff')
      )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.company_user cu
    WHERE cu.id = company_coach_details.company_user_id
      AND public.is_company_member(cu.company_id)
      AND (
        public.is_company_owner(cu.company_id)
        OR public.has_company_role(cu.company_id, 'admin')
        OR public.has_company_role(cu.company_id, 'staff')
      )
  )
);

DROP POLICY IF EXISTS "company_coach_details_delete"
ON public.company_coach_details;

CREATE POLICY "company_coach_details_delete"
ON public.company_coach_details
FOR DELETE
TO authenticated
USING (
  deleted_at IS NULL
  AND EXISTS (
    SELECT 1
    FROM public.company_user cu
    WHERE cu.id = company_coach_details.company_user_id
      AND public.is_company_member(cu.company_id)
      AND (
        public.is_company_owner(cu.company_id)
        OR public.has_company_role(cu.company_id, 'admin')
      )
  )
);

-- =========================================================
-- RPC COMPANY COACH INSERT
-- =========================================================

DROP FUNCTION IF EXISTS public.create_company_coach(
  UUID,
  UUID,
  TEXT,
  TEXT,
  TEXT,
  TEXT,
  TEXT,
  TEXT,
  INT,
  TEXT,
  TEXT,
  public.coach_status
);

CREATE OR REPLACE FUNCTION public.create_company_coach(
  p_user_id UUID,
  p_company_id UUID,
  p_first_name TEXT,
  p_last_name TEXT,
  p_email TEXT,
  p_phone TEXT,
  p_specialization TEXT,
  p_certifications TEXT DEFAULT NULL,
  p_year_exp INT DEFAULT NULL,
  p_bio TEXT DEFAULT NULL,
  p_availability TEXT DEFAULT NULL,
  p_status public.coach_status DEFAULT 'active'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_company_id UUID;
  v_company_user_id UUID;
  v_coach_role_id UUID;
  v_profile_id UUID;
  v_coach_details_id UUID;
BEGIN
  
  -- VALIDATIONS
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'p_user_id is required';
  END IF;

  IF p_company_id IS NULL THEN
    RAISE EXCEPTION 'p_company_id is required';
  END IF;

  IF p_first_name IS NULL OR btrim(p_first_name) = '' THEN
    RAISE EXCEPTION 'first_name is required';
  END IF;

  IF p_last_name IS NULL OR btrim(p_last_name) = '' THEN
    RAISE EXCEPTION 'last_name is required';
  END IF;

  IF p_email IS NULL OR btrim(p_email) = '' THEN
    RAISE EXCEPTION 'email is required';
  END IF;

  IF p_specialization IS NULL OR btrim(p_specialization) = '' THEN
    RAISE EXCEPTION 'specialization is required';
  END IF;

  IF p_availability IS NULL OR btrim(p_availability) = '' THEN
    RAISE EXCEPTION 'availability is required';
  END IF;

  IF p_year_exp IS NOT NULL AND p_year_exp < 0 THEN
    RAISE EXCEPTION 'year_exp must be greater than or equal to 0';
  END IF;

  -- CHECK COMPANY EXISTS
  SELECT c.id
  INTO v_company_id
  FROM public.companies c
  WHERE c.id = p_company_id
    AND c.deleted_at IS NULL
  LIMIT 1;

  IF v_company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found';
  END IF;

  -- CHECK CURRENT USER PERMISSION
  -- owner/admin/staff can create a coach
  IF NOT (
    public.is_company_owner(v_company_id)
    OR public.has_company_role(v_company_id, 'admin')
    OR public.has_company_role(v_company_id, 'staff')
  ) THEN
    RAISE EXCEPTION 'You do not have permission to create a coach for this company';
  END IF;

  -- CHECK COACH ROLE EXISTS
  SELECT cr.id
  INTO v_coach_role_id
  FROM public.company_role cr
  WHERE cr.company_id = v_company_id
    AND LOWER(cr.name) = 'coach'
  LIMIT 1;

  IF v_coach_role_id IS NULL THEN
    RAISE EXCEPTION 'Coach role does not exist for this company';
  END IF;

  -- PROFILE INSERT
  -- if already exists, keep existing row
  INSERT INTO public.profiles (
    id,
    first_name,
    last_name,
    phone
  )
  VALUES (
    p_user_id,
    btrim(p_first_name),
    btrim(p_last_name),
    p_phone::VARCHAR
  )
  ON CONFLICT (id) DO UPDATE
    SET first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        updated_at = NOW()
  RETURNING id INTO v_profile_id;

  -- COMPANY USER INSERT
  INSERT INTO public.company_user (
    user_id,
    company_id,
    is_owner
  )
  VALUES (
    p_user_id,
    v_company_id,
    FALSE
  )
  RETURNING id INTO v_company_user_id;

  -- COMPANY USER ROLE INSERT
  INSERT INTO public.company_user_role (
    company_user_id,
    company_role_id
  )
  VALUES (
    v_company_user_id,
    v_coach_role_id
  );

  -- COMPANY COACH DETAILS INSERT
  INSERT INTO public.company_coach_details (
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
  VALUES (
    v_company_user_id,
    btrim(LOWER(p_email)),
    btrim(p_specialization),
    NULLIF(btrim(p_certifications), ''),
    p_year_exp,
    NULLIF(btrim(p_bio), ''),
    btrim(p_availability),
    p_status,
    auth.uid(),
    auth.uid()
  )
  RETURNING id INTO v_coach_details_id;

  -- RETURN
  RETURN jsonb_build_object(
    'ok', TRUE,
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
END;
$$;

ALTER FUNCTION public.create_company_coach(
  UUID,
  UUID,
  TEXT,
  TEXT,
  TEXT,
  TEXT,
  TEXT,
  TEXT,
  INT,
  TEXT,
  TEXT,
  public.coach_status
) OWNER TO postgres;

REVOKE ALL ON FUNCTION public.create_company_coach(
  UUID,
  UUID,
  TEXT,
  TEXT,
  TEXT,
  TEXT,
  TEXT,
  TEXT,
  INT,
  TEXT,
  TEXT,
  public.coach_status
) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.create_company_coach(
  UUID,
  UUID,
  TEXT,
  TEXT,
  TEXT,
  TEXT,
  TEXT,
  TEXT,
  INT,
  TEXT,
  TEXT,
  public.coach_status
) TO authenticated;

-- =========================================================
-- VIEW
-- =========================================================

DROP VIEW IF EXISTS public.v_company_coaches_complete;

CREATE OR REPLACE VIEW public.v_company_coaches_complete
AS
SELECT
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
  COUNT(m.id)::INT AS clients,
  ccd.status::TEXT AS status,
  ccd.created_by,
  ccd.updated_by
FROM public.company_coach_details ccd
JOIN public.company_user cu
  ON cu.id = ccd.company_user_id
JOIN public.profiles p
  ON p.id = cu.user_id
LEFT JOIN public.members m
  ON m.assigned_coach_id = p.id
 AND m.company_id = cu.company_id
 AND m.deleted_at IS NULL
WHERE ccd.deleted_at IS NULL
GROUP BY
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

GRANT SELECT ON public.v_company_coaches_complete TO authenticated;