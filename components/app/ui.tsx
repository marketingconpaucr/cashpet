'use client';

// KIT DE LA APP INTERNA — piezas compartidas de Inicio/Progreso/Perfil (Sesión 5).
// Reusa los mismos tokens que landing/onboarding/paywall — misma identidad, un solo
// sistema visual en toda la app. Supabase Auth/BD aún no están conectados (Sesión 6):
// los datos viven en localStorage, mockup honesto, nunca una pantalla vacía (32).

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { animate, motion, useInView, useReducedMotion } from 'motion/react';
import { Home, Pencil, Trash2, TrendingUp, User, type LucideIcon } from 'lucide-react';
import { Hairline } from '@/components/landing/ui';

/* ── <MontoAnimado> — el dato héroe cuenta de 0 al valor final, nunca estático (baseline
   de movimiento #2 de DESIGN-CORE) — versión de `CountUp` que formatea como moneda real
   (símbolo + agrupado por locale) en vez de solo prefijo/sufijo genérico. ── */
function MontoAnimado({ valor, formatear }: { valor: number; formatear: (v: number) => string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const enVista = useInView(ref, { once: true, amount: 0.6 });
  const [mostrado, setMostrado] = useState(reduce ? valor : 0);

  useEffect(() => {
    if (reduce) {
      setMostrado(valor);
      return;
    }
    if (!enVista) return;
    const controles = animate(0, valor, {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setMostrado(v),
    });
    return () => controles.stop();
  }, [enVista, reduce, valor]);

  return <span ref={ref}>{formatear(Math.round(mostrado))}</span>;
}

const TABS = [
  { href: '/inicio', label: 'Inicio', icon: Home },
  { href: '/progreso', label: 'Progreso', icon: TrendingUp },
  { href: '/perfil', label: 'Perfil', icon: User },
] as const;

/* ── <BottomNav> — navegación de 3 secciones, siempre al fondo (min-h-dvh, no min-h-full). ── */
export function BottomNav({ activo }: { activo: 'inicio' | 'progreso' | 'perfil' }) {
  return (
    <nav className="sticky bottom-0 z-10 flex items-center justify-around border-t border-[color-mix(in_oklab,var(--text-tertiary)_15%,transparent)] bg-[var(--surface)] pb-[max(8px,env(safe-area-inset-bottom))] pt-2">
      {TABS.map((tab) => {
        const esActivo = tab.href === `/${activo}`;
        const Icono = tab.icon;
        return (
          <motion.a
            key={tab.href}
            href={tab.href}
            whileTap={{ scale: 0.92 }}
            className="flex min-w-[64px] flex-col items-center gap-1 rounded-[12px] px-3 py-1.5 [touch-action:manipulation]"
          >
            <span
              className={`flex size-9 items-center justify-center rounded-full ${esActivo ? 'bg-[color-mix(in_oklab,var(--accent)_14%,transparent)]' : ''}`}
            >
              <Icono size={20} strokeWidth={esActivo ? 2.5 : 2} color={esActivo ? 'var(--accent)' : 'var(--text-tertiary)'} aria-hidden="true" />
            </span>
            <span className={`text-xs font-medium ${esActivo ? 'text-[var(--accent)]' : 'text-[var(--text-tertiary)]'}`}>{tab.label}</span>
          </motion.a>
        );
      })}
    </nav>
  );
}

/* ── <BarraPresupuestoDia> — dato héroe + barra que se llena al cargar (17-VISUALIZACION-DATOS). ── */
export function BarraPresupuestoDia({ gastado, limite, formatear }: { gastado: number; limite: number; formatear: (v: number) => string }) {
  const reduce = useReducedMotion();
  const pct = limite > 0 ? Math.min(100, Math.round((gastado / limite) * 100)) : 0;
  const pasado = gastado > limite;
  return (
    <Hairline surface="surface" className="shadow-[var(--shadow-1)]">
      <div className="p-4">
        <span className="text-xs text-[var(--text-secondary)]">Llevas hoy</span>
        {/* Sin font-family display (Fredoka): esa fuente no tiene el glifo del colón (₡,
            U+20A1) y lo renderiza roto como "Ø" — bug real confirmado contra FilaGasto,
            que sí muestra el símbolo bien porque hereda la fuente de cuerpo (Nunito).
            Tamaño 42px: el tier "display" exacto de FICHA-ARTE.md (display 42px / title
            25px) para el número que más importa de la pantalla principal. */}
        <div className={`text-[42px] font-bold leading-tight tabular-nums ${pasado ? 'text-[var(--error)]' : 'text-[var(--text-primary)]'}`}>
          <MontoAnimado valor={gastado} formatear={formatear} />
        </div>
        <div className="text-xs font-medium text-[var(--text-tertiary)]">de {formatear(limite)}</div>
        <div
          role="progressbar"
          aria-label="Gastado hoy respecto al límite diario"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          className="mt-3 h-2.5 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--accent)_12%,transparent)]"
        >
          <motion.div
            className={`h-full rounded-full ${pasado ? 'bg-[var(--error)]' : 'bg-[var(--accent)]'}`}
            initial={reduce ? false : { width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: reduce ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>
    </Hairline>
  );
}

/* ── <ChipCategoria> — grilla de categorías (icono + label), no lista vertical: 10+
   categorías reales de la app (FICHA-ARTE.md) no caben como chips full-width sin
   scroll (gate de carga cognitiva, 14). flex-wrap (no CSS grid, que estiraría un
   chip huérfano a lo ancho cuando el total no es múltiplo de 3) + ancho intrínseco
   con un mínimo (no un ancho fijo igual para todos — desencaje real, 7ª revisión:
   labels cortos con hueco vacío, labels largos partidos en 2 líneas). ── */
export function ChipCategoria({
  icon: Icono,
  label,
  seleccionado,
  onClick,
  indice = 0,
}: {
  icon: LucideIcon;
  label: string;
  seleccionado: boolean;
  onClick: () => void;
  indice?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      type="button"
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: reduce ? 0 : indice * 0.04 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      aria-pressed={seleccionado}
      className={`flex w-fit min-w-[88px] flex-col items-center gap-1.5 rounded-[var(--radius-button)] border px-3 py-3 [touch-action:manipulation] ${
        seleccionado
          ? 'border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)]'
          : 'border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)] bg-[var(--surface)]'
      }`}
    >
      <Icono size={20} strokeWidth={2} color={seleccionado ? 'var(--accent)' : 'var(--text-secondary)'} aria-hidden="true" />
      <span className={`whitespace-nowrap text-center text-xs font-medium leading-tight ${seleccionado ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}>
        {label}
      </span>
    </motion.button>
  );
}

/* ── <FilaGasto> — 1 renglón del historial de hoy (icono de categoría + monto + hora).
   `onEliminar` (opcional): un error de monto/categoría debe poder corregirse — sin esto
   un gasto mal anotado quedaba pegado para siempre (defecto real de la 1ª revisión). ── */
export function FilaGasto({
  icon: Icono,
  categoria,
  monto,
  hora,
  tipo,
  indice = 0,
  onEditar,
  onEliminar,
}: {
  icon: LucideIcon;
  categoria: string;
  monto: string;
  hora: string;
  /** Fijo (mes) vs libre (día) — explica por qué algunos gastos no mueven el dato héroe
   * de Inicio, que es solo sobre la bolsa libre (ver "Dos presupuestos" en lib/datosApp.ts). */
  tipo?: 'fijo' | 'libre';
  indice?: number;
  /** Tocar la fila reabre el formulario prellenado — corrige un error de dígito sin
   * borrar y re-crear desde cero (defecto real de la 2ª revisión). */
  onEditar?: () => void;
  onEliminar?: () => void;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? undefined : { opacity: 0, x: -20 }}
      transition={{ duration: 0.2, delay: reduce ? 0 : indice * 0.05 }}
      className="flex items-center gap-3 rounded-[var(--radius-button)] bg-[var(--surface-2)] px-3 py-2.5"
    >
      <motion.button
        type="button"
        whileTap={onEditar ? { scale: 0.97 } : undefined}
        onClick={onEditar}
        disabled={!onEditar}
        className="flex min-w-0 flex-1 items-center gap-3 text-left [touch-action:manipulation]"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_12%,transparent)]">
          <Icono size={16} strokeWidth={2} color="var(--accent)" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold text-[var(--text-primary)]">{categoria}</p>
          <p className="text-xs text-[var(--text-tertiary)]">
            {hora}
            {tipo && <> · {tipo === 'fijo' ? 'Fijo' : 'Libre'}</>}
          </p>
        </div>
        <span className="shrink-0 text-[15px] font-bold tabular-nums text-[var(--text-primary)]">{monto}</span>
        {/* Señal visual de que la fila se puede editar (no solo el ícono de basura,
            que sugiere borrar, no editar) — defecto real de descubribilidad, 11ª revisión. */}
        {onEditar && <Pencil size={12} className="shrink-0 text-[var(--text-tertiary)]" aria-hidden="true" />}
      </motion.button>
      {onEliminar && (
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={onEliminar}
          aria-label={`Eliminar gasto de ${categoria}`}
          className="flex size-11 shrink-0 items-center justify-center text-[var(--text-tertiary)] [touch-action:manipulation]"
        >
          <Trash2 size={15} aria-hidden="true" />
        </motion.button>
      )}
    </motion.div>
  );
}

/* ── <ChipRacha> — racha diaria en el header, dato héroe pequeño (llama = constancia). ── */
export function ChipRacha({ dias, icon: Icono }: { dias: number; icon: LucideIcon }) {
  return (
    <span
      role="img"
      aria-label={`Racha de ${dias} ${dias === 1 ? 'día' : 'días'}`}
      className="flex items-center gap-1.5 rounded-full bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] px-3 py-1.5"
    >
      <Icono size={15} color="var(--accent)" aria-hidden="true" />
      <span className="text-xs font-bold tabular-nums text-[var(--accent)]" aria-hidden="true">{dias}</span>
    </span>
  );
}

/* ── <SeccionVacia> — empty state con mensaje + CTA (nunca "No hay datos", 15). ── */
export function SeccionVacia({ icon: Icono, titulo, cuerpo, children }: { icon: LucideIcon; titulo: string; cuerpo: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-10 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_10%,transparent)]">
        <Icono size={24} color="var(--accent)" aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-balance text-[25px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">{titulo}</h2>
      <p className="mt-2 max-w-[32ch] text-[15px] text-[var(--text-secondary)]">{cuerpo}</p>
      {children && <div className="mt-4 w-full">{children}</div>}
    </div>
  );
}
