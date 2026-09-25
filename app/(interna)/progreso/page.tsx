'use client';

// Progreso — racha, nivel de Gastón y en qué se fue el dinero hoy, agrupado por categoría.
// Pantalla secundaria (no es una de las 4 del dinero): checklist + medición, sin revisor-visual.

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Flame, Star } from 'lucide-react';
import { Hairline } from '@/components/landing/ui';
import { BottomNav } from '@/components/app/ui';
import {
  cargarDatosApp,
  filtrarPorRango,
  formatoMoneda,
  iconoCategoria,
  porCategoria,
  rangoPeriodo,
  sumaPorTipo,
  type DatosApp,
  type Periodo,
} from '@/lib/datosApp';

const DATOS_INICIALES: DatosApp = { moneda: 'CRC', presupuestoMensual: 500000, presupuestoLibreDiario: 25000, racha: 1, nivelMascota: 1, gastos: [] };

const PERIODOS: { valor: Periodo; label: string }[] = [
  { valor: 'mes', label: 'Mes' },
  { valor: 'trimestre', label: 'Trimestre' },
  { valor: 'año', label: 'Año' },
];

export default function ProgresoPage() {
  const [datos, setDatos] = useState<DatosApp>(DATOS_INICIALES);
  const [cargado, setCargado] = useState(false);
  // Historial y estadísticas por período (2026-09-25, a pedido del usuario). `offset`
  // navega entre períodos del mismo tipo: 0 = el actual, negativo = hacia atrás — se
  // reinicia a 0 cada vez que el usuario cambia de Mes/Trimestre/Año (regla 13 de UX:
  // toda vista temporal necesita fechas reales + navegación entre períodos).
  const [periodo, setPeriodo] = useState<Periodo>('mes');
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    setDatos(cargarDatosApp());
    setCargado(true);
  }, []);

  const cambiarPeriodo = (p: Periodo) => {
    setPeriodo(p);
    setOffset(0);
  };

  // "Presupuesto fijo del mes" es siempre sobre el MES CALENDARIO ACTUAL (no sobre el
  // filtro de historial de abajo, que el usuario puede mover a otros meses/trimestres/
  // años) — son dos preguntas distintas: "¿cómo voy este mes?" vs. "¿cómo me fue en tal
  // período pasado?".
  const rangoMesActual = rangoPeriodo('mes', 0);
  const gastosMesActual = filtrarPorRango(datos.gastos, rangoMesActual.desde, rangoMesActual.hasta);
  const gastoFijoMes = sumaPorTipo(gastosMesActual, 'fijo');
  const pctFijo = datos.presupuestoMensual > 0 ? Math.min(100, Math.round((gastoFijoMes / datos.presupuestoMensual) * 100)) : 0;
  const pasadoFijo = gastoFijoMes > datos.presupuestoMensual;
  const restanteFijo = Math.max(0, datos.presupuestoMensual - gastoFijoMes);
  const ahorradoMes = porCategoria(gastosMesActual).find((c) => c.categoria === 'Ahorros')?.monto ?? 0;

  // El historial filtrable: el período que el usuario eligió arriba.
  const rango = rangoPeriodo(periodo, offset);
  const gastosPeriodo = filtrarPorRango(datos.gastos, rango.desde, rango.hasta);
  const totalPeriodo = gastosPeriodo.reduce((acc, g) => acc + g.monto, 0);
  const categoriasPeriodo = porCategoria(gastosPeriodo);

  return (
    <>
      <div className="flex flex-1 flex-col px-4 pt-4 pb-6" style={{ opacity: cargado ? 1 : 0 }}>
        <h1 className="text-balance text-[25px] font-bold leading-[1.15] [font-family:var(--font-display)]">
          Tu progreso
        </h1>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Hairline surface="surface" className="shadow-[var(--shadow-1)]">
            <div className="flex flex-col items-center p-4">
              <Flame size={22} color="var(--accent)" aria-hidden="true" />
              <p className="mt-1 text-2xl font-bold tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">{datos.racha}</p>
              <p className="text-xs text-[var(--text-secondary)]">días de racha</p>
            </div>
          </Hairline>
          <Hairline surface="surface" className="shadow-[var(--shadow-1)]">
            <div className="flex flex-col items-center p-4">
              <Star size={22} color="var(--accent)" aria-hidden="true" />
              <p className="mt-1 text-2xl font-bold tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">{datos.nivelMascota}</p>
              <p className="text-xs text-[var(--text-secondary)]">nivel de Gastón</p>
            </div>
          </Hairline>
        </div>

        <Hairline surface="surface" className="mt-3 shadow-[var(--shadow-1)]">
          <div className="p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-[var(--text-secondary)]">Presupuesto fijo del mes</span>
              <span className="text-xs font-semibold text-[var(--text-tertiary)]">
                {formatoMoneda(gastoFijoMes, datos.moneda)} de {formatoMoneda(datos.presupuestoMensual, datos.moneda)}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--accent)_12%,transparent)]">
              <div
                className={`h-full rounded-full ${pasadoFijo ? 'bg-[var(--error)]' : 'bg-[var(--accent)]'}`}
                style={{ width: `${pctFijo}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-[var(--text-secondary)]">
              {pasadoFijo ? 'Ya te pasaste de lo fijo este mes.' : `Te quedan ${formatoMoneda(restanteFijo, datos.moneda)} de lo fijo.`}
            </p>
            {ahorradoMes > 0 && (
              <p className="mt-1 text-xs font-semibold text-[var(--accent)]">Llevas {formatoMoneda(ahorradoMes, datos.moneda)} ahorrados este mes.</p>
            )}
          </div>
        </Hairline>

        {/* Historial por período (2026-09-25, a pedido del usuario: "estadísticas
            mensuales, trimestrales o anuales, con la opción de aplicar filtros"). Regla
            13 de UX: fechas reales + navegación entre períodos, nunca solo "el actual". */}
        <h2 className="mt-6 text-sm font-semibold text-[var(--text-secondary)]">Tu historial</h2>
        <div className="mt-2 flex gap-2 rounded-[var(--radius-button)] bg-[var(--surface-2)] p-1">
          {PERIODOS.map((p) => (
            <button
              key={p.valor}
              type="button"
              onClick={() => cambiarPeriodo(p.valor)}
              aria-pressed={periodo === p.valor}
              className={`h-9 flex-1 rounded-[var(--radius-button)] text-sm font-semibold [touch-action:manipulation] ${
                periodo === p.valor ? 'bg-[var(--surface)] text-[var(--accent)] shadow-[var(--shadow-1)]' : 'text-[var(--text-secondary)]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setOffset((o) => o - 1)}
            aria-label="Período anterior"
            className="flex size-9 items-center justify-center rounded-full text-[var(--text-secondary)] [touch-action:manipulation]"
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <span className="text-sm font-semibold text-[var(--text-primary)]">{rango.etiqueta}</span>
          <button
            type="button"
            onClick={() => setOffset((o) => Math.min(0, o + 1))}
            disabled={offset >= 0}
            aria-label="Período siguiente"
            className="flex size-9 items-center justify-center rounded-full text-[var(--text-secondary)] [touch-action:manipulation] disabled:opacity-30"
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>

        <Hairline surface="surface" className="mt-3 shadow-[var(--shadow-1)]">
          <div className="flex items-center justify-between p-4">
            <span className="text-xs text-[var(--text-secondary)]">Gastado en {rango.etiqueta}</span>
            {/* Sin font-family display (Fredoka): esa fuente no tiene el glifo del colón
                (₡, U+20A1) y lo renderiza roto como "Ø" — mismo bug real ya documentado
                y evitado en BarraPresupuestoDia (components/app/ui.tsx). */}
            <span className="text-lg font-bold tabular-nums text-[var(--text-primary)]">
              {formatoMoneda(totalPeriodo, datos.moneda)}
            </span>
          </div>
        </Hairline>

        <div className="mt-3">
          {categoriasPeriodo.length === 0 ? (
            <p className="mt-2 text-sm text-[var(--text-tertiary)]">Todavía no anotaste ningún gasto en este período.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {categoriasPeriodo.map(({ categoria: cat, monto }) => {
                const Icono = iconoCategoria(cat);
                const pct = totalPeriodo > 0 ? Math.round((monto / totalPeriodo) * 100) : 0;
                return (
                  <div key={cat} className="flex items-center gap-3 rounded-[var(--radius-button)] bg-[var(--surface-2)] px-3 py-2.5">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_12%,transparent)]">
                      <Icono size={16} strokeWidth={2} color="var(--accent)" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-[var(--text-primary)]">{cat}</p>
                        <span className="shrink-0 text-sm font-bold tabular-nums text-[var(--text-primary)]">{formatoMoneda(monto, datos.moneda)}</span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--accent)_12%,transparent)]">
                        <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <BottomNav activo="progreso" />
    </>
  );
}
