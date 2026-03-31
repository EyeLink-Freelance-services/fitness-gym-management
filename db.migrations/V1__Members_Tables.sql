-- =========================================================
-- ENUMS
-- =========================================================

DO $$
BEGIN
  CREATE TYPE public.member_status AS ENUM ('active', 'inactive');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

-- =========================================================
-- TABLES
-- =========================================================

CREATE TABLE IF NOT EXISTS public.members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  assigned_coach_id UUID REFERENCES public.profiles(id),
  member_code TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  dob DATE,
  gender TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  medical_notes TEXT,
  status public.member_status NOT NULL DEFAULT 'active',
  created_by UUID REFERENCES public.profiles(id),
  updated_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.member_medical_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  created_by UUID REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================
-- INDEXES
-- =========================================================

DROP INDEX IF EXISTS idx_members_company;
CREATE INDEX IF NOT EXISTS idx_members_company
  ON public.members(company_id);

DROP INDEX IF EXISTS idx_members_company_status;
CREATE INDEX IF NOT EXISTS idx_members_company_status
  ON public.members(company_id, status);

DROP INDEX IF EXISTS idx_members_company_coach;
CREATE INDEX IF NOT EXISTS idx_members_company_coach
  ON public.members(company_id, assigned_coach_id);

DROP INDEX IF EXISTS uq_members_company_member_code;
CREATE UNIQUE INDEX IF NOT EXISTS uq_members_company_member_code
  ON public.members(company_id, member_code)
  WHERE member_code IS NOT NULL;

-- =========================================================
-- TRIGGERS
-- =========================================================

DROP TRIGGER IF EXISTS trg_members_updated_at
ON public.members;

DROP TRIGGER IF EXISTS trg_set_updated_at
ON public.members;

CREATE TRIGGER trg_members_updated_at
BEFORE UPDATE ON public.members
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- POLICIES
-- =========================================================

ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_medical_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "members_select_member"
ON public.members;

CREATE POLICY "members_select_member"
ON public.members
FOR SELECT
USING (
  public.is_company_member(company_id)
  AND deleted_at IS NULL
);

DROP POLICY IF EXISTS "members_write_staff_admin"
ON public.members;

CREATE POLICY "members_write_staff_admin"
ON public.members
FOR INSERT
WITH CHECK (
  public.has_company_role(company_id, 'admin')
  OR public.has_company_role(company_id, 'staff')
  OR public.is_company_owner(company_id)
);

DROP POLICY IF EXISTS "members_update_staff_admin"
ON public.members;

CREATE POLICY "members_update_staff_admin"
ON public.members
FOR UPDATE
USING (
  public.has_company_role(company_id, 'admin')
  OR public.has_company_role(company_id, 'staff')
  OR public.is_company_owner(company_id)
)
WITH CHECK (
  public.has_company_role(company_id, 'admin')
  OR public.has_company_role(company_id, 'staff')
  OR public.is_company_owner(company_id)
);

-- -- coach can update members only if assigned (optional)
-- DROP POLICY IF EXISTS "members_update_coach_assigned" ON public.members;
-- CREATE POLICY "members_update_coach_assigned"
-- ON public.members
-- FOR UPDATE
-- USING (
--   public.has_company_role(company_id, 'coach')
--   AND assigned_coach_id = auth.uid()
-- )
-- WITH CHECK (
--   public.has_company_role(company_id, 'coach')
--   AND assigned_coach_id = auth.uid()
-- );

-- admin can view, staff can view and coach can view member_medical_history only if assigned
DROP POLICY IF EXISTS "member_medical_history_select"
ON public.member_medical_history;

CREATE POLICY "member_medical_history_select"
ON public.member_medical_history
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.members m
    WHERE m.id = member_medical_history.member_id
      AND (
        public.has_company_role(m.company_id, 'admin')
        OR public.has_company_role(m.company_id, 'staff')
        OR m.assigned_coach_id = auth.uid()
      )
  )
);

-- admin and staff can insert
DROP POLICY IF EXISTS "member_medical_history_insert"
ON public.member_medical_history;

CREATE POLICY "member_medical_history_insert"
ON public.member_medical_history
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.members m
    WHERE m.id = member_medical_history.member_id
      AND (
        public.has_company_role(m.company_id, 'admin')
        OR public.has_company_role(m.company_id, 'staff')
      )
  )
);

-- admin and staff can update
DROP POLICY IF EXISTS "member_medical_history_update"
ON public.member_medical_history;

CREATE POLICY "member_medical_history_update"
ON public.member_medical_history
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM public.members m
    WHERE m.id = member_medical_history.member_id
      AND (
        public.has_company_role(m.company_id, 'admin')
        OR public.has_company_role(m.company_id, 'staff')
      )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.members m
    WHERE m.id = member_medical_history.member_id
      AND (
        public.has_company_role(m.company_id, 'admin')
        OR public.has_company_role(m.company_id, 'staff')
      )
  )
);

-- =========================================================
-- RPC
-- =========================================================

-- run in transactional way
DROP FUNCTION IF EXISTS public.create_member_with_membership(
  UUID,
  TEXT,
  TEXT,
  DATE,
  TEXT,
  TEXT,
  TEXT,
  TEXT,
  public.member_status,
  UUID,
  UUID,
  DATE,
  UUID,
  TEXT,
  TEXT,
  TEXT,
  TEXT,
  DATE,
  TEXT
);

CREATE OR REPLACE FUNCTION public.create_member_with_membership(
  p_company_id UUID,
  p_first_name TEXT,
  p_last_name TEXT,
  p_dob DATE,
  p_gender TEXT,
  p_phone TEXT,
  p_email TEXT,
  p_emergency_contact_phone TEXT,
  p_member_status public.member_status,
  p_created_by UUID,
  p_plan_id UUID,
  p_end_date DATE,
  p_assigned_coach_id UUID DEFAULT NULL,
  p_member_code TEXT DEFAULT NULL,
  p_address TEXT DEFAULT NULL,
  p_emergency_contact_name TEXT DEFAULT NULL,
  p_medical_notes TEXT DEFAULT NULL,
  p_start_date DATE DEFAULT CURRENT_DATE,
  p_membership_status TEXT DEFAULT 'active'
)
RETURNS TABLE (
  member_id UUID,
  membership_id UUID
)
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  v_member_id UUID;
  v_membership_id UUID;
BEGIN
  INSERT INTO public.members (
    company_id,
    assigned_coach_id,
    member_code,
    first_name,
    last_name,
    dob,
    gender,
    phone,
    email,
    address,
    emergency_contact_name,
    emergency_contact_phone,
    medical_notes,
    status,
    created_by
  )
  VALUES (
    p_company_id,
    p_assigned_coach_id,
    p_member_code,
    p_first_name,
    p_last_name,
    p_dob,
    p_gender,
    p_phone,
    p_email,
    p_address,
    p_emergency_contact_name,
    p_emergency_contact_phone,
    p_medical_notes,
    COALESCE(p_member_status, 'active'::public.member_status),
    p_created_by
  )
  RETURNING id INTO v_member_id;

  INSERT INTO public.member_memberships (
    company_id,
    member_id,
    plan_id,
    start_date,
    end_date,
    status,
    created_by
  )
  VALUES (
    p_company_id,
    v_member_id,
    p_plan_id,
    p_start_date,
    p_end_date,
    COALESCE(p_membership_status, 'active'),
    p_created_by
  )
  RETURNING id INTO v_membership_id;

  RETURN QUERY
  SELECT v_member_id, v_membership_id;
END;
$$;

ALTER FUNCTION public.create_member_with_membership(
  UUID,
  TEXT,
  TEXT,
  DATE,
  TEXT,
  TEXT,
  TEXT,
  TEXT,
  public.member_status,
  UUID,
  UUID,
  DATE,
  UUID,
  TEXT,
  TEXT,
  TEXT,
  TEXT,
  DATE,
  TEXT
) OWNER TO postgres;

REVOKE ALL ON FUNCTION public.create_member_with_membership(
  UUID,
  TEXT,
  TEXT,
  DATE,
  TEXT,
  TEXT,
  TEXT,
  TEXT,
  public.member_status,
  UUID,
  UUID,
  DATE,
  UUID,
  TEXT,
  TEXT,
  TEXT,
  TEXT,
  DATE,
  TEXT
) FROM PUBLIC;

-- =========================================================
-- GRANTS
-- =========================================================

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.members
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.member_medical_history
TO authenticated;