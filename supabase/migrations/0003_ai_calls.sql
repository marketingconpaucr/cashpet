-- CashPet — libro de gasto de IA (circuit-breaker de presupuesto, docs/sistema/30-INTEGRACION-IA.md).
-- Solo el servidor (clave secreta, bypassa RLS) escribe/lee esta tabla — por eso RLS está
-- activo pero SIN políticas: ni anon ni authenticated pueden tocarla directo.

create table public.ai_calls (
  id uuid primary key default gen_random_uuid(),
  modelo text not null,
  tokens_entrada int not null,
  tokens_salida int not null,
  costo_usd numeric(10,6) not null,
  creado_en timestamptz not null default now()
);

create index ai_calls_creado_en_idx on public.ai_calls (creado_en desc);

alter table public.ai_calls enable row level security;
