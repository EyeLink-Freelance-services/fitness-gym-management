-- =========================================================
-- TABLES
-- =========================================================

CREATE TABLE IF NOT EXISTS public.onboarding_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  invitation_type TEXT NOT NULL CHECK (invitation_type IN ('personal','company')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','expired','cancelled')),
  company_name VARCHAR(255),
  note TEXT,
  accepted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  accepted_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,
  terms_version TEXT,
  privacy_version TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_onboarding_invites_email
  ON public.onboarding_invites(email);

CREATE INDEX IF NOT EXISTS idx_onboarding_invites_status
  ON public.onboarding_invites(status);

CREATE INDEX IF NOT EXISTS idx_onboarding_invites_expires_at
  ON public.onboarding_invites(expires_at);

CREATE TABLE IF NOT EXISTS public.onboarding_invite_acceptance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invite_id UUID NOT NULL REFERENCES public.onboarding_invites(id) ON DELETE CASCADE,
  accepted_terms BOOLEAN NOT NULL DEFAULT FALSE,
  accepted_privacy BOOLEAN NOT NULL DEFAULT FALSE,
  terms_version TEXT NOT NULL,
  privacy_version TEXT NOT NULL,
  accepted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_onboarding_invite_acceptance_invite_id
  ON public.onboarding_invite_acceptance(invite_id);

-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================

ALTER TABLE public.onboarding_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_invite_acceptance ENABLE ROW LEVEL SECURITY;

-- Onboarding invites policies
DROP POLICY IF EXISTS "onboarding_invites_select_admin" ON public.onboarding_invites;
CREATE POLICY "onboarding_invites_select_admin"
ON public.onboarding_invites
FOR SELECT
TO authenticated
USING (public.is_super_admin());

DROP POLICY IF EXISTS "onboarding_invites_insert_admin" ON public.onboarding_invites;
CREATE POLICY "onboarding_invites_insert_admin"
ON public.onboarding_invites
FOR INSERT
TO authenticated
WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "onboarding_invites_update_admin" ON public.onboarding_invites;
CREATE POLICY "onboarding_invites_update_admin"
ON public.onboarding_invites
FOR UPDATE
TO authenticated
USING (public.is_super_admin())
WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "onboarding_invites_delete_admin" ON public.onboarding_invites;
CREATE POLICY "onboarding_invites_delete_admin"
ON public.onboarding_invites
FOR DELETE
TO authenticated
USING (public.is_super_admin());

-- Onboarding invite acceptance policies
DROP POLICY IF EXISTS "onboarding_invite_acceptance_select_admin" ON public.onboarding_invite_acceptance;
CREATE POLICY "onboarding_invite_acceptance_select_admin"
ON public.onboarding_invite_acceptance
FOR SELECT
TO authenticated
USING (public.is_super_admin());

DROP POLICY IF EXISTS "onboarding_invite_acceptance_insert_admin" ON public.onboarding_invite_acceptance;
CREATE POLICY "onboarding_invite_acceptance_insert_admin"
ON public.onboarding_invite_acceptance
FOR INSERT
TO authenticated
WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "onboarding_invite_acceptance_update_admin" ON public.onboarding_invite_acceptance;
CREATE POLICY "onboarding_invite_acceptance_update_admin"
ON public.onboarding_invite_acceptance
FOR UPDATE
TO authenticated
USING (public.is_super_admin())
WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "onboarding_invite_acceptance_delete_admin" ON public.onboarding_invite_acceptance;
CREATE POLICY "onboarding_invite_acceptance_delete_admin"
ON public.onboarding_invite_acceptance
FOR DELETE
TO authenticated
USING (public.is_super_admin());

-- =========================================================
-- TRIGGERS & RPC FUNCTIONS
-- =========================================================

-- Create profile on new auth user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    first_name,
    last_name
  ) VALUES (
    NEW.id,
    '',
    ''
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Fetch onboarding invite by token
DROP FUNCTION IF EXISTS public.get_onboarding_invite_by_token(TEXT);
CREATE OR REPLACE FUNCTION public.get_onboarding_invite_by_token(
  p_token TEXT
)
RETURNS TABLE (
  id UUID,
  email TEXT,
  invitation_type TEXT,
  company_name VARCHAR,
  status TEXT,
  expires_at TIMESTAMPTZ,
  terms_version TEXT,
  privacy_version TEXT,
  token TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    oi.id,
    oi.email,
    oi.invitation_type,
    oi.company_name,
    oi.status,
    oi.expires_at,
    oi.terms_version,
    oi.privacy_version,
    oi.token
  FROM public.onboarding_invites oi
  WHERE oi.token = p_token
    AND oi.status = 'pending'
    AND oi.expires_at > NOW();
END;
$$;

REVOKE ALL ON FUNCTION public.get_onboarding_invite_by_token(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_onboarding_invite_by_token(TEXT) TO anon, authenticated;

-- Accept terms & privacy
DROP FUNCTION IF EXISTS public.accept_onboarding_invite_terms(TEXT, BOOLEAN, BOOLEAN, TEXT, TEXT);
CREATE OR REPLACE FUNCTION public.accept_onboarding_invite_terms(
  p_token TEXT,
  p_accepted_terms BOOLEAN,
  p_accepted_privacy BOOLEAN,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invite public.onboarding_invites%ROWTYPE;
  v_acceptance_id UUID;
BEGIN
  IF p_accepted_terms IS NOT TRUE THEN
    RAISE EXCEPTION 'Terms must be accepted';
  END IF;

  IF p_accepted_privacy IS NOT TRUE THEN
    RAISE EXCEPTION 'Privacy policy must be accepted';
  END IF;

  SELECT *
  INTO v_invite
  FROM public.onboarding_invites
  WHERE token = p_token
    AND status = 'pending'
    AND expires_at > NOW()
  LIMIT 1;

  IF v_invite.id IS NULL THEN
    RAISE EXCEPTION 'Invalid or expired invitation';
  END IF;

  INSERT INTO public.onboarding_invite_acceptance (
    invite_id,
    accepted_terms,
    accepted_privacy,
    terms_version,
    privacy_version,
    ip_address,
    user_agent
  ) VALUES (
    v_invite.id,
    TRUE,
    TRUE,
    COALESCE(v_invite.terms_version, 'v1'),
    COALESCE(v_invite.privacy_version, 'v1'),
    p_ip_address,
    p_user_agent
  )
  ON CONFLICT (invite_id)
  DO UPDATE SET
    accepted_terms = EXCLUDED.accepted_terms,
    accepted_privacy = EXCLUDED.accepted_privacy,
    terms_version = EXCLUDED.terms_version,
    privacy_version = EXCLUDED.privacy_version,
    ip_address = EXCLUDED.ip_address,
    user_agent = EXCLUDED.user_agent,
    accepted_at = NOW()
  RETURNING id INTO v_acceptance_id;

  RETURN v_acceptance_id;
END;
$$;

REVOKE ALL ON FUNCTION public.accept_onboarding_invite_terms(TEXT, BOOLEAN, BOOLEAN, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.accept_onboarding_invite_terms(TEXT, BOOLEAN, BOOLEAN, TEXT, TEXT) TO anon, authenticated;

-- =========================================================
-- GRANTS
-- =========================================================

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.onboarding_invites
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.onboarding_invite_acceptance
TO authenticated;