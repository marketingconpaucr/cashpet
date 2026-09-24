'use client';

// Progreso — racha, nivel de Gastón y en qué se fue el dinero hoy, agrupado por categoría.
// Pantalla secundaria (no es una de las 4 del dinero): checklist + medición, sin revisor-visual.

import { useEffect, useState } from 'react';
import { Flame, Star } from 'lucide-react';
import { Hairline } from '@/components/landing/ui';
import { BottomNav } from '@/components/app/ui';
import { cargarDatosApp, formatoMoneda, iconoCategoria, sumaPorTipo, type DatosApp } from '@/lib/datosApp';

const DATOS_INICIALES: DatosApp = { moneda: 'CRC', presupuestoMensual: 500000, presupuestoLibreDiario: 25000, racha: 1, nivelMascota: 1, gastosHoy: [] };

export default function ProgresoPage() {
  const [datos, setDatos] = useState<DatosApp>(DATOS_INICIALES);
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    setDatos(cargarDatosApp());
    setCargado(true);
  }, []);

  const porCategoria = datos.gastosHoy.reduce<Record<string, number>>((acc, g) => {
    acc[g.categoria] = (acc[g.categoria] ?? 0) + g.monto;
    return acc;
  }, {});
  const totalHoy = datos.gastosHoy.reduce((acc, g) => acc + g.monto, 0);

  // Lo fijo (renta, recibos, súper) se resume acá — no en Inicio, que es sobre el ritual
  // diario de la bolsa libre (ver "Dos presupuestos" en lib/datosApp.ts).
  const gastoFijoMes = sumaPorTipo(datos.gastosHoy, 'fijo');
  const pctFijo = datos.presupuestoMensual > 0 ? Math.min(100, Math.round((gastoFijoMes / datos.presupuestoMensual) * 100)) : 0;
  const pasadoFijo = gastoFijoMes > datos.presupuestoMensual;
  const restanteFijo = Math.max(0, datos.presupuestoMensual - gastoFijoMes);
  const ahorrado = porCategoria['Ahorros'] ?? 0;

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
            {ahorrado > 0 && (
              <p className="mt-1 text-xs font-semibold text-[var(--accent)]">Llevas {formatoMoneda(ahorrado, datos.moneda)} ahorrados este mes.</p>
            )}
          </div>
        </Hairline>

        <h2 className="mt-6 text-sm font-semibold text-[var(--text-secondary)]">En qué se te fue hoy</h2>
        {Object.keys(porCategoria).length === 0 ? (
          <p className="mt-2 text-sm text-[var(--text-tertiary)]">Todavía no anotaste ningún gasto hoy.</p>
        ) : (
          <div className="mt-2 flex flex-col gap-2">
            {Object.entries(porCategoria)
              .sort(([, a], [, b]) => b - a)
              .map(([cat, monto]) => {
                const Icono = iconoCategoria(cat);
                const pct = totalHoy > 0 ? Math.round((monto / totalHoy) * 100) : 0;
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
      <BottomNav activo="progreso" />
    </>
  );
}
