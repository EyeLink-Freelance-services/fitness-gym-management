do $$ begin
 create type public.coach_status as enum ('active', 'inactive');
exception when duplicate_object then null; end $$;

-- =========================================================
-- TABLE
-- =========================================================

DROP TABLE IF EXISTS public.company_coach_details CASCADE;

CREATE TABLE IF NOT EXISTS public.company_coach_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
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
  deleted_at TIMESTAMPTZ
);

-- =========================================================
-- INDEXES
-- =========================================================

DROP INDEX IF EXISTS idx_company_coach_details_user_id;
CREATE INDEX IF NOT EXISTS idx_company_coach_details_user_id
  ON public.company_coach_details(user_id);

DROP INDEX IF EXISTS idx_company_coach_details_email;
CREATE INDEX IF NOT EXISTS idx_company_coach_details_email
  ON public.company_coach_details(email);

DROP INDEX IF EXISTS idx_company_coach_details_status;
CREATE INDEX IF NOT EXISTS idx_company_coach_details_status
  ON public.company_coach_details(status);

DROP INDEX IF EXISTS idx_company_coach_details_deleted_at;
CREATE INDEX IF NOT EXISTS idx_company_coach_details_deleted_at
  ON public.company_coach_details(deleted_at);

DROP INDEX IF EXISTS idx_company_coach_details_deleted;
CREATE INDEX IF NOT EXISTS idx_company_coach_details_deleted
  ON public.company_coach_details(user_id, deleted_at);

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
-- ENABLE RLS
-- =========================================================

ALTER TABLE public.company_coach_details ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- POLICIES
-- =========================================================

DROP POLICY IF EXISTS "company_coach_details_select"
ON public.company_coach_details;

CREATE POLICY "company_coach_details_select"
ON public.company_coach_details
FOR SELECT
TO authenticated
USING (
  deleted_at IS NULL
  AND (
    public.is_company_member(company_id)
  )
);

DROP POLICY IF EXISTS "company_coach_details_insert"
ON public.company_coach_details;

CREATE POLICY "company_coach_details_insert"
ON public.company_coach_details
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_company_member(company_id)
  AND (
    public.is_company_owner(company_id)
    OR public.has_company_role(company_id, 'admin')
    OR public.has_company_role(company_id, 'staff')
  )
);

DROP POLICY IF EXISTS "company_coach_details_update"
ON public.company_coach_details;

CREATE POLICY "company_coach_details_update"
ON public.company_coach_details
FOR UPDATE
TO authenticated
USING (
  public.is_company_member(company_id)
  AND (
    public.is_company_owner(company_id)
    OR public.has_company_role(company_id, 'admin')
    OR public.has_company_role(company_id, 'staff')
  )
)
WITH CHECK (
  public.is_company_member(company_id)
  AND (
    public.is_company_owner(company_id)
    OR public.has_company_role(company_id, 'admin')
    OR public.has_company_role(company_id, 'staff')
  )
);

DROP POLICY IF EXISTS "company_coach_details_delete"
ON public.company_coach_details;

CREATE POLICY "company_coach_details_delete"
ON public.company_coach_details
FOR DELETE
TO authenticated
USING (
  public.is_company_member(company_id)
  AND (
    public.is_company_owner(company_id)
    OR public.has_company_role(company_id, 'admin')
  )
);