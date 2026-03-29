--===============================

--TABLES
--===============================

DROP TABLE IF EXISTS public.member_dynamic_field_values CASCADE;
DROP TABLE IF EXISTS public.coach_schema_validation_rule_overrides CASCADE;
DROP TABLE IF EXISTS public.client_data_schema_validation_rules CASCADE;
DROP TABLE IF EXISTS public.coach_schema_field_overrides CASCADE;
DROP TABLE IF EXISTS public.coach_schema_group_overrides CASCADE;
DROP TABLE IF EXISTS public.client_data_schema_fields CASCADE;
DROP TABLE IF EXISTS public.client_data_schema_groups CASCADE;

CREATE TABLE IF NOT EXISTS public.client_data_schema_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  accent_color text,
  icon_key text,
  unit_hint text,
  sort_order int NOT NULL DEFAULT 0,
  archived boolean NOT NULL DEFAULT false,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP INDEX IF EXISTS idx_schema_groups_company;
CREATE INDEX IF NOT EXISTS idx_schema_groups_company
  ON public.client_data_schema_groups(company_id);

DROP INDEX IF EXISTS idx_schema_groups_company_sort;
CREATE INDEX IF NOT EXISTS idx_schema_groups_company_sort
  ON public.client_data_schema_groups(company_id, sort_order);

DROP INDEX IF EXISTS idx_schema_groups_company_archived;
CREATE INDEX IF NOT EXISTS idx_schema_groups_company_archived
  ON public.client_data_schema_groups(company_id, archived);

CREATE TABLE IF NOT EXISTS public.client_data_schema_fields (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  group_id uuid NOT NULL REFERENCES public.client_data_schema_groups(id) ON DELETE CASCADE,
  label text NOT NULL,
  key text NOT NULL,
  type text NOT NULL,
  unit text,
  placeholder text,
  description text,
  required boolean NOT NULL DEFAULT false,
  read_only boolean NOT NULL DEFAULT false,
  show_portal boolean NOT NULL DEFAULT false,
  archived boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  options jsonb NOT NULL DEFAULT '[]'::jsonb,
  validation jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_schema_field_key_per_company UNIQUE (company_id, key)
);

DROP INDEX IF EXISTS idx_schema_fields_company;
CREATE INDEX IF NOT EXISTS idx_schema_fields_company
  ON public.client_data_schema_fields(company_id);

DROP INDEX IF EXISTS idx_schema_fields_group;
CREATE INDEX IF NOT EXISTS idx_schema_fields_group
  ON public.client_data_schema_fields(group_id);

DROP INDEX IF EXISTS idx_schema_fields_group_sort;
CREATE INDEX IF NOT EXISTS idx_schema_fields_group_sort
  ON public.client_data_schema_fields(group_id, sort_order);

DROP INDEX IF EXISTS idx_schema_fields_company_archived;
CREATE INDEX IF NOT EXISTS idx_schema_fields_company_archived
  ON public.client_data_schema_fields(company_id, archived);

DROP INDEX IF EXISTS idx_schema_fields_company_key;
CREATE INDEX IF NOT EXISTS idx_schema_fields_company_key
  ON public.client_data_schema_fields(company_id, key);

CREATE TABLE IF NOT EXISTS public.coach_schema_group_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL
    REFERENCES public.companies(id) ON DELETE CASCADE,
  coach_user_id uuid NOT NULL
    REFERENCES auth.users(id) ON DELETE CASCADE,
  group_id uuid NOT NULL
    REFERENCES public.client_data_schema_groups(id) ON DELETE CASCADE,
  name text,
  description text,
  accent_color text,
  icon_key text,
  unit_hint text,
  sort_order int,
  archived boolean,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_coach_group_override UNIQUE (coach_user_id, group_id)
);

DROP INDEX IF EXISTS idx_coach_group_overrides_company_coach;
CREATE INDEX IF NOT EXISTS idx_coach_group_overrides_company_coach
  ON public.coach_schema_group_overrides(company_id, coach_user_id);

DROP INDEX IF EXISTS idx_coach_group_overrides_group;
CREATE INDEX IF NOT EXISTS idx_coach_group_overrides_group
  ON public.coach_schema_group_overrides(group_id);

CREATE TABLE IF NOT EXISTS public.coach_schema_field_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL
    REFERENCES public.companies(id) ON DELETE CASCADE,
  coach_user_id uuid NOT NULL
    REFERENCES auth.users(id) ON DELETE CASCADE,
  field_id uuid NOT NULL
    REFERENCES public.client_data_schema_fields(id) ON DELETE CASCADE,
  group_override_id uuid
    REFERENCES public.coach_schema_group_overrides(id) ON DELETE SET NULL,
  label text,
  unit text,
  placeholder text,
  description text,
  required boolean,
  read_only boolean,
  show_portal boolean,
  archived boolean,
  sort_order int,
  options jsonb,
  validation jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_coach_field_override UNIQUE (coach_user_id, field_id)
);

DROP INDEX IF EXISTS idx_coach_field_overrides_company_coach;
CREATE INDEX IF NOT EXISTS idx_coach_field_overrides_company_coach
  ON public.coach_schema_field_overrides(company_id, coach_user_id);

DROP INDEX IF EXISTS idx_coach_field_overrides_field;
CREATE INDEX IF NOT EXISTS idx_coach_field_overrides_field
  ON public.coach_schema_field_overrides(field_id);

CREATE TABLE IF NOT EXISTS public.client_data_schema_validation_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  value text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  archived boolean NOT NULL DEFAULT false,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT client_data_schema_validation_rules_title_not_blank
    CHECK (btrim(title) <> ''),
  CONSTRAINT client_data_schema_validation_rules_value_not_blank
    CHECK (btrim(value) <> '')
);

DROP INDEX IF EXISTS idx_schema_validation_rules_company;
CREATE INDEX IF NOT EXISTS idx_schema_validation_rules_company
  ON public.client_data_schema_validation_rules(company_id);

DROP INDEX IF EXISTS idx_schema_validation_rules_company_sort;
CREATE INDEX IF NOT EXISTS idx_schema_validation_rules_company_sort
  ON public.client_data_schema_validation_rules(company_id, sort_order);

DROP INDEX IF EXISTS idx_schema_validation_rules_company_archived;
CREATE INDEX IF NOT EXISTS idx_schema_validation_rules_company_archived
  ON public.client_data_schema_validation_rules(company_id, archived);

CREATE TABLE IF NOT EXISTS public.coach_schema_validation_rule_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  company_id uuid NOT NULL
    REFERENCES public.companies(id) ON DELETE CASCADE,

  coach_user_id uuid NOT NULL
    REFERENCES auth.users(id) ON DELETE CASCADE,

  validation_rule_id uuid NOT NULL
    REFERENCES public.client_data_schema_validation_rules(id) ON DELETE CASCADE,

  title text,
  description text,
  value text,
  sort_order int,
  archived boolean,

  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT uq_coach_validation_rule_override
    UNIQUE (coach_user_id, validation_rule_id)
);

DROP INDEX IF EXISTS idx_coach_validation_rule_overrides_company_coach;
CREATE INDEX IF NOT EXISTS idx_coach_validation_rule_overrides_company_coach
  ON public.coach_schema_validation_rule_overrides(company_id, coach_user_id);

DROP INDEX IF EXISTS idx_coach_validation_rule_overrides_rule;
CREATE INDEX IF NOT EXISTS idx_coach_validation_rule_overrides_rule
  ON public.coach_schema_validation_rule_overrides(validation_rule_id);

CREATE TABLE IF NOT EXISTS public.member_dynamic_field_values (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  member_id uuid NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  field_id uuid NOT NULL REFERENCES public.client_data_schema_fields(id) ON DELETE CASCADE,
  value jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_member_field_value UNIQUE (member_id, field_id)
);

DROP INDEX IF EXISTS idx_member_dynamic_values_company;
CREATE INDEX IF NOT EXISTS idx_member_dynamic_values_company
  ON public.member_dynamic_field_values(company_id);

DROP INDEX IF EXISTS idx_member_dynamic_values_member;
CREATE INDEX IF NOT EXISTS idx_member_dynamic_values_member
  ON public.member_dynamic_field_values(member_id);

DROP INDEX IF EXISTS idx_member_dynamic_values_field;
CREATE INDEX IF NOT EXISTS idx_member_dynamic_values_field
  ON public.member_dynamic_field_values(field_id);

DROP INDEX IF EXISTS idx_member_dynamic_values_member_field;
CREATE INDEX IF NOT EXISTS idx_member_dynamic_values_member_field
  ON public.member_dynamic_field_values(member_id, field_id);


--===============================

--POLICIES
--===============================

ALTER TABLE public.client_data_schema_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_data_schema_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_schema_group_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_schema_field_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_data_schema_validation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_schema_validation_rule_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_dynamic_field_values ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "schema_validation_rules_select" ON public.client_data_schema_validation_rules;
CREATE POLICY "schema_validation_rules_select"
ON public.client_data_schema_validation_rules
FOR SELECT
TO authenticated
USING (public.is_company_member(company_id));

DROP POLICY IF EXISTS "schema_validation_rules_insert" ON public.client_data_schema_validation_rules;
CREATE POLICY "schema_validation_rules_insert"
ON public.client_data_schema_validation_rules
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

DROP POLICY IF EXISTS "schema_validation_rules_update" ON public.client_data_schema_validation_rules;
CREATE POLICY "schema_validation_rules_update"
ON public.client_data_schema_validation_rules
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

DROP POLICY IF EXISTS "schema_validation_rules_delete" ON public.client_data_schema_validation_rules;
CREATE POLICY "schema_validation_rules_delete"
ON public.client_data_schema_validation_rules
FOR DELETE
TO authenticated
USING (
  public.is_company_member(company_id)
  AND (
    public.is_company_owner(company_id)
    OR public.has_company_role(company_id, 'admin')
  )
);

DROP POLICY IF EXISTS "coach_validation_rule_overrides_select" ON public.coach_schema_validation_rule_overrides;
CREATE POLICY "coach_validation_rule_overrides_select"
ON public.coach_schema_validation_rule_overrides
FOR SELECT
TO authenticated
USING (
  public.is_company_member(company_id)
  AND (
    auth.uid() = coach_user_id
    OR public.is_company_owner(company_id)
    OR public.has_company_role(company_id, 'admin')
  )
);

DROP POLICY IF EXISTS "coach_validation_rule_overrides_insert" ON public.coach_schema_validation_rule_overrides;
CREATE POLICY "coach_validation_rule_overrides_insert"
ON public.coach_schema_validation_rule_overrides
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_company_member(company_id)
  AND (
    auth.uid() = coach_user_id
  )
);

DROP POLICY IF EXISTS "coach_validation_rule_overrides_update" ON public.coach_schema_validation_rule_overrides;
CREATE POLICY "coach_validation_rule_overrides_update"
ON public.coach_schema_validation_rule_overrides
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

DROP POLICY IF EXISTS "coach_validation_rule_overrides_delete" ON public.coach_schema_validation_rule_overrides;
CREATE POLICY "coach_validation_rule_overrides_delete"
ON public.coach_schema_validation_rule_overrides
FOR DELETE
TO authenticated
USING (
  public.is_company_member(company_id)
  AND (
    auth.uid() = coach_user_id
  )
);

DROP POLICY IF EXISTS "schema_groups_select"
ON public.client_data_schema_groups;
CREATE POLICY "schema_groups_select"
ON public.client_data_schema_groups
FOR SELECT
TO authenticated
USING (
  public.is_company_owner(company_id)
  OR public.has_company_role(company_id, 'admin')
  OR public.has_company_role(company_id, 'coach')
  OR public.has_company_role(company_id, 'staff')
);

DROP POLICY IF EXISTS "schema_groups_insert"
ON public.client_data_schema_groups;
CREATE POLICY "schema_groups_insert"
ON public.client_data_schema_groups
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_company_owner(company_id)
  OR public.has_company_role(company_id, 'admin')
  OR public.has_company_role(company_id, 'staff')
);

DROP POLICY IF EXISTS "schema_groups_update"
ON public.client_data_schema_groups;
CREATE POLICY "schema_groups_update"
ON public.client_data_schema_groups
FOR UPDATE
TO authenticated
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

DROP POLICY IF EXISTS "schema_groups_delete" ON public.client_data_schema_groups;
CREATE POLICY "schema_groups_delete"
ON public.client_data_schema_groups
FOR DELETE
TO authenticated
USING (
  public.is_company_owner(company_id)
  OR public.has_company_role(company_id, 'admin')
);

DROP POLICY IF EXISTS "schema_fields_select"
ON public.client_data_schema_fields;
CREATE POLICY "schema_fields_select"
ON public.client_data_schema_fields
FOR SELECT
TO authenticated
USING (
  public.is_company_member(company_id)
);

DROP POLICY IF EXISTS "schema_fields_insert"
ON public.client_data_schema_fields;
CREATE POLICY "schema_fields_insert"
ON public.client_data_schema_fields
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_company_owner(company_id)
  OR public.has_company_role(company_id, 'admin')
  OR public.has_company_role(company_id, 'staff')
);

DROP POLICY IF EXISTS "schema_fields_update"
ON public.client_data_schema_fields;
CREATE POLICY "schema_fields_update"
ON public.client_data_schema_fields
FOR UPDATE
TO authenticated
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

DROP POLICY IF EXISTS "schema_fields_delete"
ON public.client_data_schema_fields;
CREATE POLICY "schema_fields_delete"
ON public.client_data_schema_fields
FOR DELETE
TO authenticated
USING (
  public.is_company_owner(company_id)
  OR public.has_company_role(company_id, 'admin')
);

DROP POLICY IF EXISTS "coach_group_overrides_select" ON public.coach_schema_group_overrides;
CREATE POLICY "coach_group_overrides_select"
ON public.coach_schema_group_overrides
FOR SELECT
TO authenticated
USING (
  public.is_company_member(company_id)
  AND (
    auth.uid() = coach_user_id
    OR public.is_company_owner(company_id)
    OR public.has_company_role(company_id, 'admin')
  )
);

DROP POLICY IF EXISTS "coach_group_overrides_insert" ON public.coach_schema_group_overrides;
CREATE POLICY "coach_group_overrides_insert"
ON public.coach_schema_group_overrides
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_company_member(company_id)
  AND (
    auth.uid() = coach_user_id
  )
);

DROP POLICY IF EXISTS "coach_group_overrides_update" ON public.coach_schema_group_overrides;
CREATE POLICY "coach_group_overrides_update"
ON public.coach_schema_group_overrides
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

DROP POLICY IF EXISTS "coach_group_overrides_delete" ON public.coach_schema_group_overrides;
CREATE POLICY "coach_group_overrides_delete"
ON public.coach_schema_group_overrides
FOR DELETE
TO authenticated
USING (
  public.is_company_member(company_id)
  AND (
    auth.uid() = coach_user_id
  )
);

DROP POLICY IF EXISTS "coach_field_overrides_select" ON public.coach_schema_field_overrides;
CREATE POLICY "coach_field_overrides_select"
ON public.coach_schema_field_overrides
FOR SELECT
TO authenticated
USING (
  public.is_company_member(company_id)
  AND (
    auth.uid() = coach_user_id
    OR public.is_company_owner(company_id)
    OR public.has_company_role(company_id, 'admin')
  )
);

DROP POLICY IF EXISTS "coach_field_overrides_insert" ON public.coach_schema_field_overrides;
CREATE POLICY "coach_field_overrides_insert"
ON public.coach_schema_field_overrides
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_company_member(company_id)
  AND (
    auth.uid() = coach_user_id
  )
);

DROP POLICY IF EXISTS "coach_field_overrides_update" ON public.coach_schema_field_overrides;
CREATE POLICY "coach_field_overrides_update"
ON public.coach_schema_field_overrides
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

DROP POLICY IF EXISTS "coach_field_overrides_delete" ON public.coach_schema_field_overrides;
CREATE POLICY "coach_field_overrides_delete"
ON public.coach_schema_field_overrides
FOR DELETE
TO authenticated
USING (
  public.is_company_member(company_id)
  AND (
    auth.uid() = coach_user_id
  )
);

DROP POLICY IF EXISTS "member_dynamic_values_select"
ON public.member_dynamic_field_values;
CREATE POLICY "member_dynamic_values_select"
ON public.member_dynamic_field_values
FOR SELECT
TO authenticated
USING (
  public.is_company_member(company_id)
);

DROP POLICY IF EXISTS "member_dynamic_values_insert"
ON public.member_dynamic_field_values;
CREATE POLICY "member_dynamic_values_insert"
ON public.member_dynamic_field_values
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_company_owner(company_id)
  OR public.has_company_role(company_id, 'admin')
  OR public.has_company_role(company_id, 'coach')
);

DROP POLICY IF EXISTS "member_dynamic_values_update" ON public.member_dynamic_field_values;
CREATE POLICY "member_dynamic_values_update"
ON public.member_dynamic_field_values
FOR UPDATE
TO authenticated
USING (
  public.is_company_owner(company_id)
  OR public.has_company_role(company_id, 'admin')
  OR public.has_company_role(company_id, 'coach')
)
WITH CHECK (
  public.is_company_owner(company_id)
  OR public.has_company_role(company_id, 'admin')
  OR public.has_company_role(company_id, 'coach')
);

DROP POLICY IF EXISTS "member_dynamic_values_delete" ON public.member_dynamic_field_values;
CREATE POLICY "member_dynamic_values_delete"
ON public.member_dynamic_field_values
FOR DELETE
TO authenticated
USING (
  public.is_company_owner(company_id)
  OR public.has_company_role(company_id, 'admin')
  OR public.has_company_role(company_id, 'coach')
);

ALTER TABLE public.client_data_schema_groups
DROP CONSTRAINT IF EXISTS uq_schema_groups_id_company;
ALTER TABLE public.client_data_schema_groups
ADD CONSTRAINT uq_schema_groups_id_company UNIQUE (id, company_id);

ALTER TABLE public.client_data_schema_fields
DROP CONSTRAINT IF EXISTS fk_schema_fields_group_company;
ALTER TABLE public.client_data_schema_fields
ADD CONSTRAINT fk_schema_fields_group_company
FOREIGN KEY (group_id, company_id)
REFERENCES public.client_data_schema_groups(id, company_id)
ON DELETE CASCADE;

ALTER TABLE public.members
DROP CONSTRAINT IF EXISTS uq_members_id_company;
ALTER TABLE public.members
ADD CONSTRAINT uq_members_id_company UNIQUE (id, company_id);

ALTER TABLE public.client_data_schema_fields
DROP CONSTRAINT IF EXISTS uq_schema_fields_id_company;
ALTER TABLE public.client_data_schema_fields
ADD CONSTRAINT uq_schema_fields_id_company UNIQUE (id, company_id);

ALTER TABLE public.member_dynamic_field_values
DROP CONSTRAINT IF EXISTS fk_member_dynamic_values_member_company;
ALTER TABLE public.member_dynamic_field_values
ADD CONSTRAINT fk_member_dynamic_values_member_company
FOREIGN KEY (member_id, company_id)
REFERENCES public.members(id, company_id)
ON DELETE CASCADE;

ALTER TABLE public.member_dynamic_field_values
DROP CONSTRAINT IF EXISTS fk_member_dynamic_values_field_company;
ALTER TABLE public.member_dynamic_field_values
ADD CONSTRAINT fk_member_dynamic_values_field_company
FOREIGN KEY (field_id, company_id)
REFERENCES public.client_data_schema_fields(id, company_id)
ON DELETE CASCADE;

DROP TRIGGER IF EXISTS trg_schema_groups_updated_at
ON public.client_data_schema_groups;
CREATE TRIGGER trg_schema_groups_updated_at
BEFORE UPDATE ON public.client_data_schema_groups
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_schema_fields_updated_at
ON public.client_data_schema_fields;
CREATE TRIGGER trg_schema_fields_updated_at
BEFORE UPDATE ON public.client_data_schema_fields
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_client_data_schema_fields_updated_at ON public.client_data_schema_fields;

DROP TRIGGER IF EXISTS trg_schema_validation_rules_set_updated_at ON public.client_data_schema_validation_rules;
CREATE TRIGGER trg_schema_validation_rules_set_updated_at
BEFORE UPDATE ON public.client_data_schema_validation_rules
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_coach_schema_validation_rule_overrides_set_updated_at
  ON public.coach_schema_validation_rule_overrides;
CREATE TRIGGER trg_coach_schema_validation_rule_overrides_set_updated_at
BEFORE UPDATE ON public.coach_schema_validation_rule_overrides
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_member_dynamic_field_values_updated_at
  ON public.member_dynamic_field_values;
CREATE TRIGGER trg_member_dynamic_field_values_updated_at
BEFORE UPDATE ON public.member_dynamic_field_values
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_coach_schema_group_overrides_updated_at
  ON public.coach_schema_group_overrides;
CREATE TRIGGER trg_coach_schema_group_overrides_updated_at
BEFORE UPDATE ON public.coach_schema_group_overrides
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_coach_schema_field_overrides_updated_at
  ON public.coach_schema_field_overrides;
CREATE TRIGGER trg_coach_schema_field_overrides_updated_at
BEFORE UPDATE ON public.coach_schema_field_overrides
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_member_dynamic_values_updated_at on public.member_dynamic_field_values;

--VIEW
DROP VIEW IF EXISTS public.v_effective_schema_groups;
-- CREATE OR REPLACE VIEW public.v_effective_schema_groups AS
-- SELECT
--   g.id,
--   g.company_id,
--   cgo.coach_user_id,

--   COALESCE(cgo.name, g.name) AS name,
--   COALESCE(cgo.description, g.description) AS description,
--   COALESCE(cgo.accent_color, g.accent_color) AS accent_color,
--   COALESCE(cgo.icon_key, g.icon_key) AS icon_key,
--   COALESCE(cgo.unit_hint, g.unit_hint) AS unit_hint,
--   COALESCE(cgo.sort_order, g.sort_order) AS sort_order,
--   COALESCE(cgo.archived, g.archived) AS archived,

--   g.created_at,
--   GREATEST(g.updated_at, COALESCE(cgo.updated_at, g.updated_at)) AS updated_at,
--   g.id AS base_group_id,
--   cgo.id AS coach_group_override_id
-- FROM public.client_data_schema_groups g
-- LEFT JOIN public.coach_schema_group_overrides cgo
--   ON cgo.group_id = g.id;

DROP VIEW IF EXISTS public.v_effective_schema_fields;
-- CREATE OR REPLACE VIEW public.v_effective_schema_fields AS
-- SELECT
--   f.id,
--   f.company_id,
--   cfo.coach_user_id,

--   f.group_id AS base_group_id,
--   COALESCE(cgo.group_id, f.group_id) AS effective_group_id,

--   COALESCE(cfo.label, f.label) AS label,
--   f.key AS key,
--   f.type AS type,
--   COALESCE(cfo.unit, f.unit) AS unit,
--   COALESCE(cfo.placeholder, f.placeholder) AS placeholder,
--   COALESCE(cfo.description, f.description) AS description,
--   COALESCE(cfo.required, f.required) AS required,
--   COALESCE(cfo.read_only, f.read_only) AS read_only,
--   COALESCE(cfo.show_portal, f.show_portal) AS show_portal,
--   COALESCE(cfo.archived, f.archived) AS archived,
--   COALESCE(cfo.sort_order, f.sort_order) AS sort_order,
--   COALESCE(cfo.options, f.options) AS options,
--   COALESCE(cfo.validation, f.validation) AS validation,

--   f.created_at,
--   GREATEST(f.updated_at, COALESCE(cfo.updated_at, f.updated_at)) AS updated_at,
--   f.id AS base_field_id,
--   cfo.id AS coach_field_override_id
-- FROM public.client_data_schema_fields f
-- LEFT JOIN public.coach_schema_field_overrides cfo
--   ON cfo.field_id = f.id
-- LEFT JOIN public.coach_schema_group_overrides cgo
--   ON cgo.id = cfo.group_override_id;

DROP VIEW IF EXISTS public.v_effective_client_data_schema_validation_rules;
-- CREATE OR REPLACE VIEW public.v_effective_client_data_schema_validation_rules AS
-- SELECT
--   r.id,
--   r.company_id,
--   cro.coach_user_id,
--   COALESCE(cro.title, r.title) AS title,
--   COALESCE(cro.description, r.description) AS description,
--   COALESCE(cro.value, r.value) AS value,
--   COALESCE(cro.sort_order, r.sort_order) AS sort_order,
--   COALESCE(cro.archived, r.archived) AS archived,
--   r.created_at,
--   GREATEST(r.updated_at, COALESCE(cro.updated_at, r.updated_at)) AS updated_at,
--   r.id AS base_validation_rule_id,
--   cro.id AS coach_validation_rule_override_id
-- FROM public.client_data_schema_validation_rules r
-- LEFT JOIN public.coach_schema_validation_rule_overrides cro
--   ON cro.validation_rule_id = r.id;


-- VIEW: effective client validation rules with coach overrides
-- =========================================================
DROP VIEW IF EXISTS public.v_effective_client_data_schema_validation_rules;
-- CREATE OR REPLACE VIEW public.v_effective_client_data_schema_validation_rules AS
-- SELECT
--   vr.id,
--   vr.company_id,
--   cvr.coach_user_id,
--   COALESCE(cvr.title, vr.title) AS title,
--   COALESCE(cvr.description, vr.description) AS description,
--   COALESCE(cvr.value, vr.value) AS value,
--   COALESCE(cvr.sort_order, vr.sort_order) AS sort_order,
--   COALESCE(cvr.archived, vr.archived) AS archived,
--   vr.created_at,
--   GREATEST(vr.updated_at, COALESCE(cvr.updated_at, vr.updated_at)) AS updated_at,
--   vr.id AS base_validation_rule_id,
--   cvr.id AS coach_validation_rule_override_id
-- FROM public.client_data_schema_validation_rules vr
-- LEFT JOIN public.coach_schema_validation_rule_overrides cvr
--   ON cvr.validation_rule_id = vr.id;

-- =========================================================
-- OVERVIEW FUNCTION
-- =========================================================
create or replace function public.get_company_schema_overview(p_company_id uuid)
returns jsonb
language sql
security definer
set search_path = public, auth
stable
as $$
  select jsonb_build_object(
    'id', concat('schema-', p_company_id::text),
    'ownerType', 'company',
    'ownerName', c.name,
    'schemaLabel', 'Company Performance Schema',
    'activeVersion', 'v1',
    'totalGroups', (
      select count(*)
      from public.client_data_schema_groups g
      where g.company_id = p_company_id
        and g.archived = false
    ),
    'totalFields', (
      select count(*)
      from public.client_data_schema_fields f
      where f.company_id = p_company_id
        and f.archived = false
    ),
    'totalFormulas', (
      select count(*)
      from public.formulas sf
      where sf.company_id = p_company_id
    ),
    'linkedClients', (
      select count(*)
      from public.members m
      where m.company_id = p_company_id
        and coalesce(m.deleted_at is null, true)
    ),
    'updatedAt', greatest(
      coalesce((select max(g.updated_at) from public.client_data_schema_groups g where g.company_id = p_company_id), to_timestamp(0)),
      coalesce((select max(f.updated_at) from public.client_data_schema_fields f where f.company_id = p_company_id), to_timestamp(0)),
      coalesce((select max(sf.updated_at) from public.formulas sf where sf.company_id = p_company_id), to_timestamp(0)),
      coalesce((select max(r.updated_at) from public.client_data_schema_validation_rules r where r.company_id = p_company_id), to_timestamp(0))
    ),
    'status', 'active'
  )
  from public.companies c
  where c.id = p_company_id;
$$;

alter function public.get_company_schema_overview(uuid) owner to postgres;
revoke all on function public.get_company_schema_overview(uuid) from public;
grant execute on function public.get_company_schema_overview(uuid) to authenticated;

create or replace function public.get_effective_schema_validation_rules(
  p_company_id uuid
)
returns table (
  id uuid,
  company_id uuid,
  base_validation_rule_id uuid,
  coach_validation_rule_override_id uuid,
  title text,
  description text,
  value text,
  sort_order int,
  archived boolean,
  created_at timestamptz,
  updated_at timestamptz
)
language sql
security definer
set search_path = public, auth
stable
as $$
  select
    r.id,
    r.company_id,
    r.id as base_validation_rule_id,
    cro.id as coach_validation_rule_override_id,
    coalesce(cro.title, r.title) as title,
    coalesce(cro.description, r.description) as description,
    coalesce(cro.value, r.value) as value,
    coalesce(cro.sort_order, r.sort_order) as sort_order,
    coalesce(cro.archived, r.archived) as archived,
    r.created_at,
    greatest(r.updated_at, coalesce(cro.updated_at, r.updated_at)) as updated_at
  from public.client_data_schema_validation_rules r
  left join public.coach_schema_validation_rule_overrides cro
    on cro.validation_rule_id = r.id
   and cro.company_id = r.company_id
   and cro.coach_user_id = auth.uid()
  where r.company_id = p_company_id
    and public.is_company_member(p_company_id)
  order by coalesce(cro.sort_order, r.sort_order), r.created_at;
$$;

alter function public.get_effective_schema_validation_rules(uuid) owner to postgres;
revoke all on function public.get_effective_schema_validation_rules(uuid) from public;
grant execute on function public.get_effective_schema_validation_rules(uuid) to authenticated;

create or replace function public.get_effective_schema_groups(
  p_company_id uuid
)
returns table (
  id uuid,
  company_id uuid,
  base_group_id uuid,
  coach_group_override_id uuid,
  name text,
  description text,
  accent_color text,
  icon_key text,
  unit_hint text,
  sort_order int,
  archived boolean,
  created_at timestamptz,
  updated_at timestamptz
)
language sql
security definer
set search_path = public, auth
stable
as $$
  select
    g.id,
    g.company_id,
    g.id as base_group_id,
    cgo.id as coach_group_override_id,
    coalesce(cgo.name, g.name) as name,
    coalesce(cgo.description, g.description) as description,
    coalesce(cgo.accent_color, g.accent_color) as accent_color,
    coalesce(cgo.icon_key, g.icon_key) as icon_key,
    coalesce(cgo.unit_hint, g.unit_hint) as unit_hint,
    coalesce(cgo.sort_order, g.sort_order) as sort_order,
    coalesce(cgo.archived, g.archived) as archived,
    g.created_at,
    greatest(g.updated_at, coalesce(cgo.updated_at, g.updated_at)) as updated_at
  from public.client_data_schema_groups g
  left join public.coach_schema_group_overrides cgo
    on cgo.group_id = g.id
   and cgo.company_id = g.company_id
   and cgo.coach_user_id = auth.uid()
  where g.company_id = p_company_id
    and public.is_company_member(p_company_id)
  order by coalesce(cgo.sort_order, g.sort_order), g.created_at;
$$;

alter function public.get_effective_schema_groups(uuid) owner to postgres;
revoke all on function public.get_effective_schema_groups(uuid) from public;
grant execute on function public.get_effective_schema_groups(uuid) to authenticated;

create or replace function public.get_effective_schema_fields(
  p_company_id uuid
)
returns table (
  id uuid,
  company_id uuid,
  base_field_id uuid,
  coach_field_override_id uuid,
  group_id uuid,
  label text,
  key text,
  type text,
  unit text,
  placeholder text,
  description text,
  required boolean,
  read_only boolean,
  show_portal boolean,
  archived boolean,
  sort_order int,
  options jsonb,
  validation jsonb,
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
    f.id as base_field_id,
    cfo.id as coach_field_override_id,
    f.group_id,
    coalesce(cfo.label, f.label) as label,
    f.key,
    f.type,
    coalesce(cfo.unit, f.unit) as unit,
    coalesce(cfo.placeholder, f.placeholder) as placeholder,
    coalesce(cfo.description, f.description) as description,
    coalesce(cfo.required, f.required) as required,
    coalesce(cfo.read_only, f.read_only) as read_only,
    coalesce(cfo.show_portal, f.show_portal) as show_portal,
    coalesce(cfo.archived, f.archived) as archived,
    coalesce(cfo.sort_order, f.sort_order) as sort_order,
    coalesce(cfo.options, f.options) as options,
    coalesce(cfo.validation, f.validation) as validation,
    f.created_at,
    greatest(f.updated_at, coalesce(cfo.updated_at, f.updated_at)) as updated_at
  from public.client_data_schema_fields f
  left join public.coach_schema_field_overrides cfo
    on cfo.field_id = f.id
   and cfo.company_id = f.company_id
   and cfo.coach_user_id = auth.uid()
  where f.company_id = p_company_id
    and public.is_company_member(p_company_id)
  order by f.group_id, coalesce(cfo.sort_order, f.sort_order), f.created_at;
$$;

alter function public.get_effective_schema_fields(uuid) owner to postgres;
revoke all on function public.get_effective_schema_fields(uuid) from public;
grant execute on function public.get_effective_schema_fields(uuid) to authenticated;

create or replace function public.get_effective_schema_field_groups(
  p_company_id uuid
)
returns jsonb
language sql
security definer
set search_path = public, auth
stable
as $$
  with effective_groups as (
    select *
    from public.get_effective_schema_groups(p_company_id)
    where archived = false
  ),
  effective_fields as (
    select *
    from public.get_effective_schema_fields(p_company_id)
    where archived = false
  )
  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', g.id,
        'name', g.name,
        'description', g.description,
        'accentColor', g.accent_color,
        'iconKey', g.icon_key,
        'unitHint', g.unit_hint,
        'sortOrder', g.sort_order,
        'archived', g.archived,
        'fields',
          coalesce((
            select jsonb_agg(
              jsonb_build_object(
                'id', f.id,
                'groupId', f.group_id,
                'label', f.label,
                'key', f.key,
                'type', f.type,
                'unit', f.unit,
                'placeholder', f.placeholder,
                'description', f.description,
                'required', f.required,
                'readOnly', f.read_only,
                'showPortal', f.show_portal,
                'archived', f.archived,
                'sortOrder', f.sort_order,
                'options', f.options,
                'validation', f.validation
              )
              order by f.sort_order, f.created_at
            )
            from effective_fields f
            where f.group_id = g.id
          ), '[]'::jsonb)
      )
      order by g.sort_order, g.created_at
    ),
    '[]'::jsonb
  )
  from effective_groups g;
$$;

alter function public.get_effective_schema_field_groups(uuid) owner to postgres;
revoke all on function public.get_effective_schema_field_groups(uuid) from public;
grant execute on function public.get_effective_schema_field_groups(uuid) to authenticated;

create or replace function public.try_parse_uuid(p_value text)
returns uuid
language plpgsql
immutable
as $$
begin
  if p_value is null or btrim(p_value) = '' then
    return null;
  end if;

  if p_value ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' then
    return p_value::uuid;
  end if;

  return null;
end;
$$;

CREATE OR REPLACE FUNCTION public.save_company_schema_bundle(
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

  v_group jsonb;
  v_field jsonb;
  v_rule jsonb;

  v_group_id uuid;
  v_field_id uuid;
  v_rule_id uuid;

  v_input_group_id uuid;
  v_input_field_id uuid;
  v_input_rule_id uuid;

  v_group_count int := 0;
  v_field_count int := 0;
  v_rule_count int := 0;
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
  -- GROUPS + FIELDS
  -- =====================================================
  IF jsonb_typeof(p_payload->'groups') = 'array' THEN
    FOR v_group IN
      SELECT value FROM jsonb_array_elements(p_payload->'groups')
    LOOP
      v_input_group_id := public.try_parse_uuid(v_group->>'id');

      IF v_input_group_id IS NOT NULL THEN
        UPDATE public.client_data_schema_groups
        SET
          name = trim(v_group->>'name'),
          description = nullif(trim(coalesce(v_group->>'description', '')), ''),
          accent_color = nullif(trim(coalesce(v_group->>'accent_color', '')), ''),
          icon_key = nullif(trim(coalesce(v_group->>'icon_key', '')), ''),
          unit_hint = nullif(trim(coalesce(v_group->>'unit_hint', '')), ''),
          sort_order = coalesce((v_group->>'sort_order')::int, 0),
          archived = coalesce((v_group->>'archived')::boolean, false),
          updated_by = v_user_id
        WHERE id = v_input_group_id
          AND company_id = v_company_id
        RETURNING id INTO v_group_id;

        IF v_group_id IS NULL THEN
          RAISE EXCEPTION 'Group % was not found for this company', v_input_group_id;
        END IF;
      ELSE
        INSERT INTO public.client_data_schema_groups (
          company_id,
          name,
          description,
          accent_color,
          icon_key,
          unit_hint,
          sort_order,
          archived,
          created_by,
          updated_by
        )
        VALUES (
          v_company_id,
          trim(v_group->>'name'),
          nullif(trim(coalesce(v_group->>'description', '')), ''),
          nullif(trim(coalesce(v_group->>'accent_color', '')), ''),
          nullif(trim(coalesce(v_group->>'icon_key', '')), ''),
          nullif(trim(coalesce(v_group->>'unit_hint', '')), ''),
          coalesce((v_group->>'sort_order')::int, 0),
          coalesce((v_group->>'archived')::boolean, false),
          v_user_id,
          v_user_id
        )
        RETURNING id INTO v_group_id;
      END IF;

      v_group_count := v_group_count + 1;

      IF jsonb_typeof(v_group->'fields') = 'array' THEN
        FOR v_field IN
          SELECT value FROM jsonb_array_elements(v_group->'fields')
        LOOP
          v_input_field_id := public.try_parse_uuid(v_field->>'id');

          IF v_input_field_id IS NOT NULL THEN
            UPDATE public.client_data_schema_fields
            SET
              company_id = v_company_id,
              group_id = v_group_id,
              label = trim(v_field->>'label'),
              key = trim(v_field->>'key'),
              type = trim(v_field->>'type'),
              unit = nullif(trim(coalesce(v_field->>'unit', '')), ''),
              placeholder = nullif(trim(coalesce(v_field->>'placeholder', '')), ''),
              description = nullif(trim(coalesce(v_field->>'description', '')), ''),
              required = coalesce((v_field->>'required')::boolean, false),
              read_only = coalesce((v_field->>'read_only')::boolean, false),
              show_portal = coalesce((v_field->>'show_portal')::boolean, false),
              archived = coalesce((v_field->>'archived')::boolean, false),
              sort_order = coalesce((v_field->>'sort_order')::int, 0),
              options = CASE
                WHEN jsonb_typeof(v_field->'options') = 'array' THEN v_field->'options'
                ELSE '[]'::jsonb
              END,
              validation = CASE
                WHEN jsonb_typeof(v_field->'validation') = 'object' THEN v_field->'validation'
                ELSE '{}'::jsonb
              END,
              updated_by = v_user_id
            WHERE id = v_input_field_id
              AND company_id = v_company_id
            RETURNING id INTO v_field_id;

            IF v_field_id IS NULL THEN
              RAISE EXCEPTION 'Field % was not found for this company', v_input_field_id;
            END IF;
          ELSE
            INSERT INTO public.client_data_schema_fields (
              company_id,
              group_id,
              label,
              key,
              type,
              unit,
              placeholder,
              description,
              required,
              read_only,
              show_portal,
              archived,
              sort_order,
              options,
              validation,
              created_by,
              updated_by
            )
            VALUES (
              v_company_id,
              v_group_id,
              trim(v_field->>'label'),
              trim(v_field->>'key'),
              trim(v_field->>'type'),
              nullif(trim(coalesce(v_field->>'unit', '')), ''),
              nullif(trim(coalesce(v_field->>'placeholder', '')), ''),
              nullif(trim(coalesce(v_field->>'description', '')), ''),
              coalesce((v_field->>'required')::boolean, false),
              coalesce((v_field->>'read_only')::boolean, false),
              coalesce((v_field->>'show_portal')::boolean, false),
              coalesce((v_field->>'archived')::boolean, false),
              coalesce((v_field->>'sort_order')::int, 0),
              CASE
                WHEN jsonb_typeof(v_field->'options') = 'array' THEN v_field->'options'
                ELSE '[]'::jsonb
              END,
              CASE
                WHEN jsonb_typeof(v_field->'validation') = 'object' THEN v_field->'validation'
                ELSE '{}'::jsonb
              END,
              v_user_id,
              v_user_id
            )
            RETURNING id INTO v_field_id;
          END IF;

          v_field_count := v_field_count + 1;
        END LOOP;
      END IF;
    END LOOP;
  END IF;

  -- =====================================================
  -- VALIDATION RULES
  -- =====================================================
  IF jsonb_typeof(p_payload->'validation_rules') = 'array' THEN
    FOR v_rule IN
      SELECT value FROM jsonb_array_elements(p_payload->'validation_rules')
    LOOP
      v_input_rule_id := public.try_parse_uuid(v_rule->>'id');

      IF v_input_rule_id IS NOT NULL THEN
        UPDATE public.client_data_schema_validation_rules
        SET
          title = trim(v_rule->>'title'),
          description = nullif(trim(coalesce(v_rule->>'description', '')), ''),
          value = trim(v_rule->>'value'),
          sort_order = coalesce((v_rule->>'sort_order')::int, 0),
          archived = coalesce((v_rule->>'archived')::boolean, false),
          updated_by = v_user_id
        WHERE id = v_input_rule_id
          AND company_id = v_company_id
        RETURNING id INTO v_rule_id;

        IF v_rule_id IS NULL THEN
          RAISE EXCEPTION 'Validation rule % was not found for this company', v_input_rule_id;
        END IF;
      ELSE
        INSERT INTO public.client_data_schema_validation_rules (
          company_id,
          title,
          description,
          value,
          sort_order,
          archived,
          created_by,
          updated_by
        )
        VALUES (
          v_company_id,
          trim(v_rule->>'title'),
          nullif(trim(coalesce(v_rule->>'description', '')), ''),
          trim(v_rule->>'value'),
          coalesce((v_rule->>'sort_order')::int, 0),
          coalesce((v_rule->>'archived')::boolean, false),
          v_user_id,
          v_user_id
        )
        RETURNING id INTO v_rule_id;
      END IF;

      v_rule_count := v_rule_count + 1;
    END LOOP;
  END IF;

  RETURN jsonb_build_object(
    'ok', true,
    'company_id', v_company_id,
    'groups_saved', v_group_count,
    'fields_saved', v_field_count,
    'validation_rules_saved', v_rule_count
  );
END;
$$;

ALTER FUNCTION public.save_company_schema_bundle(jsonb) OWNER TO postgres;
REVOKE ALL ON FUNCTION public.save_company_schema_bundle(jsonb) FROM public;
GRANT EXECUTE ON FUNCTION public.save_company_schema_bundle(jsonb) TO authenticated;


CREATE OR REPLACE FUNCTION public.save_coach_schema_override_bundle(
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

  v_group jsonb;
  v_field jsonb;
  v_rule jsonb;

  v_group_id uuid;
  v_field_id uuid;
  v_rule_id uuid;

  v_group_count int := 0;
  v_field_count int := 0;
  v_rule_count int := 0;
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

  -- GROUP OVERRIDES
  IF jsonb_typeof(p_payload->'groups') = 'array' THEN
    FOR v_group IN
      SELECT value FROM jsonb_array_elements(p_payload->'groups')
    LOOP
      v_group_id := public.try_parse_uuid(v_group->>'group_id');

      IF v_group_id IS NULL THEN
        RAISE EXCEPTION 'group_id is required for coach group override';
      END IF;

      INSERT INTO public.coach_schema_group_overrides (
        company_id,
        coach_user_id,
        group_id,
        name,
        description,
        accent_color,
        icon_key,
        unit_hint,
        sort_order,
        archived,
        created_by,
        updated_by
      )
      VALUES (
        v_company_id,
        v_user_id,
        v_group_id,
        nullif(trim(coalesce(v_group->>'name', '')), ''),
        nullif(trim(coalesce(v_group->>'description', '')), ''),
        nullif(trim(coalesce(v_group->>'accent_color', '')), ''),
        nullif(trim(coalesce(v_group->>'icon_key', '')), ''),
        nullif(trim(coalesce(v_group->>'unit_hint', '')), ''),
        CASE WHEN v_group ? 'sort_order' THEN (v_group->>'sort_order')::int ELSE null END,
        CASE WHEN v_group ? 'archived' THEN (v_group->>'archived')::boolean ELSE null END,
        v_user_id,
        v_user_id
      )
      ON CONFLICT (coach_user_id, group_id)
      DO UPDATE SET
        name = excluded.name,
        description = excluded.description,
        accent_color = excluded.accent_color,
        icon_key = excluded.icon_key,
        unit_hint = excluded.unit_hint,
        sort_order = excluded.sort_order,
        archived = excluded.archived,
        updated_by = v_user_id;

      v_group_count := v_group_count + 1;
    END LOOP;
  END IF;

  -- FIELD OVERRIDES
  IF jsonb_typeof(p_payload->'fields') = 'array' THEN
    FOR v_field IN
      SELECT value FROM jsonb_array_elements(p_payload->'fields')
    LOOP
      v_field_id := public.try_parse_uuid(v_field->>'field_id');

      IF v_field_id IS NULL THEN
        RAISE EXCEPTION 'field_id is required for coach field override';
      END IF;

      INSERT INTO public.coach_schema_field_overrides (
        company_id,
        coach_user_id,
        field_id,
        label,
        unit,
        placeholder,
        description,
        required,
        read_only,
        show_portal,
        archived,
        sort_order,
        options,
        validation,
        created_by,
        updated_by
      )
      VALUES (
        v_company_id,
        v_user_id,
        v_field_id,
        nullif(trim(coalesce(v_field->>'label', '')), ''),
        nullif(trim(coalesce(v_field->>'unit', '')), ''),
        nullif(trim(coalesce(v_field->>'placeholder', '')), ''),
        nullif(trim(coalesce(v_field->>'description', '')), ''),
        CASE WHEN v_field ? 'required' THEN (v_field->>'required')::boolean ELSE null END,
        CASE WHEN v_field ? 'read_only' THEN (v_field->>'read_only')::boolean ELSE null END,
        CASE WHEN v_field ? 'show_portal' THEN (v_field->>'show_portal')::boolean ELSE null END,
        CASE WHEN v_field ? 'archived' THEN (v_field->>'archived')::boolean ELSE null END,
        CASE WHEN v_field ? 'sort_order' THEN (v_field->>'sort_order')::int ELSE null END,
        CASE WHEN jsonb_typeof(v_field->'options') = 'array' THEN v_field->'options' ELSE null END,
        CASE WHEN jsonb_typeof(v_field->'validation') = 'object' THEN v_field->'validation' ELSE null END,
        v_user_id,
        v_user_id
      )
      ON CONFLICT (coach_user_id, field_id)
      DO UPDATE SET
        label = excluded.label,
        unit = excluded.unit,
        placeholder = excluded.placeholder,
        description = excluded.description,
        required = excluded.required,
        read_only = excluded.read_only,
        show_portal = excluded.show_portal,
        archived = excluded.archived,
        sort_order = excluded.sort_order,
        options = excluded.options,
        validation = excluded.validation,
        updated_by = v_user_id;

      v_field_count := v_field_count + 1;
    END LOOP;
  END IF;

  -- VALIDATION RULE OVERRIDES
  IF jsonb_typeof(p_payload->'validation_rules') = 'array' THEN
    FOR v_rule IN
      SELECT value FROM jsonb_array_elements(p_payload->'validation_rules')
    LOOP
      v_rule_id := public.try_parse_uuid(v_rule->>'validation_rule_id');

      IF v_rule_id IS NULL THEN
        RAISE EXCEPTION 'validation_rule_id is required for coach validation rule override';
      END IF;

      INSERT INTO public.coach_schema_validation_rule_overrides (
        company_id,
        coach_user_id,
        validation_rule_id,
        title,
        description,
        value,
        sort_order,
        archived,
        created_by,
        updated_by
      )
      VALUES (
        v_company_id,
        v_user_id,
        v_rule_id,
        nullif(trim(coalesce(v_rule->>'title', '')), ''),
        nullif(trim(coalesce(v_rule->>'description', '')), ''),
        nullif(trim(coalesce(v_rule->>'value', '')), ''),
        CASE WHEN v_rule ? 'sort_order' THEN (v_rule->>'sort_order')::int ELSE null END,
        CASE WHEN v_rule ? 'archived' THEN (v_rule->>'archived')::boolean ELSE null END,
        v_user_id,
        v_user_id
      )
      ON CONFLICT (coach_user_id, validation_rule_id)
      DO UPDATE SET
        title = excluded.title,
        description = excluded.description,
        value = excluded.value,
        sort_order = excluded.sort_order,
        archived = excluded.archived,
        updated_by = v_user_id;

      v_rule_count := v_rule_count + 1;
    END LOOP;
  END IF;

  RETURN jsonb_build_object(
    'ok', true,
    'company_id', v_company_id,
    'groups_saved', v_group_count,
    'fields_saved', v_field_count,
    'validation_rules_saved', v_rule_count
  );
END;
$$;

ALTER FUNCTION public.save_coach_schema_override_bundle(jsonb) OWNER TO postgres;
REVOKE ALL ON FUNCTION public.save_coach_schema_override_bundle(jsonb) FROM public;
GRANT EXECUTE ON FUNCTION public.save_coach_schema_override_bundle(jsonb) TO authenticated;

-- NEED to drop
drop function public.save_company_schema_tree(
  p_payload jsonb
);

-- =========================================================
-- GRANTS
-- =========================================================
GRANT SELECT, INSERT, UPDATE, DELETE
ON public.client_data_schema_groups
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.client_data_schema_fields
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.coach_schema_group_overrides
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.coach_schema_field_overrides
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.member_dynamic_field_values
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.client_data_schema_validation_rules
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.coach_schema_validation_rule_overrides
TO authenticated;

-- GRANT SELECT ON public.v_effective_schema_groups TO authenticated;
-- GRANT SELECT ON public.v_effective_schema_fields TO authenticated;
-- GRANT SELECT
-- ON public.v_effective_client_data_schema_validation_rules
-- TO authenticated;