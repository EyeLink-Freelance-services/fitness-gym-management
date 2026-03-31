-- =========================================================
-- TABLE
-- =========================================================

DROP TABLE IF EXISTS public.coach_formulas_overrides CASCADE;
DROP TABLE IF EXISTS public.formulas CASCADE;

CREATE TABLE IF NOT EXISTS public.formulas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  company_id uuid NOT NULL
    REFERENCES public.companies(id) ON DELETE CASCADE,

  label text NOT NULL,
  key text NOT NULL,
  expression text NOT NULL,

  unit text,
  decimals integer NOT NULL DEFAULT 2,
  description text,
  show_portal boolean NOT NULL DEFAULT true,

  created_by uuid
    REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by uuid
    REFERENCES auth.users(id) ON DELETE SET NULL,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT formulas_label_not_blank CHECK (btrim(label) <> ''),
  CONSTRAINT formulas_key_not_blank CHECK (btrim(key) <> ''),
  CONSTRAINT formulas_expression_not_blank CHECK (btrim(expression) <> ''),
  CONSTRAINT formulas_decimals_check CHECK (decimals >= 0 AND decimals <= 8)
);

-- UNIQUE FORMULA KEY INSIDE ONE COMPANY
DROP INDEX IF EXISTS uq_formulas_company_key;
CREATE UNIQUE INDEX IF NOT EXISTS uq_formulas_company_key
  ON public.formulas(company_id, lower(key));

-- OPTIONAL: PREVENT SAME LABEL TWICE IN SAME COMPANY
DROP INDEX IF EXISTS uq_formulas_company_label;
CREATE UNIQUE INDEX IF NOT EXISTS uq_formulas_company_label
  ON public.formulas(company_id, lower(label));

-- USEFUL INDEXES
DROP INDEX IF EXISTS idx_formulas_company_id;
CREATE INDEX IF NOT EXISTS idx_formulas_company_id
  ON public.formulas(company_id);

DROP INDEX IF EXISTS idx_formulas_created_by;
CREATE INDEX IF NOT EXISTS idx_formulas_created_by
  ON public.formulas(created_by);

DROP INDEX IF EXISTS idx_formulas_updated_at;
CREATE INDEX IF NOT EXISTS idx_formulas_updated_at
  ON public.formulas(updated_at DESC);

CREATE TABLE IF NOT EXISTS public.coach_formulas_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_formula_id uuid NOT NULL 
    REFERENCES public.formulas(id) ON DELETE CASCADE,
  company_id uuid NOT NULL
    REFERENCES public.companies(id) ON DELETE CASCADE,
  coach_user_id uuid NOT NULL 
    REFERENCES auth.users(id) ON DELETE CASCADE,
  label text NOT NULL,
  key text NOT NULL,
  expression text NOT NULL,
  unit text,
  decimals integer NOT NULL DEFAULT 2,
  description text,
  show_portal boolean NOT NULL DEFAULT true,
  created_by uuid
    REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by uuid
    REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT coach_formulas_overrides_label_not_blank CHECK (btrim(label) <> ''),
  CONSTRAINT coach_formulas_overrides_key_not_blank CHECK (btrim(key) <> ''),
  CONSTRAINT coach_formulas_overrides_expression_not_blank CHECK (btrim(expression) <> ''),
  CONSTRAINT coach_formulas_overrides_decimals_check CHECK (decimals >= 0 AND decimals <= 8)
);

DROP INDEX IF EXISTS uq_coach_formulas_overrides_unique;
CREATE UNIQUE INDEX IF NOT EXISTS uq_coach_formulas_overrides_unique
  ON public.coach_formulas_overrides(company_formula_id, coach_user_id);

DROP INDEX IF EXISTS idx_coach_formulas_overrides_company_coach;
CREATE INDEX IF NOT EXISTS idx_coach_formulas_overrides_company_coach
  ON public.coach_formulas_overrides(company_id, coach_user_id);

-- =========================================================
-- TRIGGER
-- =========================================================

DROP TRIGGER IF EXISTS trg_formulas_set_updated_at ON public.formulas;
CREATE TRIGGER trg_formulas_set_updated_at
BEFORE UPDATE ON public.formulas
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_coach_formulas_overrides_set_updated_at ON public.coach_formulas_overrides;
CREATE TRIGGER trg_coach_formulas_overrides_set_updated_at
BEFORE UPDATE ON public.coach_formulas_overrides
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();


-- =========================================================
-- POLICIES
-- =========================================================
ALTER TABLE public.formulas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_formulas_overrides ENABLE ROW LEVEL SECURITY;

-- SELECT: ADMIN, OWNER OR COACH CAN READ
DROP POLICY IF EXISTS "formulas_select_company_member" ON public.formulas;
CREATE POLICY "formulas_select_company_member"
ON public.formulas
FOR SELECT
TO authenticated
USING (
  public.is_company_owner(company_id)
  OR public.has_company_role(company_id, 'admin')
  OR public.has_company_role(company_id, 'coach')
);

-- INSERT: ADMIN/COACH/OWNER CAN CREATE
DROP POLICY IF EXISTS "formulas_insert_company_roles" ON public.formulas;
CREATE POLICY "formulas_insert_company_roles"
ON public.formulas
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_company_member(company_id)
  AND (
    public.is_company_owner(company_id)
    OR public.has_company_role(company_id, 'admin')
    OR public.has_company_role(company_id, 'coach')
  )
);

-- UPDATE: ADMIN/COACH/OWNER CAN UPDATE
DROP POLICY IF EXISTS "formulas_update_company_roles" ON public.formulas;
CREATE POLICY "formulas_update_company_roles"
ON public.formulas
FOR UPDATE
TO authenticated
USING (
  public.is_company_member(company_id)
  AND (
    public.is_company_owner(company_id)
    OR public.has_company_role(company_id, 'admin')
    OR public.has_company_role(company_id, 'coach')
  )
)
WITH CHECK (
  public.is_company_member(company_id)
  AND (
    public.is_company_owner(company_id)
    OR public.has_company_role(company_id, 'admin')
    OR public.has_company_role(company_id, 'coach')
  )
);

-- DELETE: USUALLY RESTRICT A BIT MORE
DROP POLICY IF EXISTS "formulas_delete_admin_owner" ON public.formulas;
CREATE POLICY "formulas_delete_admin_owner"
ON public.formulas
FOR DELETE
TO authenticated
USING (
  public.is_company_member(company_id)
  AND (
    public.is_company_owner(company_id)
    OR public.has_company_role(company_id, 'admin')
  )
);

-- SELECT: ADMIN, OWNER OR COACH CAN READ
DROP POLICY IF EXISTS "coach_formulas_overrides_select_company_member" ON public.coach_formulas_overrides;
CREATE POLICY "coach_formulas_overrides_select_company_member"
ON public.coach_formulas_overrides
FOR SELECT
TO authenticated
USING (
  public.is_company_owner(company_id)
  OR public.has_company_role(company_id, 'admin')
  OR auth.uid() = coach_user_id
);

-- INSERT: COACH CAN CREATE
DROP POLICY IF EXISTS "coach_formulas_overrides_insert_company_roles" ON public.coach_formulas_overrides;
CREATE POLICY "coach_formulas_overrides_insert_company_roles"
ON public.coach_formulas_overrides
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_company_member(company_id)
  AND (
    auth.uid() = coach_user_id
  )
);

-- UPDATE: COACH CAN UPDATE
DROP POLICY IF EXISTS "coach_formulas_overrides_update_company_roles" ON public.coach_formulas_overrides;
CREATE POLICY "coach_formulas_overrides_update_company_roles"
ON public.coach_formulas_overrides
FOR UPDATE
TO authenticated
USING (
  public.is_company_member(company_id)
  AND (
    auth.uid() = coach_user_id
  )
)
WITH CHECK (
  public.is_company_member(company_id)
  AND (
    auth.uid() = coach_user_id
  )
);

-- DELETE: USUALLY RESTRICT A BIT MORE
DROP POLICY IF EXISTS "coach_formulas_overrides_delete_company_roles" ON public.coach_formulas_overrides;
CREATE POLICY "coach_formulas_overrides_delete_company_roles"
ON public.coach_formulas_overrides
FOR DELETE
TO authenticated
USING (
  public.is_company_member(company_id)
  AND (
    auth.uid() = coach_user_id
  )
);

-- VIEW
DROP VIEW IF EXISTS public.v_effective_client_data_schema_formulas;
CREATE OR REPLACE VIEW public.v_effective_client_data_schema_formulas AS
SELECT
  f.id,
  f.company_id,
  cfo.coach_user_id,
  COALESCE(cfo.label, f.label) AS label,
  f.key,
  COALESCE(cfo.expression, f.expression) AS expression,
  COALESCE(cfo.unit, f.unit) AS unit,
  COALESCE(cfo.decimals, f.decimals) AS decimals,
  COALESCE(cfo.description, f.description) AS description,
  COALESCE(cfo.show_portal, f.show_portal) AS show_portal,
  f.created_at,
  GREATEST(f.updated_at, COALESCE(cfo.updated_at, f.updated_at)) AS updated_at,
  f.id AS base_formula_id,
  cfo.id AS coach_formula_override_id
FROM public.formulas f
LEFT JOIN public.coach_formulas_overrides cfo
  ON cfo.company_formula_id = f.id;

create or replace function public.get_effective_schema_formulas(
  p_company_id uuid
)
returns table (
  id uuid,
  company_id uuid,
  base_formula_id uuid,
  coach_formula_override_id uuid,
  label text,
  key text,
  expression text,
  unit text,
  decimals int,
  description text,
  show_portal boolean,
  created_at timestamptz,
  updated_at timestamptz
)
language sql
security definer
set search_path = public, auth
stable
as $$
  select
    f.id,
    f.company_id,
    f.id as base_formula_id,
    cfo.id as coach_formula_override_id,
    coalesce(cfo.label, f.label) as label,
    f.key,
    coalesce(cfo.expression, f.expression) as expression,
    coalesce(cfo.unit, f.unit) as unit,
    coalesce(cfo.decimals, f.decimals) as decimals,
    coalesce(cfo.description, f.description) as description,
    coalesce(cfo.show_portal, f.show_portal) as show_portal,
    f.created_at,
    greatest(f.updated_at, coalesce(cfo.updated_at, f.updated_at)) as updated_at
  from public.formulas f
  left join public.coach_formulas_overrides cfo
    on cfo.company_formula_id = f.id
   and cfo.company_id = f.company_id
   and cfo.coach_user_id = auth.uid()
  where f.company_id = p_company_id
    and public.is_company_member(p_company_id)
  order by f.created_at;
$$;

alter function public.get_effective_schema_formulas(uuid) owner to postgres;
revoke all on function public.get_effective_schema_formulas(uuid) from public;
grant execute on function public.get_effective_schema_formulas(uuid) to authenticated;


-- =========================================================
-- GRANTS
-- =========================================================

GRANT SELECT
ON public.v_effective_client_data_schema_formulas
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.formulas
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.coach_formulas_overrides
TO authenticated;

CREATE OR REPLACE FUNCTION public.save_company_formula_bundle(
  p_payload jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_company_id uuid;
  v_user_id uuid;
  v_formula jsonb;
  v_formula_id uuid;
  v_input_formula_id uuid;
  v_formula_count int := 0;
BEGIN
  v_user_id := auth.uid();
  v_company_id := public.try_parse_uuid(p_payload->>'company_id');

  IF v_company_id IS NULL THEN
    RAISE EXCEPTION 'company_id is required';
  END IF;

  IF NOT (
    public.is_company_owner(v_company_id)
    OR public.has_company_role(v_company_id, 'admin')
    OR public.has_company_role(v_company_id, 'staff')
  ) THEN
    RAISE EXCEPTION 'You do not have permission to save this schema';
  END IF;

  -- =====================================================
  -- FORMULA
  -- =====================================================
  IF jsonb_typeof(p_payload->'formula') = 'object' THEN
    v_formula := p_payload->'formula';
    v_input_formula_id := public.try_parse_uuid(v_formula->>'id');

    IF v_input_formula_id IS NOT NULL THEN
      UPDATE public.formulas
      SET
        label = trim(v_formula->>'label'),
        key = trim(v_formula->>'key'),
        expression = trim(v_formula->>'expression'),
        unit = nullif(trim(coalesce(v_formula->>'unit', '')), ''),
        decimals = coalesce((v_formula->>'decimals')::int, 2),
        description = nullif(trim(coalesce(v_formula->>'description', '')), ''),
        show_portal = coalesce((v_formula->>'show_portal')::boolean, true),
        updated_by = v_user_id
      WHERE id = v_input_formula_id
        AND company_id = v_company_id
      RETURNING id INTO v_formula_id;

      IF v_formula_id IS NULL THEN
        RAISE EXCEPTION 'Formula % was not found for this company', v_input_formula_id;
      END IF;
    ELSE
      INSERT INTO public.formulas (
        company_id,
        label,
        key,
        expression,
        unit,
        decimals,
        description,
        show_portal,
        created_by,
        updated_by
      )
      VALUES (
        v_company_id,
        trim(v_formula->>'label'),
        trim(v_formula->>'key'),
        trim(v_formula->>'expression'),
        nullif(trim(coalesce(v_formula->>'unit', '')), ''),
        coalesce((v_formula->>'decimals')::int, 2),
        nullif(trim(coalesce(v_formula->>'description', '')), ''),
        coalesce((v_formula->>'show_portal')::boolean, true),
        v_user_id,
        v_user_id
      )
      RETURNING id INTO v_formula_id;
    END IF;

    v_formula_count := 1;
  END IF;

  RETURN jsonb_build_object(
    'ok', true,
    'company_id', v_company_id,
    'formulas_saved', v_formula_count,
    'formula_id', v_formula_id
  );
END;
$$;

alter function public.save_company_formula_bundle(jsonb) owner to postgres;
revoke all on function public.save_company_formula_bundle(jsonb) from public;
grant execute on function public.save_company_formula_bundle(jsonb) to authenticated;

CREATE OR REPLACE FUNCTION public.save_coach_formula_override_bundle(
  p_payload jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_company_id uuid;
  v_user_id uuid;

  v_formula jsonb;

  v_formula_id uuid;

  v_formula_count int := 0;
BEGIN
  v_user_id := auth.uid();
  v_company_id := public.try_parse_uuid(p_payload->>'company_id');

  IF v_company_id IS NULL THEN
    RAISE EXCEPTION 'company_id is required';
  END IF;

  IF NOT (
    public.has_company_role(v_company_id, 'coach')
    OR public.has_company_role(v_company_id, 'admin')
    OR public.is_company_owner(v_company_id)
  ) THEN
    RAISE EXCEPTION 'You do not have permission to save coach schema overrides';
  END IF;

  -- FORMULA OVERRIDE (SINGLE OBJECT)
  IF jsonb_typeof(p_payload->'formula') = 'object' THEN
    v_formula := p_payload->'formula';
    v_formula_id := public.try_parse_uuid(v_formula->>'id');

    IF v_formula_id IS NULL THEN
      RAISE EXCEPTION 'id is required for coach formula override';
    END IF;

    INSERT INTO public.coach_formulas_overrides (
      company_id,
      coach_user_id,
      company_formula_id,
      label,
      key,
      expression,
      unit,
      decimals,
      description,
      show_portal,
      created_by,
      updated_by
    )
    VALUES (
      v_company_id,
      v_user_id,
      v_formula_id,
      nullif(trim(coalesce(v_formula->>'label', '')), ''),
      nullif(trim(coalesce(v_formula->>'key', '')), ''),
      nullif(trim(coalesce(v_formula->>'expression', '')), ''),
      nullif(trim(coalesce(v_formula->>'unit', '')), ''),
      COALESCE((v_formula->>'decimals')::int, 2),
      nullif(trim(coalesce(v_formula->>'description', '')), ''),
      COALESCE((v_formula->>'show_portal')::boolean, true),
      v_user_id,
      v_user_id
    )
    ON CONFLICT (company_formula_id, coach_user_id)
    DO UPDATE SET
      label = EXCLUDED.label,
      key = EXCLUDED.key,
      expression = EXCLUDED.expression,
      unit = EXCLUDED.unit,
      decimals = EXCLUDED.decimals,
      description = EXCLUDED.description,
      show_portal = EXCLUDED.show_portal,
      updated_by = v_user_id;

    v_formula_count := 1;
  END IF;

  RETURN jsonb_build_object(
    'ok', true,
    'company_id', v_company_id,
    'formula_saved', v_formula_count
  );
END;
$$;

alter function public.save_coach_formula_override_bundle(jsonb) owner to postgres;
revoke all on function public.save_coach_formula_override_bundle(jsonb) from public;
grant execute on function public.save_coach_formula_override_bundle(jsonb) to authenticated;