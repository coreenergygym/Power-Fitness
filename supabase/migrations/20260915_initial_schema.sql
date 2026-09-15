-- POWER FITNESS HEALTH CLUB GYM
-- Run this migration in a fresh Supabase project.
create extension if not exists pgcrypto;

create table if not exists gym_settings (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'POWER FITNESS HEALTH CLUB GYM',
  owner_name text not null default 'Mukesh Kumar Jagrat',
  whatsapp text not null default '+91 99296 56539',
  instagram text not null default '@power_fitness_healthclub_gym',
  address text not null default 'Plot No. 67, Mukund Vihar Colony, Near Study Base Library, Adarsh Nagar, Ajmer, Rajasthan - 305003',
  google_maps_url text not null default 'https://maps.app.goo.gl/vjHAwZynNLBQK3TRA?g_st=ac',
  about_content text,
  hero_headline text,
  hero_subtext text,
  opening_hours jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists membership_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  duration_months integer not null check (duration_months > 0),
  price integer not null check (price >= 0),
  description text,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists members (
  id uuid primary key default gen_random_uuid(),
  photo_url text,
  full_name text not null,
  phone text not null unique,
  email text,
  gender text check (gender in ('male','female','other')),
  address text,
  membership_plan_id uuid references membership_plans(id) on delete set null,
  start_date date not null,
  expiry_date date not null,
  payment_status text not null default 'unpaid' check (payment_status in ('paid','unpaid','partial')),
  amount_paid integer not null default 0 check (amount_paid >= 0),
  due_amount integer not null default 0 check (due_amount >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists membership_history (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references members(id) on delete cascade,
  membership_plan_id uuid references membership_plans(id) on delete set null,
  start_date date not null,
  expiry_date date not null,
  amount integer not null default 0,
  amount_paid integer not null default 0,
  payment_status text not null default 'unpaid' check (payment_status in ('paid','unpaid','partial')),
  created_at timestamptz not null default now()
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references members(id) on delete cascade,
  amount integer not null check (amount >= 0),
  payment_status text not null default 'paid' check (payment_status in ('paid','unpaid','partial')),
  method text,
  notes text,
  paid_at timestamptz not null default now()
);

create table if not exists facilities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  image_url text,
  icon text,
  created_at timestamptz not null default now()
);

create table if not exists gallery_items (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('image','video')),
  url text not null,
  caption text,
  storage_path text,
  created_at timestamptz not null default now()
);

create table if not exists enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  interested_plan text,
  message text,
  created_at timestamptz not null default now()
);

create or replace function set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists gym_settings_updated_at on gym_settings;
create trigger gym_settings_updated_at before update on gym_settings for each row execute function set_updated_at();
drop trigger if exists membership_plans_updated_at on membership_plans;
create trigger membership_plans_updated_at before update on membership_plans for each row execute function set_updated_at();
drop trigger if exists members_updated_at on members;
create trigger members_updated_at before update on members for each row execute function set_updated_at();

create or replace function sync_member_due() returns trigger language plpgsql as $$
declare plan_price integer;
begin
  select price into plan_price from membership_plans where id = new.membership_plan_id;
  new.due_amount := greatest(coalesce(plan_price,0) - coalesce(new.amount_paid,0), 0);
  if new.due_amount = 0 and new.payment_status <> 'paid' then new.payment_status := 'paid'; end if;
  if new.due_amount > 0 and new.amount_paid > 0 and new.payment_status = 'paid' then new.payment_status := 'partial'; end if;
  return new;
end $$;

drop trigger if exists members_sync_due on members;
create trigger members_sync_due before insert or update of membership_plan_id, amount_paid, payment_status on members
for each row execute function sync_member_due();

alter table gym_settings enable row level security;
alter table membership_plans enable row level security;
alter table members enable row level security;
alter table membership_history enable row level security;
alter table payments enable row level security;
alter table facilities enable row level security;
alter table gallery_items enable row level security;
alter table enquiries enable row level security;

drop policy if exists "public read gym settings" on gym_settings;
create policy "public read gym settings" on gym_settings for select using (true);
drop policy if exists "authenticated manage gym settings" on gym_settings;
create policy "authenticated manage gym settings" on gym_settings for all to authenticated using (true) with check (true);

drop policy if exists "public read plans" on membership_plans;
create policy "public read plans" on membership_plans for select using (true);
drop policy if exists "authenticated manage plans" on membership_plans;
create policy "authenticated manage plans" on membership_plans for all to authenticated using (true) with check (true);

drop policy if exists "authenticated manage members" on members;
create policy "authenticated manage members" on members for all to authenticated using (true) with check (true);

drop policy if exists "authenticated manage history" on membership_history;
create policy "authenticated manage history" on membership_history for all to authenticated using (true) with check (true);
drop policy if exists "authenticated manage payments" on payments;
create policy "authenticated manage payments" on payments for all to authenticated using (true) with check (true);

drop policy if exists "public read facilities" on facilities;
create policy "public read facilities" on facilities for select using (true);
drop policy if exists "authenticated manage facilities" on facilities;
create policy "authenticated manage facilities" on facilities for all to authenticated using (true) with check (true);

drop policy if exists "public read gallery" on gallery_items;
create policy "public read gallery" on gallery_items for select using (true);
drop policy if exists "authenticated manage gallery" on gallery_items;
create policy "authenticated manage gallery" on gallery_items for all to authenticated using (true) with check (true);

drop policy if exists "public create enquiries" on enquiries;
create policy "public create enquiries" on enquiries for insert with check (true);
drop policy if exists "authenticated read enquiries" on enquiries;
create policy "authenticated read enquiries" on enquiries for select to authenticated using (true);
drop policy if exists "authenticated manage enquiries" on enquiries;
create policy "authenticated manage enquiries" on enquiries for update/delete to authenticated using (true) with check (true);

insert into gym_settings (name,owner_name,whatsapp,instagram,address,google_maps_url)
select 'POWER FITNESS HEALTH CLUB GYM','Mukesh Kumar Jagrat','+91 99296 56539','@power_fitness_healthclub_gym',
'Plot No. 67, Mukund Vihar Colony, Near Study Base Library, Adarsh Nagar, Ajmer, Rajasthan - 305003',
'https://maps.app.goo.gl/vjHAwZynNLBQK3TRA?g_st=ac'
where not exists (select 1 from gym_settings);

insert into membership_plans (name,duration_months,price,description,is_featured)
select * from (values
 ('Yearly',12,8999,'Best value for a long-term commitment.',true),
 ('6 Months',6,5999,'A focused half-year commitment.',false),
 ('3 Months',3,3499,'Start strong and build momentum.',false)
) v(name,duration_months,price,description,is_featured)
where not exists (select 1 from membership_plans);

-- Storage:
-- Create these buckets in Supabase Storage:
-- 1) member-photos (PRIVATE)
-- 2) gallery (PUBLIC)
-- 3) facilities (PUBLIC)
-- 4) gym-logo (PUBLIC)
--
-- For production, add Storage policies that allow authenticated admins to upload/update/delete.
-- Do not expose the service-role key in the frontend.