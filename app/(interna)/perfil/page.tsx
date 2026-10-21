'use client';

// Perfil — tu plan, tu límite diario y cerrar sesión. Pantalla secundaria (checklist,
// sin revisor-visual). Cerrar sesión / cambiar límite quedan mockeados hasta Sesión 6
// (Supabase Auth real) — mock honesto, no procesan nada de verdad todavía.

import { useEffect, useState } from 'react';
import { Coins, DollarSign, LogOut, Wallet } from 'lucide-react';
import { Hairline } from '@/components/landing/ui';
import { BottomNav } from '@/components/app/ui';
import { cargarDatosApp, formatoMoneda, guardarDatosApp, type DatosApp } from '@/lib/datosApp';

const DATOS_INICIALES: DatosApp = { moneda: 'CRC', presupuestoMensual: 500000, presupuestoLibreDiario: 25000, racha: 1, nivelMascota: 1, gastos: [] };

export default function PerfilPage() {
  const [datos, setDatos] = useState<DatosApp>(DATOS_INICIALES);
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    setDatos(cargarDatosApp());
    setCargado(true);
  }, []);

  // Moneda secundaria (2026-09-24, a pedido del usuario): ingresos/pagos mezclados en 2
  // monedas (ej. dólares y colones en Costa Rica). Se activa acá, no en el onboarding —
  // es un caso de uso específico, no la primera pregunta que le hacemos a todo el mundo.
  const activo = Boolean(datos.monedaSecundaria);
  const alternarMonedaSecundaria = () => {
    const actualizado: DatosApp = { ...datos, monedaSecundaria: activo ? undefined : 'USD' };
    setDatos(actualizado);
    guardarDatosApp(actualizado);
  };

  return (
    <>
      <div className="flex flex-1 flex-col px-4 pt-4 pb-28" style={{ opacity: cargado ? 1 : 0 }}>
        <h1 className="text-balance text-[25px] font-bold leading-[1.15] [font-family:var(--font-display)]">
          Tu cuenta
        </h1>

        <Hairline surface="surface" className="mt-4 shadow-[var(--shadow-1)]">
          <div className="flex items-center gap-3 p-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_12%,transparent)]">
              <Wallet size={20} color="var(--accent)" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-[var(--text-tertiary)]">Tu presupuesto fijo del mes</p>
              <p className="text-[15px] font-semibold text-[var(--text-primary)]">{formatoMoneda(datos.presupuestoMensual, datos.moneda)}</p>
            </div>
          </div>
        </Hairline>

        <Hairline surface="surface" className="mt-3 shadow-[var(--shadow-1)]">
          <div className="flex items-center gap-3 p-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_12%,transparent)]">
              <Coins size={20} color="var(--accent)" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-[var(--text-tertiary)]">Tu presupuesto libre por día</p>
              <p className="text-[15px] font-semibold text-[var(--text-primary)]">{formatoMoneda(datos.presupuestoLibreDiario, datos.moneda)}</p>
            </div>
          </div>
        </Hairline>

        <Hairline surface="surface" className="mt-3 shadow-[var(--shadow-1)]">
          <div className="flex items-center gap-3 p-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_12%,transparent)]">
              <DollarSign size={20} color="var(--accent)" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold text-[var(--text-primary)]">Moneda secundaria (dólares)</p>
              <p className="text-xs text-[var(--text-tertiary)]">Para cuando anotas un gasto en dólares con tipo de cambio del día.</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={activo}
              aria-label="Activar moneda secundaria en dólares"
              onClick={alternarMonedaSecundaria}
              className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-150 [touch-action:manipulation] ${activo ? 'bg-[var(--accent)]' : 'bg-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)]'}`}
            >
              <span
                className={`absolute top-0.5 size-6 rounded-full bg-[var(--surface)] shadow-[var(--shadow-1)] transition-transform duration-150 ${activo ? 'translate-x-[22px]' : 'translate-x-0.5'}`}
              />
            </button>
          </div>
        </Hairline>

        <Hairline surface="surface" className="mt-3 shadow-[var(--shadow-1)]">
          <div className="p-4">
            <p className="text-xs text-[var(--text-tertiary)]">Tu plan</p>
            <p className="text-[15px] font-semibold text-[var(--text-primary)]">Prueba gratis — 7 días</p>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">Se activa por completo cuando conectes tu pago (próximamente).</p>
          </div>
        </Hairline>

        <button
          type="button"
          onClick={() => (window.location.href = '/')}
          className="mt-6 flex h-12 items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] text-sm font-medium text-[var(--text-secondary)] [touch-action:manipulation]"
        >
          <LogOut size={16} aria-hidden="true" />
          Cerrar sesión
        </button>
      </div>
      <BottomNav activo="perfil" />
    </>
  );
}
