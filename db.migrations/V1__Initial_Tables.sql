create table public.profiles
(
    id          uuid primary key references auth.users (id) on delete cascade,
    first_name  varchar(255)              not null,
    last_name   varchar(255)              not null,
    picture_url text,
    created_at  timestamptz default now() not null,
    updated_at  timestamptz default now() not null
);

create table public.companies
(
    id         uuid primary key default gen_random_uuid(),
    name       varchar(255)                   not null,
    mode       varchar(100)                   not null,
    created_at timestamptz      default now() not null,
    updated_at timestamptz      default now() not null,
    deleted_at timestamptz
);

create table public.company_user
(
    id         uuid primary key default gen_random_uuid(),
    user_id    uuid    not null references auth.users (id) on delete cascade,
    company_id uuid    not null references public.companies (id) on delete cascade,
    is_owner   boolean not null default false,
    joined_at  timestamptz      default now() not null,
    unique (user_id, company_id)
);

CREATE TABLE public.company_role
(
    id         uuid primary key default gen_random_uuid(),
    company_id uuid not null references public.companies (id) on delete cascade,
    name       text not null,
    unique (company_id, name)
);

CREATE TABLE public.company_role_permission
(
    id              uuid primary key default gen_random_uuid(),
    company_role_id uuid         not null references public.company_role (id) on delete cascade,
    module          varchar(100) not null,
    can_read        boolean      not null,
    can_write       boolean      not null,
    can_delete      boolean      not null,
    unique (company_role_id, module)
);

CREATE TABLE public.company_user_role
(
    id              uuid primary key default gen_random_uuid(),
    company_user_id uuid not null references public.company_user (id) on delete cascade,
    company_role_id uuid not null references public.company_role (id) on delete cascade,
    unique (company_user_id, company_role_id)
);

CREATE INDEX idx_companies_deleted_at ON public.companies (deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_company_user_company_id ON public.company_user (company_id);
CREATE INDEX idx_company_user_role_company_role_id ON public.company_user_role (company_role_id);
CREATE UNIQUE INDEX idx_company_one_owner ON public.company_user (company_id) WHERE is_owner = true;

-- TODO: Add Check constraint for enums
-- TODO: updated_at trigger if frontend is not setting it