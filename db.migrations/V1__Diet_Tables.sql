-- =========================================================
-- TABLES
-- =========================================================

DROP TABLE IF EXISTS public.diet_plan_assignments CASCADE;
DROP TABLE IF EXISTS public.diet_meal_items CASCADE;
DROP TABLE IF EXISTS public.diet_plan_meals CASCADE;
DROP TABLE IF EXISTS public.diet_plans CASCADE;

CREATE TABLE IF NOT EXISTS public.diet_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  updated_by UUID REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.diet_plan_meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  diet_plan_id UUID NOT NULL REFERENCES public.diet_plans(id) ON DELETE CASCADE,
  day_index INT,
  meal_type TEXT NOT NULL
    CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  notes TEXT,
  order_index INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.diet_meal_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_id UUID NOT NULL REFERENCES public.diet_plan_meals(id) ON DELETE CASCADE,
  food_name TEXT NOT NULL,
  quantity TEXT NOT NULL,
  notes TEXT,
  order_index INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.diet_plan_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  diet_plan_id UUID NOT NULL REFERENCES public.diet_plans(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  assigned_by UUID NOT NULL REFERENCES public.profiles(id),
  start_date DATE,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'completed', 'cancelled')),
  -- pdf_doc_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================
-- INDEXES
-- =========================================================

DROP INDEX IF EXISTS idx_diet_plans_company_status;
CREATE INDEX IF NOT EXISTS idx_diet_plans_company_status
  ON public.diet_plans(company_id, status);

DROP INDEX IF EXISTS idx_diet_meals_plan;
CREATE INDEX IF NOT EXISTS idx_diet_meals_plan
  ON public.diet_plan_meals(diet_plan_id, order_index);

DROP INDEX IF EXISTS idx_diet_items_meal;
CREATE INDEX IF NOT EXISTS idx_diet_items_meal
  ON public.diet_meal_items(meal_id, order_index);

DROP INDEX IF EXISTS idx_diet_assignments_member;
CREATE INDEX IF NOT EXISTS idx_diet_assignments_member
  ON public.diet_plan_assignments(member_id, created_at DESC);

-- =========================================================
-- CONSTRAINTS
-- =========================================================

ALTER TABLE public.diet_plan_assignments
DROP CONSTRAINT IF EXISTS diet_plan_assignments_plan_member_unique;

ALTER TABLE public.diet_plan_assignments
ADD CONSTRAINT diet_plan_assignments_plan_member_unique
UNIQUE (diet_plan_id, member_id);

-- =========================================================
-- TRIGGERS
-- =========================================================

DROP TRIGGER IF EXISTS trg_diet_plans_updated_at
ON public.diet_plans;

CREATE TRIGGER trg_diet_plans_updated_at
BEFORE UPDATE ON public.diet_plans
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- ENABLE RLS
-- =========================================================

ALTER TABLE public.diet_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diet_plan_meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diet_meal_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diet_plan_assignments ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- POLICIES
-- =========================================================

DROP POLICY IF EXISTS "diet_assignments_select_access"
ON public.diet_plan_assignments;

CREATE POLICY "diet_assignments_select_access"
ON public.diet_plan_assignments
FOR SELECT
USING (
  public.can_access_member(member_id)
);

DROP POLICY IF EXISTS "diet_assignments_insert_access"
ON public.diet_plan_assignments;

CREATE POLICY "diet_assignments_insert_access"
ON public.diet_plan_assignments
FOR INSERT
WITH CHECK (
  public.can_access_member(member_id)
  AND assigned_by = auth.uid()
);

DROP POLICY IF EXISTS "diet_plans_select_company"
ON public.diet_plans;

CREATE POLICY "diet_plans_select_company"
ON public.diet_plans
FOR SELECT
USING (
  public.is_company_member(company_id)
);

DROP POLICY IF EXISTS "diet_plans_write_coach_staff_admin"
ON public.diet_plans;

CREATE POLICY "diet_plans_write_coach_staff_admin"
ON public.diet_plans
FOR INSERT
WITH CHECK (
  public.has_company_role(company_id, 'admin')
  OR public.has_company_role(company_id, 'staff')
  OR public.has_company_role(company_id, 'coach')
);

DROP POLICY IF EXISTS "diet_plans_update_coach_staff_admin"
ON public.diet_plans;

CREATE POLICY "diet_plans_update_coach_staff_admin"
ON public.diet_plans
FOR UPDATE
USING (
  public.has_company_role(company_id, 'admin')
  OR public.has_company_role(company_id, 'staff')
  OR public.has_company_role(company_id, 'coach')
)
WITH CHECK (
  public.has_company_role(company_id, 'admin')
  OR public.has_company_role(company_id, 'staff')
  OR public.has_company_role(company_id, 'coach')
);

DROP POLICY IF EXISTS "diet_plans_delete_coach_staff_admin"
ON public.diet_plans;

CREATE POLICY "diet_plans_delete_coach_staff_admin"
ON public.diet_plans
FOR DELETE
USING (
  public.has_company_role(company_id, 'admin')
  OR public.has_company_role(company_id, 'staff')
  OR public.has_company_role(company_id, 'coach')
);

-- =========================================================
-- diet_plan_meals POLICIES
-- =========================================================

DROP POLICY IF EXISTS "diet_plan_meals_select_company"
ON public.diet_plan_meals;

CREATE POLICY "diet_plan_meals_select_company"
ON public.diet_plan_meals
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.diet_plans dp
    WHERE dp.id = diet_plan_meals.diet_plan_id
      AND public.is_company_member(dp.company_id)
  )
);

DROP POLICY IF EXISTS "diet_plan_meals_insert_coach_staff_admin"
ON public.diet_plan_meals;

CREATE POLICY "diet_plan_meals_insert_coach_staff_admin"
ON public.diet_plan_meals
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.diet_plans dp
    WHERE dp.id = diet_plan_meals.diet_plan_id
      AND (
        public.has_company_role(dp.company_id, 'admin')
        OR public.has_company_role(dp.company_id, 'staff')
        OR public.has_company_role(dp.company_id, 'coach')
      )
  )
);

DROP POLICY IF EXISTS "diet_plan_meals_update_coach_staff_admin"
ON public.diet_plan_meals;

CREATE POLICY "diet_plan_meals_update_coach_staff_admin"
ON public.diet_plan_meals
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM public.diet_plans dp
    WHERE dp.id = diet_plan_meals.diet_plan_id
      AND (
        public.has_company_role(dp.company_id, 'admin')
        OR public.has_company_role(dp.company_id, 'staff')
        OR public.has_company_role(dp.company_id, 'coach')
      )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.diet_plans dp
    WHERE dp.id = diet_plan_meals.diet_plan_id
      AND (
        public.has_company_role(dp.company_id, 'admin')
        OR public.has_company_role(dp.company_id, 'staff')
        OR public.has_company_role(dp.company_id, 'coach')
      )
  )
);

DROP POLICY IF EXISTS "diet_plan_meals_delete_coach_staff_admin"
ON public.diet_plan_meals;

CREATE POLICY "diet_plan_meals_delete_coach_staff_admin"
ON public.diet_plan_meals
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM public.diet_plans dp
    WHERE dp.id = diet_plan_meals.diet_plan_id
      AND (
        public.has_company_role(dp.company_id, 'admin')
        OR public.has_company_role(dp.company_id, 'staff')
        OR public.has_company_role(dp.company_id, 'coach')
      )
  )
);

-- =========================================================
-- diet_meal_items POLICIES
-- =========================================================

DROP POLICY IF EXISTS "diet_meal_items_select_company"
ON public.diet_meal_items;

CREATE POLICY "diet_meal_items_select_company"
ON public.diet_meal_items
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.diet_plan_meals dpm
    JOIN public.diet_plans dp
      ON dp.id = dpm.diet_plan_id
    WHERE dpm.id = diet_meal_items.meal_id
      AND public.is_company_member(dp.company_id)
  )
);

DROP POLICY IF EXISTS "diet_meal_items_insert_coach_staff_admin"
ON public.diet_meal_items;

CREATE POLICY "diet_meal_items_insert_coach_staff_admin"
ON public.diet_meal_items
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.diet_plan_meals dpm
    JOIN public.diet_plans dp
      ON dp.id = dpm.diet_plan_id
    WHERE dpm.id = diet_meal_items.meal_id
      AND (
        public.has_company_role(dp.company_id, 'admin')
        OR public.has_company_role(dp.company_id, 'staff')
        OR public.has_company_role(dp.company_id, 'coach')
      )
  )
);

DROP POLICY IF EXISTS "diet_meal_items_update_coach_staff_admin"
ON public.diet_meal_items;

CREATE POLICY "diet_meal_items_update_coach_staff_admin"
ON public.diet_meal_items
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM public.diet_plan_meals dpm
    JOIN public.diet_plans dp
      ON dp.id = dpm.diet_plan_id
    WHERE dpm.id = diet_meal_items.meal_id
      AND (
        public.has_company_role(dp.company_id, 'admin')
        OR public.has_company_role(dp.company_id, 'staff')
        OR public.has_company_role(dp.company_id, 'coach')
      )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.diet_plan_meals dpm
    JOIN public.diet_plans dp
      ON dp.id = dpm.diet_plan_id
    WHERE dpm.id = diet_meal_items.meal_id
      AND (
        public.has_company_role(dp.company_id, 'admin')
        OR public.has_company_role(dp.company_id, 'staff')
        OR public.has_company_role(dp.company_id, 'coach')
      )
  )
);

DROP POLICY IF EXISTS "diet_meal_items_delete_coach_staff_admin"
ON public.diet_meal_items;

CREATE POLICY "diet_meal_items_delete_coach_staff_admin"
ON public.diet_meal_items
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM public.diet_plan_meals dpm
    JOIN public.diet_plans dp
      ON dp.id = dpm.diet_plan_id
    WHERE dpm.id = diet_meal_items.meal_id
      AND (
        public.has_company_role(dp.company_id, 'admin')
        OR public.has_company_role(dp.company_id, 'staff')
        OR public.has_company_role(dp.company_id, 'coach')
      )
  )
);

-- =========================================================
-- RPC
-- =========================================================

DROP FUNCTION IF EXISTS public.create_diet_plan_with_meals(JSONB);

CREATE OR REPLACE FUNCTION public.create_diet_plan_with_meals(
  p_payload JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_plan_id UUID;
  v_meal_id UUID;
  v_company_id UUID;
  v_user_id UUID;
  v_meal JSONB;
  v_item JSONB;
BEGIN
  v_user_id := auth.uid();
  v_company_id := (p_payload->>'company_id')::UUID;

  IF v_company_id IS NULL THEN
    RAISE EXCEPTION 'company_id is required';
  END IF;

  IF NOT (
    public.is_company_owner(v_company_id)
    OR public.has_company_role(v_company_id, 'admin')
    OR public.has_company_role(v_company_id, 'staff')
    OR public.has_company_role(v_company_id, 'coach')
  ) THEN
    RAISE EXCEPTION 'You do not have permission to create this diet plan';
  END IF;

  INSERT INTO public.diet_plans (
    company_id,
    created_by,
    updated_by,
    title,
    description,
    status
  )
  VALUES (
    v_company_id,
    v_user_id,
    v_user_id,
    p_payload->>'title',
    p_payload->>'description',
    p_payload->>'status'
  )
  RETURNING id INTO v_plan_id;

  FOR v_meal IN
    SELECT value
    FROM jsonb_array_elements(COALESCE(p_payload->'meals', '[]'::JSONB))
  LOOP
    INSERT INTO public.diet_plan_meals (
      diet_plan_id,
      day_index,
      meal_type,
      notes,
      order_index
    )
    VALUES (
      v_plan_id,
      NULLIF(v_meal->>'day_index', '')::INT,
      v_meal->>'meal_type',
      NULLIF(TRIM(v_meal->>'notes'), ''),
      COALESCE((v_meal->>'order_index')::INT, 0)
    )
    RETURNING id INTO v_meal_id;

    FOR v_item IN
      SELECT value
      FROM jsonb_array_elements(COALESCE(v_meal->'items', '[]'::JSONB))
    LOOP
      INSERT INTO public.diet_meal_items (
        meal_id,
        food_name,
        quantity,
        notes,
        order_index
      )
      VALUES (
        v_meal_id,
        TRIM(v_item->>'food_name'),
        TRIM(v_item->>'quantity'),
        NULLIF(TRIM(v_item->>'notes'), ''),
        COALESCE((v_item->>'order_index')::INT, 0)
      );
    END LOOP;
  END LOOP;

  RETURN v_plan_id;
END;
$$;

ALTER FUNCTION public.create_diet_plan_with_meals(JSONB) OWNER TO postgres;
REVOKE ALL ON FUNCTION public.create_diet_plan_with_meals(JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_diet_plan_with_meals(JSONB) TO authenticated;

DROP FUNCTION IF EXISTS public.update_diet_plan_with_meals(JSONB);

CREATE OR REPLACE FUNCTION public.update_diet_plan_with_meals(
  p_payload JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_plan_id UUID;
  v_existing_company_id UUID;
  v_meal_id UUID;
  v_user_id UUID;
  v_meal JSONB;
  v_item JSONB;
BEGIN
  v_user_id := auth.uid();
  v_plan_id := (p_payload->>'id')::UUID;

  IF v_plan_id IS NULL THEN
    RAISE EXCEPTION 'id is required';
  END IF;

  SELECT dp.company_id
  INTO v_existing_company_id
  FROM public.diet_plans dp
  WHERE dp.id = v_plan_id;

  IF v_existing_company_id IS NULL THEN
    RAISE EXCEPTION 'Diet plan not found';
  END IF;

  IF NOT (
    public.is_company_owner(v_existing_company_id)
    OR public.has_company_role(v_existing_company_id, 'admin')
    OR public.has_company_role(v_existing_company_id, 'staff')
    OR public.has_company_role(v_existing_company_id, 'coach')
  ) THEN
    RAISE EXCEPTION 'You do not have permission to update this diet plan';
  END IF;

  UPDATE public.diet_plans
  SET
    title = p_payload->>'title',
    description = p_payload->>'description',
    status = p_payload->>'status',
    updated_by = v_user_id
  WHERE id = v_plan_id;

  DELETE FROM public.diet_plan_meals
  WHERE diet_plan_id = v_plan_id;

  FOR v_meal IN
    SELECT value
    FROM jsonb_array_elements(COALESCE(p_payload->'meals', '[]'::JSONB))
  LOOP
    INSERT INTO public.diet_plan_meals (
      diet_plan_id,
      day_index,
      meal_type,
      notes,
      order_index
    )
    VALUES (
      v_plan_id,
      NULLIF(v_meal->>'day_index', '')::INT,
      v_meal->>'meal_type',
      NULLIF(TRIM(v_meal->>'notes'), ''),
      COALESCE((v_meal->>'order_index')::INT, 0)
    )
    RETURNING id INTO v_meal_id;

    FOR v_item IN
      SELECT value
      FROM jsonb_array_elements(COALESCE(v_meal->'items', '[]'::JSONB))
    LOOP
      INSERT INTO public.diet_meal_items (
        meal_id,
        food_name,
        quantity,
        notes,
        order_index
      )
      VALUES (
        v_meal_id,
        TRIM(v_item->>'food_name'),
        TRIM(v_item->>'quantity'),
        NULLIF(TRIM(v_item->>'notes'), ''),
        COALESCE((v_item->>'order_index')::INT, 0)
      );
    END LOOP;
  END LOOP;

  RETURN v_plan_id;
END;
$$;

ALTER FUNCTION public.update_diet_plan_with_meals(JSONB) OWNER TO postgres;
REVOKE ALL ON FUNCTION public.update_diet_plan_with_meals(JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.update_diet_plan_with_meals(JSONB) TO authenticated;

-- =========================================================
-- GRANTS
-- =========================================================

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.diet_plans
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.diet_plan_meals
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.diet_meal_items
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.diet_plan_assignments
TO authenticated;