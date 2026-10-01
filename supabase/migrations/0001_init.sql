-- CashPet — esquema inicial (profiles + gastos)
-- Diseño decidido en ESTADO.md > Decisiones técnicas (Sesión 1), creado en Supabase real en Sesión 6.

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  presupuesto_mensual numeric(10,2),
  presupuesto_libre_diario numeric(10,2),
  moneda text not null default 'USD',
  moneda_secundaria text,
  ultimo_tipo_cambio numeric,
  mascota_personalidad text,
  mascota_nivel int not null default 1,
  racha_actual int not null default 0,
  racha_mas_larga int not null default 0,
  ultima_actividad date,
  plan text not null default 'trial' check (plan in ('trial', 'activo', 'cancelado', 'vencido')),
  trial_termina timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.gastos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  monto numeric(10,2) not null check (monto > 0),
  categoria text not null,
  descripcion text,
  reaccion_ia text,
  monto_original numeric(10,2),
  moneda_original text,
  tipo_cambio numeric,
  gastado_en date not null default current_date,
  created_at timestamptz not null default now()
);

create index gastos_user_id_gastado_en_idx on public.gastos (user_id, gastado_en desc);

alter table public.profiles enable row level security;
alter table public.gastos enable row level security;

-- Política por (select auth.uid()) — forma de alto rendimiento (ver docs/sistema/25-BASE-DE-DATOS.md):
-- evalúa auth.uid() una sola vez por consulta en vez de una vez por fila.
create policy "profiles_select_own" on public.profiles
  for select using (id = (select auth.uid()));
create policy "profiles_insert_own" on public.profiles
  for insert with check (id = (select auth.uid()));
create policy "profiles_update_own" on public.profiles
  for update using (id = (select auth.uid()));
create policy "profiles_delete_own" on public.profiles
  for delete using (id = (select auth.uid()));

create policy "gastos_select_own" on public.gastos
  for select using (user_id = (select auth.uid()));
create policy "gastos_insert_own" on public.gastos
  for insert with check (user_id = (select auth.uid()));
create policy "gastos_update_own" on public.gastos
  for update using (user_id = (select auth.uid()));
create policy "gastos_delete_own" on public.gastos
  for delete using (user_id = (select auth.uid()));

-- updated_at: default now() solo pone la fecha al crear — este trigger la refresca en cada UPDATE.
create function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Crea el profile automáticamente cuando alguien se registra (magic link) — sin esto, el primer
-- login post-compra no tendría fila en profiles para guardar su presupuesto/onboarding.
-- search_path = '' + tablas calificadas con esquema: evita escalada de privilegios (25-BASE-DE-DATOS.md).
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, plan, trial_termina)
  values (new.id, 'trial', now() + interval '7 days');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
