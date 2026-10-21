-- 0004 — La base guarda los datos REALES del celular (decisión del usuario, 2026-10-21).
-- Regla: la fecha, la hora y la zona horaria de cada gasto las manda el celular; el SERVIDOR NUNCA
-- decide el día. Con `default current_date` el día lo ponía el servidor en UTC, y en Costa Rica
-- (UTC-6) un gasto de las 6 pm habría quedado en el día siguiente — rompiendo semana y racha.
-- Las tablas están vacías al aplicar esto (0 gastos, 0 perfiles): no se toca ningún dato.

-- gastos: la fecha local deja de tener default; hay que mandarla siempre.
alter table public.gastos alter column gastado_en drop default;
alter table public.gastos add column if not exists hora_local time;
alter table public.gastos add column if not exists zona_horaria text;

comment on column public.gastos.gastado_en is 'Fecha LOCAL del celular al anotar el gasto (YYYY-MM-DD). La manda la app; el servidor nunca la decide (current_date va en UTC).';
comment on column public.gastos.hora_local is 'Hora LOCAL del celular al anotar el gasto.';
comment on column public.gastos.zona_horaria is 'Zona horaria IANA del celular al anotar (ej. America/Costa_Rica).';
comment on column public.gastos.created_at is 'Cuándo llegó al servidor (sincronización). NO es la fecha del gasto.';

-- profiles: el ingreso permite recalcular cuánto queda de verdad cada mes.
alter table public.profiles add column if not exists ingreso_mensual numeric(12,2);

-- La racha y el nivel se CALCULAN del historial (días con gasto o "sin gastos hoy", semanas
-- cerradas dentro del tope): guardarlos aparte los dejaría desincronizados. Columnas obsoletas.
comment on column public.profiles.racha_actual is 'OBSOLETA — la racha se calcula del historial. No escribir.';
comment on column public.profiles.racha_mas_larga is 'OBSOLETA — se calcula del historial. No escribir.';
comment on column public.profiles.mascota_nivel is 'OBSOLETA — el nivel se calcula de las semanas cerradas dentro del tope. No escribir.';
comment on column public.profiles.ultima_actividad is 'OBSOLETA — se deduce del último registro. No escribir.';

-- "Sin gastos hoy": un día sin gastos que el usuario marcó; cuenta como registro para la racha.
create table public.dias_sin_gastos (
  user_id uuid not null references public.profiles(id) on delete cascade,
  dia date not null,
  zona_horaria text,
  created_at timestamptz not null default now(),
  primary key (user_id, dia)
);
comment on column public.dias_sin_gastos.dia is 'Fecha LOCAL del celular que el usuario marcó como "sin gastos".';

alter table public.dias_sin_gastos enable row level security;

create policy "dias_sin_gastos_select_own" on public.dias_sin_gastos
  for select using (user_id = (select auth.uid()));
create policy "dias_sin_gastos_insert_own" on public.dias_sin_gastos
  for insert with check (user_id = (select auth.uid()));
create policy "dias_sin_gastos_delete_own" on public.dias_sin_gastos
  for delete using (user_id = (select auth.uid()));
