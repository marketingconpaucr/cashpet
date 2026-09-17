'use client';

// KIT DE ONBOARDING — piezas compartidas de las pantallas de pregunta, reconocimiento
// y compromiso (blueprint: 50-DISENO-ONBOARDING-PAYWALL.md §A). Consume los mismos
// tokens globales que la landing (components/landing/tokens.css, importado en
// app/globals.css) — misma identidad, un solo componente de mascota.

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Check, ChevronLeft } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Accent, CtaButton, Hairline } from '@/components/landing/ui';
import { Mascota, type EmocionMascota } from '@/components/Mascota';

/* ── <BarraProgreso> — línea fina 2px, % real, ENDOWED PROGRESS (nunca arranca en 0%) ── */
export function BarraProgreso({ porcentaje }: { porcentaje: number }) {
  const reduce = useReducedMotion();
  return (
    <div className="h-0.5 flex-1 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--text-tertiary)_18%,transparent)]">
      <motion.div
        className="h-full rounded-full bg-[var(--accent)]"
        initial={false}
        animate={{ width: `${porcentaje}%` }}
        transition={{ duration: reduce ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}

/* ── <EncabezadoOnboarding> — atrás (44px táctil) + barra + logo/nombre, siempre visibles ── */
export function EncabezadoOnboarding({
  porcentaje,
  onAtras,
  mostrarAtras,
}: {
  porcentaje: number;
  onAtras?: () => void;
  mostrarAtras: boolean;
}) {
  return (
    <header className="flex items-center gap-3 px-4 pt-3">
      {mostrarAtras ? (
        <button
          type="button"
          onClick={onAtras}
          aria-label="Atrás"
          className="flex size-11 shrink-0 items-center justify-center text-[var(--text-secondary)] [touch-action:manipulation]"
        >
          <ChevronLeft size={22} aria-hidden="true" />
        </button>
      ) : (
        <a
          href="/"
          className="flex size-11 shrink-0 items-center justify-center"
          aria-label="Volver al inicio"
        >
          <span aria-hidden="true" className="size-6 rounded-lg bg-[var(--accent)]" />
        </a>
      )}
      <BarraProgreso porcentaje={porcentaje} />
    </header>
  );
}

/* ── <ChipOpcion> — selección única: tap → check inmediato → auto-avanza (250-400ms).
   `indice` (opcional) da el stagger de entrada de 50-80ms por ítem (baseline de movimiento). ── */
export function ChipOpcion({
  label,
  icon: Icono,
  seleccionado,
  onClick,
  indice = 0,
}: {
  label: string;
  icon?: LucideIcon;
  seleccionado: boolean;
  onClick: () => void;
  indice?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      type="button"
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: reduce ? 0 : indice * 0.06, ease: [0.16, 1, 0.3, 1] }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      aria-pressed={seleccionado}
      className={`flex h-14 w-full items-center gap-3 rounded-[var(--radius-button)] border px-4 text-left text-base font-medium shadow-[var(--shadow-1)] transition-colors duration-150 [touch-action:manipulation] ${
        seleccionado
          ? 'border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] text-[var(--text-primary)]'
          : 'border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--surface)] text-[var(--text-primary)]'
      }`}
      style={{ borderWidth: seleccionado ? 1.5 : 1 }}
    >
      {Icono && <Icono size={20} strokeWidth={2} color={seleccionado ? 'var(--accent)' : 'var(--text-secondary)'} aria-hidden="true" />}
      <span className="flex-1">{label}</span>
      <AnimatePresence>
        {seleccionado && (
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]"
          >
            <Check size={13} strokeWidth={3} color="var(--bg)" aria-hidden="true" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

/* ── useSeleccionUnica — tap → marca → pausa 300ms visible → avanza (bloquea doble-tap) ── */
export function useSeleccionUnica(onAvanzar: (valor: string) => void) {
  const [elegido, setElegido] = useState<string | null>(null);
  const elegir = (valor: string) => {
    if (elegido) return;
    setElegido(valor);
    setTimeout(() => onAvanzar(valor), 300);
  };
  return { elegido, elegir };
}

/* ── <PantallaPregunta> — layout A1/A2: título + subcopy opcional + opciones ── */
export function PantallaPregunta({
  tituloMarked,
  subcopy,
  children,
  ctaFijo,
}: {
  tituloMarked: ReactNode;
  subcopy?: string;
  children: ReactNode;
  /** CTA fijo abajo — solo para selección múltiple o input libre (nunca en selección única). */
  ctaFijo?: ReactNode;
}) {
  // Sin CTA fijo (selección única, auto-avanza) el bloque se centra verticalmente: con solo
  // 4-5 chips cortos, anclarlo arriba dejaba ~1/3 de la pantalla vacío (vacío muerto, 32).
  // Gastón chico arriba del título llena ese aire con identidad, no con relleno vacío.
  return (
    <div className={`flex flex-1 flex-col px-4 ${ctaFijo ? 'pt-6' : 'justify-center pb-16'}`}>
      <div>
        {!ctaFijo && <Mascota size={56} emocion="neutral" />}
        <h1 className={`text-balance text-[28px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)] ${!ctaFijo ? 'mt-4' : ''}`}>
          {tituloMarked}
        </h1>
        {subcopy && <p className="mt-2 text-sm text-[var(--text-secondary)]">{subcopy}</p>}
        <div className="mt-8 flex flex-col gap-3">{children}</div>
      </div>
      {ctaFijo && <div className="mt-auto pt-8 pb-[max(16px,env(safe-area-inset-bottom))]">{ctaFijo}</div>}
    </div>
  );
}

/* ── <PantallaReconocimiento> — recompensa entre bloques de preguntas (A5), CERO decisiones.
   La carga emocional es GASTÓN (con la emoción real que corresponde), nunca un ícono genérico
   solo — regla dura de 50-DISENO-ONBOARDING-PAYWALL.md §A5 ("prohibido el ícono duotone
   genérico como ÚNICA carga del momento de reconocimiento"). El "dato" opcional es el mini-
   visual con colores reales de la app que la misma regla exige cuando hay uno que mostrar. ── */
export function PantallaReconocimiento({
  emocion = 'feliz',
  tituloMarked,
  cuerpo,
  dato,
  ctaLabel = 'Continuar',
  onContinuar,
}: {
  emocion?: EmocionMascota;
  tituloMarked: ReactNode;
  cuerpo: string;
  /** Mini-visual con un dato REAL del usuario (ej. "3 de 5 categorías" con una barra) — opcional. */
  dato?: ReactNode;
  ctaLabel?: string;
  onContinuar: () => void;
}) {
  const reduce = useReducedMotion();
  // El reconocimiento "celebrando" es el único HITO real del recorrido (cierre del
  // diagnóstico) — se distingue del resto con un destello + entrada spring, nunca solo
  // el fade genérico que comparten las demás pantallas de reconocimiento.
  const esHito = emocion === 'celebrando';
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
      <div className="relative flex items-center justify-center">
        {esHito && !reduce && (
          <motion.span
            aria-hidden="true"
            className="absolute size-32 rounded-full"
            style={{ background: 'radial-gradient(circle, color-mix(in oklab, var(--accent) 35%, transparent) 0%, transparent 70%)' }}
            initial={{ scale: 0.4, opacity: 0.9 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
        <motion.div
          initial={esHito && !reduce ? { scale: 0.6, opacity: 0 } : false}
          animate={{ scale: 1, opacity: 1 }}
          transition={esHito ? { type: 'spring', stiffness: 260, damping: 14 } : undefined}
        >
          <Mascota size={esHito ? 96 : 84} emocion={emocion} />
        </motion.div>
      </div>
      <h2 className="mt-5 text-balance text-2xl font-bold leading-tight text-[var(--text-primary)] [font-family:var(--font-display)]">
        {tituloMarked}
      </h2>
      <p className="mt-3 max-w-[38ch] text-[15px] leading-relaxed text-[var(--text-secondary)]">{cuerpo}</p>
      {dato && <div className="mt-5 w-full">{dato}</div>}
      <div className="mt-8 w-full pb-[max(16px,env(safe-area-inset-bottom))]">
        <CtaButton href="#" alto={56}>
          <span onClick={(e) => { e.preventDefault(); onContinuar(); }}>{ctaLabel}</span>
        </CtaButton>
      </div>
    </div>
  );
}

/* ── <BarraMiniVisual> — mini-visual con colores reales del kit (dato cuantificado del
   usuario, ej. "3 de 6 categorías") — para el "dato" de PantallaReconocimiento (A5). ── */
export function BarraMiniVisual({ etiqueta, valor, total }: { etiqueta: string; valor: number; total: number }) {
  const pct = total > 0 ? Math.round((valor / total) * 100) : 0;
  return (
    <Hairline surface="surface" className="shadow-[var(--shadow-1)]">
      <div className="p-4">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-[var(--text-secondary)]">{etiqueta}</span>
          <span className="text-lg font-bold tabular-nums text-[var(--accent)]">
            {valor}/{total}
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--accent)_12%,transparent)]">
          <motion.div
            className="h-full rounded-full bg-[var(--accent)]"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          />
        </div>
      </div>
    </Hairline>
  );
}

/* ── <SliderCompromiso> — A6: el usuario FIJA un número que la app usa después ── */
export function SliderCompromiso({
  tituloMarked,
  valor,
  min,
  max,
  step,
  formatear,
  onCambiar,
  onFijar,
  feedback,
}: {
  tituloMarked: ReactNode;
  valor: number;
  min: number;
  max: number;
  step: number;
  formatear: (v: number) => string;
  onCambiar: (v: number) => void;
  onFijar: () => void;
  feedback: string;
}) {
  return (
    <div className="flex flex-1 flex-col justify-center px-4 pb-16">
      <Mascota size={56} emocion="neutral" />
      <h1 className="mt-4 text-balance text-[28px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
        {tituloMarked}
      </h1>
      <div className="mt-10 flex flex-col items-center">
        <p className="text-[44px] font-bold leading-none tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">
          {formatear(valor)}
        </p>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">al día</p>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={valor}
        onChange={(e) => onCambiar(Number(e.target.value))}
        className="mt-8 h-2 w-full appearance-none rounded-full bg-[color-mix(in_oklab,var(--accent)_18%,transparent)] shadow-[inset_0_1px_2px_color-mix(in_oklab,var(--text-primary)_15%,transparent)] accent-[var(--accent)]"
        aria-label="Presupuesto máximo por día"
      />
      <div className="mt-2 flex justify-between text-xs text-[var(--text-tertiary)]">
        <span>{formatear(min)}</span>
        <span>{formatear(max)}</span>
      </div>
      <p className="mt-4 text-center text-sm font-medium text-[var(--accent)]">{feedback}</p>
      <div className="mt-10 pb-[max(16px,env(safe-area-inset-bottom))]">
        <CtaButton href="#" alto={56}>
          <span onClick={(e) => { e.preventDefault(); onFijar(); }}>Fijar mi límite</span>
        </CtaButton>
      </div>
    </div>
  );
}

const RADIO_ANILLO = 44;
const CIRCUNFERENCIA = 2 * Math.PI * RADIO_ANILLO;

/* ── <PantallaLoading> — B1/B2: el argumento de apertura del paywall (patrón Noom/Labor
   Illusion), NUNCA un spinner. Anillo con % real + 3-5 líneas que aparecen una a una con
   DATOS REALES del usuario, check custom (nunca "✓" de sistema), aria-live/aria-busy. ── */
export function PantallaLoading({
  titulo,
  lineas,
  duracionMs = 4200,
  onCompletar,
}: {
  titulo: ReactNode;
  lineas: string[];
  duracionMs?: number;
  onCompletar: () => void;
}) {
  const reduce = useReducedMotion();
  const [activaIdx, setActivaIdx] = useState(-1);
  const [porcentaje, setPorcentaje] = useState(8);

  useEffect(() => {
    if (reduce) {
      setActivaIdx(lineas.length);
      setPorcentaje(100);
      const done = setTimeout(onCompletar, 600);
      return () => clearTimeout(done);
    }
    const pasoMs = duracionMs / lineas.length;
    const timers = lineas.map((_, i) =>
      setTimeout(() => {
        setActivaIdx(i);
        setPorcentaje(Math.round(8 + (92 * (i + 1)) / lineas.length));
      }, pasoMs * i)
    );
    // El último ítem queda "activo" (pulsando) hasta este punto — sin este paso nunca
    // llega a mostrar su check de completado antes de navegar al paywall.
    const completar = setTimeout(() => {
      setActivaIdx(lineas.length);
      setPorcentaje(100);
    }, Math.max(duracionMs - 400, pasoMs * (lineas.length - 1) + 300));
    const done = setTimeout(onCompletar, duracionMs + 400);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(completar);
      clearTimeout(done);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="flex flex-1 flex-col items-center justify-center px-6 text-center"
      role="status"
      aria-live="polite"
      aria-busy={porcentaje < 100}
    >
      <div className="relative flex size-28 items-center justify-center">
        <svg width="112" height="112" viewBox="0 0 100 100" className="-rotate-90">
          <circle cx="50" cy="50" r={RADIO_ANILLO} fill="none" stroke="color-mix(in oklab, var(--accent) 15%, transparent)" strokeWidth="8" />
          <motion.circle
            cx="50"
            cy="50"
            r={RADIO_ANILLO}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={CIRCUNFERENCIA}
            animate={{ strokeDashoffset: CIRCUNFERENCIA * (1 - porcentaje / 100) }}
            transition={{ duration: reduce ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <span className="absolute text-2xl font-bold tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">
          {porcentaje}%
        </span>
      </div>
      <h2 className="mt-5 text-balance text-2xl font-bold leading-tight text-[var(--text-primary)] [font-family:var(--font-display)]">
        {titulo}
      </h2>
      <ul className="mt-6 flex w-full flex-col gap-3 text-left">
        {lineas.map((linea, i) => {
          const completada = i < activaIdx || (reduce && porcentaje === 100);
          const activa = i === activaIdx && !completada;
          return (
            <motion.li
              key={linea}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: i <= activaIdx || reduce ? 1 : 0.4, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3 text-[15px] text-[var(--text-primary)]"
            >
              {completada ? (
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]">
                  <Check size={12} strokeWidth={3} color="var(--bg)" aria-hidden="true" />
                </span>
              ) : activa ? (
                <motion.span
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="size-5 shrink-0 rounded-full bg-[var(--accent)]"
                  aria-hidden="true"
                />
              ) : (
                <span className="size-5 shrink-0 rounded-full border-2 border-[color-mix(in_oklab,var(--text-tertiary)_35%,transparent)]" aria-hidden="true" />
              )}
              <span>{linea}</span>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}

/* ── <TransicionPaso> — envuelve cada pantalla: sale -24px/fade, entra +40px/fade (A4) ── */
export function TransicionPaso({ pasoKey, children }: { pasoKey: string; children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pasoKey}
        initial={reduce ? { opacity: 0 } : { opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, x: -24 }}
        transition={{ duration: reduce ? 0.15 : 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-1 flex-col"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
