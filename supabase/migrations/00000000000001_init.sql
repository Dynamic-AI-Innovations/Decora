-- Decora — initial schema (V1.0).
-- See docs/BUILD.md §8 for the contract.
-- RLS is on every user-facing table. Service-role bypass for workers only.

set check_function_bodies = off;

----------------------------------------------------------------------
-- profile
----------------------------------------------------------------------
create table if not exists public.profile (
    user_id uuid primary key references auth.users(id) on delete cascade,
    display_name text,
    city text check (city in ('lagos','abuja','ph','other')),
    home_type text check (home_type in ('apartment','duplex','bungalow','compound','other')),
    taste_quiz jsonb,
    default_style text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.profile enable row level security;

create policy "profile_self_read" on public.profile
    for select using (auth.uid() = user_id);

create policy "profile_self_upsert" on public.profile
    for insert with check (auth.uid() = user_id);

create policy "profile_self_update" on public.profile
    for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

----------------------------------------------------------------------
-- plan
----------------------------------------------------------------------
create table if not exists public.plan (
    id text primary key,
    monthly_render_limit int not null,
    watermark boolean not null,
    founding boolean not null default false,
    price_ngn_monthly int not null,
    price_ngn_annual int not null,
    seats int not null default 1,
    created_at timestamptz not null default now()
);

alter table public.plan enable row level security;

create policy "plan_public_read" on public.plan
    for select using (true);

----------------------------------------------------------------------
-- subscription
----------------------------------------------------------------------
create table if not exists public.subscription (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    plan_id text not null references public.plan(id),
    status text not null check (status in ('active','past_due','canceled','trialing')),
    founding_locked_until date,
    paystack_subscription_code text,
    current_period_end timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create unique index subscription_one_active_per_user
    on public.subscription(user_id) where status in ('active','trialing');

alter table public.subscription enable row level security;

create policy "subscription_self_read" on public.subscription
    for select using (auth.uid() = user_id);

----------------------------------------------------------------------
-- project
----------------------------------------------------------------------
create table if not exists public.project (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    title text,
    room_type text,
    created_at timestamptz not null default now(),
    archived_at timestamptz
);

alter table public.project enable row level security;

create policy "project_owner_all" on public.project
    using (auth.uid() = user_id) with check (auth.uid() = user_id);

----------------------------------------------------------------------
-- render_request
----------------------------------------------------------------------
create table if not exists public.render_request (
    id uuid primary key default gen_random_uuid(),
    project_id uuid not null references public.project(id) on delete cascade,
    user_id uuid not null references auth.users(id) on delete cascade,
    source_image_url text not null,
    style text not null,
    budget_ngn int not null,
    status text not null default 'queued'
        check (status in ('queued','analyzing','generating','scoring','done','failed')),
    failure_reason text,
    room_json jsonb,
    prompt jsonb,
    budget_json jsonb,
    cost_ngn int,
    latency_ms int,
    created_at timestamptz not null default now(),
    completed_at timestamptz
);

create index render_request_user_idx on public.render_request(user_id, created_at desc);
create index render_request_status_idx on public.render_request(status) where status <> 'done';

alter table public.render_request enable row level security;

create policy "render_request_owner_read" on public.render_request
    for select using (auth.uid() = user_id);

create policy "render_request_owner_insert" on public.render_request
    for insert with check (auth.uid() = user_id);

----------------------------------------------------------------------
-- render_variant
----------------------------------------------------------------------
create table if not exists public.render_variant (
    id uuid primary key default gen_random_uuid(),
    render_request_id uuid not null references public.render_request(id) on delete cascade,
    variant_index int not null check (variant_index between 0 and 2),
    image_url text not null,
    seed bigint,
    width int,
    height int,
    created_at timestamptz not null default now(),
    unique (render_request_id, variant_index)
);

alter table public.render_variant enable row level security;

create policy "render_variant_owner_read" on public.render_variant
    for select using (
        exists (
            select 1 from public.render_request rr
            where rr.id = render_variant.render_request_id and rr.user_id = auth.uid()
        )
    );

----------------------------------------------------------------------
-- price_catalogue
----------------------------------------------------------------------
create table if not exists public.price_catalogue (
    id uuid primary key default gen_random_uuid(),
    category text not null,
    subcategory text,
    item_name text not null,
    tier text not null check (tier in ('entry','mid','premium')),
    price_min_ngn int not null,
    price_mid_ngn int not null,
    price_max_ngn int not null,
    source text not null check (source in ('manual','jumia_feed','konga_feed','vendor_direct')),
    last_updated timestamptz not null default now()
);

create index price_catalogue_category_tier_idx on public.price_catalogue(category, tier);

alter table public.price_catalogue enable row level security;

create policy "price_catalogue_public_read" on public.price_catalogue
    for select using (true);

----------------------------------------------------------------------
-- affiliate_product
----------------------------------------------------------------------
create table if not exists public.affiliate_product (
    id uuid primary key default gen_random_uuid(),
    platform text not null check (platform in ('jumia','konga','vendor_direct')),
    product_name text not null,
    category text not null,
    price_ngn int not null,
    affiliate_url text not null,
    image_url text,
    last_synced timestamptz not null default now()
);

create index affiliate_product_category_idx on public.affiliate_product(category);

alter table public.affiliate_product enable row level security;

create policy "affiliate_product_public_read" on public.affiliate_product
    for select using (true);

----------------------------------------------------------------------
-- affiliate_click
----------------------------------------------------------------------
create table if not exists public.affiliate_click (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    render_request_id uuid references public.render_request(id) on delete set null,
    affiliate_product_id uuid not null references public.affiliate_product(id),
    clicked_at timestamptz not null default now(),
    converted boolean not null default false,
    commission_ngn int
);

create index affiliate_click_user_idx on public.affiliate_click(user_id, clicked_at desc);

alter table public.affiliate_click enable row level security;

create policy "affiliate_click_owner_insert" on public.affiliate_click
    for insert with check (auth.uid() = user_id);

create policy "affiliate_click_owner_read" on public.affiliate_click
    for select using (auth.uid() = user_id);

----------------------------------------------------------------------
-- referral
----------------------------------------------------------------------
create table if not exists public.referral (
    id uuid primary key default gen_random_uuid(),
    inviter_user_id uuid not null references auth.users(id) on delete cascade,
    invitee_user_id uuid references auth.users(id) on delete set null,
    credited boolean not null default false,
    created_at timestamptz not null default now()
);

alter table public.referral enable row level security;

create policy "referral_inviter_read" on public.referral
    for select using (auth.uid() = inviter_user_id);

----------------------------------------------------------------------
-- founding-counter (atomic lock at 1000 paying users)
----------------------------------------------------------------------
create table if not exists public.founding_counter (
    id int primary key default 1,
    paying_users int not null default 0,
    closed boolean not null default false,
    closed_at timestamptz,
    constraint founding_counter_single_row check (id = 1)
);

insert into public.founding_counter (id, paying_users) values (1, 0)
    on conflict (id) do nothing;

alter table public.founding_counter enable row level security;

create policy "founding_counter_public_read" on public.founding_counter
    for select using (true);
