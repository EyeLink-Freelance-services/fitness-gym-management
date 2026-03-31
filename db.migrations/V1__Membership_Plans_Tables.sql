-- =========================================================
-- TABLES
-- =========================================================

CREATE TABLE IF NOT EXISTS public.membership_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  entree_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
  duration_days INT NOT NULL DEFAULT 30,
  is_monthly BOOLEAN NOT NULL DEFAULT TRUE,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  updated_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.member_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.membership_plans(id) ON DELETE RESTRICT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================
-- COLUMNS
-- =========================================================

ALTER TABLE public.membership_plans
ADD COLUMN IF NOT EXISTS features TEXT[];

-- =========================================================
-- INDEXES
-- =========================================================

DROP INDEX IF EXISTS idx_membership_plans_company_active;
CREATE INDEX IF NOT EXISTS idx_membership_plans_company_active
  ON public.membership_plans(company_id, is_active);

DROP INDEX IF EXISTS idx_member_memberships_member;
CREATE INDEX IF NOT EXISTS idx_member_memberships_member
  ON public.member_memberships(member_id, end_date DESC);

DROP INDEX IF EXISTS idx_member_memberships_plan_id;
CREATE INDEX IF NOT EXISTS idx_member_memberships_plan_id
  ON public.member_memberships(plan_id);

-- =========================================================
-- TRIGGERS
-- =========================================================

DROP TRIGGER IF EXISTS trg_membership_plans_updated_at
ON public.membership_plans;

CREATE TRIGGER trg_membership_plans_updated_at
BEFORE UPDATE ON public.membership_plans
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- POLICIES
-- =========================================================
ALTER TABLE public.membership_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_memberships ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "membership_plans_select_company"
ON public.membership_plans;

CREATE POLICY "membership_plans_select_company"
ON public.membership_plans
FOR SELECT
USING (
  public.is_company_member(company_id)
);

DROP POLICY IF EXISTS "membership_plans_write_staff_admin"
ON public.membership_plans;

CREATE POLICY "membership_plans_write_staff_admin"
ON public.membership_plans
FOR INSERT
WITH CHECK (
  public.is_company_owner(company_id)
  OR public.has_company_role(company_id, 'admin')
  OR public.has_company_role(company_id, 'staff')
);

DROP POLICY IF EXISTS "membership_plans_update_admin_staff"
ON public.membership_plans;

CREATE POLICY "membership_plans_update_admin_staff"
ON public.membership_plans
FOR UPDATE
USING (
  public.is_company_owner(company_id)
  OR public.has_company_role(company_id, 'admin')
  OR public.has_company_role(company_id, 'staff')
)
WITH CHECK (
  public.is_company_owner(company_id)
  OR public.has_company_role(company_id, 'admin')
  OR public.has_company_role(company_id, 'staff')
);

DROP POLICY IF EXISTS "member_memberships_select_access"
ON public.member_memberships;

CREATE POLICY "member_memberships_select_access"
ON public.member_memberships
FOR SELECT
USING (
  public.can_access_member(member_id)
);

DROP POLICY IF EXISTS "member_memberships_insert_staff_admin"
ON public.member_memberships;

CREATE POLICY "member_memberships_insert_staff_admin"
ON public.member_memberships
FOR INSERT
WITH CHECK (
  (
    public.has_company_role(company_id, 'admin')
    OR public.is_company_owner(company_id)
    OR public.has_company_role(company_id, 'staff')
  )
  AND created_by = auth.uid()
);

-- member memberships update policy TODO

-- =========================================================
-- GRANTS
-- =========================================================

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.membership_plans
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.member_memberships
TO authenticated;