ALTER TABLE public.companies
    ADD COLUMN standard_price double precision,
    ADD COLUMN premium_price  double precision;

CREATE TABLE public.company_branches
(
    id          uuid        DEFAULT gen_random_uuid() NOT NULL,
    company_id  uuid                                  NOT NULL,
    branch_name varchar(255)                          NOT NULL,
    created_at  timestamptz DEFAULT now()             NOT NULL,
    updated_at  timestamptz DEFAULT now()             NOT NULL,
    deleted_at  timestamptz                           NULL,

    CONSTRAINT company_branches_pkey
        PRIMARY KEY (id),

    CONSTRAINT company_branches_company_id_fkey
        FOREIGN KEY (company_id)
            REFERENCES public.companies (id)
            ON DELETE CASCADE
);

CREATE INDEX idx_company_branches_company_id
    ON public.company_branches (company_id);

CREATE INDEX idx_company_branches_deleted_at
    ON public.company_branches (deleted_at)
    WHERE deleted_at IS NULL;

ALTER TABLE public.company_branches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read company_branches"
    ON public.company_branches
    FOR SELECT
    USING (true);

GRANT SELECT ON public.company_branches TO anon;
GRANT SELECT ON public.company_branches TO authenticated;
GRANT SELECT ON public.company_branches TO service_role;

CREATE OR REPLACE FUNCTION public.create_company_with_branches(
    p_name text,
    p_brn text,
    p_contact_phone text,
    p_address text,
    p_city text,
    p_post_code text,
    p_region text,
    p_disclaimer text,
    p_standard_price numeric,
    p_premium_price numeric,
    p_logo_url text,
    p_branches jsonb
)
    RETURNS uuid
    LANGUAGE plpgsql
    SECURITY DEFINER
AS
$$
DECLARE
    v_company_id uuid;
BEGIN

    INSERT INTO public.companies (name,
                                  brn,
                                  contact_phone,
                                  address,
                                  city,
                                  post_code,
                                  region,
                                  disclaimer,
                                  standard_price,
                                  premium_price,
                                  logo_url)
    VALUES (p_name,
            p_brn,
            p_contact_phone,
            p_address,
            p_city,
            p_post_code,
            p_region,
            p_disclaimer,
            p_standard_price,
            p_premium_price,
            p_logo_url)
    RETURNING id INTO v_company_id;

    INSERT INTO public.company_branches (company_id,
                                         branch_name)
    SELECT v_company_id,
           branch ->> 'branchName'
    FROM jsonb_array_elements(p_branches) AS branch;

    RETURN v_company_id;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION
            'Failed to create company: %',
            SQLERRM;

END;
$$;

ALTER TABLE companies
    ADD CONSTRAINT uq_companies_brn
        UNIQUE (brn);

ALTER TABLE company_branches
    ADD CONSTRAINT uq_company_branch
        UNIQUE (company_id, branch_name);

CREATE POLICY "Public read access for company assets"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'company-assets');