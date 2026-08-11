-- Finanças Pessoais — schema inicial
-- Rode este script no SQL Editor do seu projeto Supabase (https://app.supabase.com)

-- ============================================================
-- Extensões
-- ============================================================
create extension if not exists "pgcrypto";

-- ============================================================
-- Tabela: categories
-- Categorias fixas do app, compartilhadas por todos os usuários.
-- ============================================================
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('income', 'expense')),
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

drop policy if exists "categories are readable by authenticated users" on public.categories;
create policy "categories are readable by authenticated users"
  on public.categories
  for select
  to authenticated
  using (true);

-- Seed de categorias (idempotente)
insert into public.categories (name, type)
select v.name, v.type
from (values
  ('Alimentação', 'expense'),
  ('Transporte', 'expense'),
  ('Moradia', 'expense'),
  ('Lazer', 'expense'),
  ('Saúde', 'expense'),
  ('Educação', 'expense'),
  ('Salário', 'income'),
  ('Freelance', 'income'),
  ('Outros', 'expense'),
  ('Outros', 'income')
) as v(name, type)
where not exists (
  select 1 from public.categories c where c.name = v.name and c.type = v.type
);

-- ============================================================
-- Tabela: transactions
-- Cada linha pertence a um usuário (Row Level Security).
-- ============================================================
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  description text not null,
  amount numeric(12, 2) not null check (amount > 0),
  date date not null,
  type text not null check (type in ('income', 'expense')),
  category_id uuid references public.categories (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists transactions_user_id_idx on public.transactions (user_id);
create index if not exists transactions_date_idx on public.transactions (date);

alter table public.transactions enable row level security;

drop policy if exists "users can view their own transactions" on public.transactions;
create policy "users can view their own transactions"
  on public.transactions
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "users can insert their own transactions" on public.transactions;
create policy "users can insert their own transactions"
  on public.transactions
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "users can update their own transactions" on public.transactions;
create policy "users can update their own transactions"
  on public.transactions
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "users can delete their own transactions" on public.transactions;
create policy "users can delete their own transactions"
  on public.transactions
  for delete
  to authenticated
  using (auth.uid() = user_id);
