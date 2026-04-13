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