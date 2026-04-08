-- ═══════════════════════════════════════════════════════
-- طلباتنا — Database Schema
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── PROFILES ─────────────────────────────────────────
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  phone text unique not null,
  role text not null check (role in ('client', 'courier')),
  avatar_url text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ─── WALLETS ──────────────────────────────────────────
create table wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade unique not null,
  balance numeric(10,2) default 0 not null check (balance >= 0),
  updated_at timestamptz default now()
);

-- ─── WALLET TRANSACTIONS ─────────────────────────────
create table wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  wallet_id uuid references wallets(id) on delete cascade not null,
  type text not null check (type in (
    'deposit', 'withdrawal', 'order_payment',
    'commission', 'refund', 'courier_earning'
  )),
  amount numeric(10,2) not null,
  balance_after numeric(10,2) not null,
  description text,
  order_id uuid,
  created_at timestamptz default now()
);

-- ─── ORDERS ───────────────────────────────────────────
create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  client_id uuid references profiles(id) not null,
  courier_id uuid references profiles(id),
  type text not null check (type in ('order_for_me', 'send_for_me')),
  status text not null default 'pending' check (status in (
    'pending', 'searching', 'assigned',
    'heading_to_store', 'at_store', 'purchased',
    'heading_to_client', 'at_client', 'picked_up',
    'heading_to_destination', 'delivered', 'cancelled'
  )),
  store_name text,
  items_description text,
  estimated_items_price numeric(10,2),
  package_description text,
  package_value numeric(10,2),
  recipient_name text,
  recipient_phone text,
  pickup_address text not null,
  delivery_address text not null,
  scheduled_time text default 'asap',
  notes text,
  items_actual_price numeric(10,2),
  delivery_fee numeric(10,2) not null,
  platform_commission numeric(10,2) not null,
  courier_earning numeric(10,2) not null,
  total_client_pays numeric(10,2) not null,
  rating integer check (rating between 1 and 5),
  rating_comment text,
  cancelled_by text,
  cancel_reason text,
  created_at timestamptz default now(),
  assigned_at timestamptz,
  delivered_at timestamptz
);

-- ─── ORDER STATUS HISTORY ────────────────────────────
create table order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade not null,
  status text not null,
  note text,
  changed_by uuid references profiles(id),
  created_at timestamptz default now()
);

-- ─── COURIER STATS ───────────────────────────────────
create table courier_stats (
  id uuid primary key default gen_random_uuid(),
  courier_id uuid references profiles(id) on delete cascade unique not null,
  total_orders integer default 0,
  completed_orders integer default 0,
  total_earned numeric(10,2) default 0,
  rating_sum numeric default 0,
  rating_count integer default 0,
  is_online boolean default false,
  updated_at timestamptz default now()
);

-- ─── AUTO-CREATE wallet on new profile ───────────────
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into wallets (user_id) values (new.id);
  if new.role = 'courier' then
    insert into courier_stats (courier_id) values (new.id);
  end if;
  return new;
end;
$$;

create trigger on_profile_created
  after insert on profiles
  for each row execute function handle_new_user();