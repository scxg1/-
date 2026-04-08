-- ═══════════════════════════════════════════════════════
-- طلباتنا — Row Level Security Policies
-- Run this AFTER DATABASE_SCHEMA.sql
-- ═══════════════════════════════════════════════════════

-- Enable RLS on all tables
alter table profiles enable row level security;
alter table wallets enable row level security;
alter table wallet_transactions enable row level security;
alter table orders enable row level security;
alter table order_status_history enable row level security;
alter table courier_stats enable row level security;

-- ─── PROFILES policies ───────────────────────────────
create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

create policy "Couriers visible to all authenticated"
  on profiles for select using (
    auth.role() = 'authenticated' and role = 'courier'
  );

-- ─── WALLETS policies ────────────────────────────────
create policy "Users can view own wallet"
  on wallets for select using (auth.uid() = user_id);

-- ─── WALLET TRANSACTIONS policies ────────────────────
create policy "Users can view own transactions"
  on wallet_transactions for select using (
    auth.uid() = (select user_id from wallets where id = wallet_id)
  );

-- ─── ORDERS policies ─────────────────────────────────
create policy "Clients can view own orders"
  on orders for select using (auth.uid() = client_id);

create policy "Clients can create orders"
  on orders for insert with check (auth.uid() = client_id);

create policy "Clients can cancel own pending orders"
  on orders for update using (
    auth.uid() = client_id and status = 'pending'
  );

create policy "Couriers can view pending and assigned orders"
  on orders for select using (
    auth.uid() = courier_id
    or (status = 'searching' and courier_id is null)
  );

create policy "Couriers can update assigned orders"
  on orders for update using (auth.uid() = courier_id);

-- ─── ORDER STATUS HISTORY policies ──────────────────
create policy "Participants can view order history"
  on order_status_history for select using (
    auth.uid() = (select client_id from orders where id = order_id)
    or auth.uid() = (select courier_id from orders where id = order_id)
  );

-- ─── COURIER STATS policies ──────────────────────────
create policy "Couriers can view own stats"
  on courier_stats for select using (auth.uid() = courier_id);

create policy "All authenticated can view courier stats"
  on courier_stats for select using (auth.role() = 'authenticated');

-- ─── Allow inserting status history by participants ──
create policy "Participants can insert order history"
  on order_status_history for insert with check (
    auth.uid() = (select client_id from orders where id = order_id)
    or auth.uid() = (select courier_id from orders where id = order_id)
  );