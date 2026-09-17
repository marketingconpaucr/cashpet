'use client';

// KIT DE ONBOARDING — piezas compartidas de las pantallas de pregunta, reconocimiento
// y compromiso (blueprint: 50-DISENO-ONBOARDING-PAYWALL.md §A). Consume los mismos
// tokens globales que la landing (components/landing/tokens.css, importado en
// app/globals.css) — misma identidad, un solo componente de mascota.

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Check, ChevronLeft } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { CtaButton } from '@/components/landing/ui';

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

/* ── <ChipOpcion> — selección única: tap → check inmediato → auto-avanza (250-400ms) ── */
export function ChipOpcion({
  label,
  icon: Icono,
  seleccionado,
  onClick,
}: {
  label: string;
  icon?: LucideIcon;
  seleccionado: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      aria-pressed={seleccionado}
      className={`flex h-14 w-full items-center gap-3 rounded-[var(--radius-button)] border px-4 text-left text-base font-medium transition-colors duration-150 [touch-action:manipulation] ${
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
  tituloMarked: string;
  subcopy?: string;
  children: ReactNode;
  /** CTA fijo abajo — solo para selección múltiple o input libre (nunca en selección única). */
  ctaFijo?: ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col px-4 pt-6">
      <h1 className="text-balance text-[28px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
        {tituloMarked}
      </h1>
      {subcopy && <p className="mt-2 text-sm text-[var(--text-secondary)]">{subcopy}</p>}
      <div className="mt-8 flex flex-col gap-3">{children}</div>
      {ctaFijo && <div className="mt-auto pt-8 pb-[max(16px,env(safe-area-inset-bottom))]">{ctaFijo}</div>}
    </div>
  );
}

/* ── <PantallaReconocimiento> — recompensa entre bloques de preguntas (A5), CERO decisiones ── */
export function PantallaReconocimiento({
  icon: Icono,
  tituloMarked,
  cuerpo,
  ctaLabel = 'Continuar',
  onContinuar,
}: {
  icon: LucideIcon;
  tituloMarked: string;
  cuerpo: string;
  ctaLabel?: string;
  onContinuar: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
      <span
        aria-hidden="true"
        className="flex size-16 items-center justify-center rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_22%,transparent)] bg-[var(--chip-bg)]"
      >
        <Icono size={30} strokeWidth={1.8} color="var(--accent)" aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-balance text-2xl font-bold leading-tight text-[var(--text-primary)] [font-family:var(--font-display)]">
        {tituloMarked}
      </h2>
      <p className="mt-3 max-w-[38ch] text-[15px] leading-relaxed text-[var(--text-secondary)]">{cuerpo}</p>
      <div className="mt-8 w-full pb-[max(16px,env(safe-area-inset-bottom))]">
        <CtaButton href="#" alto={56}>
          <span onClick={(e) => { e.preventDefault(); onContinuar(); }}>{ctaLabel}</span>
        </CtaButton>
      </div>
    </div>
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
  tituloMarked: string;
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
    <div className="flex flex-1 flex-col px-4 pt-6">
      <h1 className="text-balance text-[28px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
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
        className="mt-8 h-2 w-full appearance-none rounded-full bg-[color-mix(in_oklab,var(--accent)_18%,transparent)] accent-[var(--accent)]"
        aria-label="Presupuesto máximo por día"
      />
      <div className="mt-2 flex justify-between text-xs text-[var(--text-tertiary)]">
        <span>{formatear(min)}</span>
        <span>{formatear(max)}</span>
      </div>
      <p className="mt-4 text-center text-sm font-medium text-[var(--accent)]">{feedback}</p>
      <div className="mt-auto pt-8 pb-[max(16px,env(safe-area-inset-bottom))]">
        <CtaButton href="#" alto={56}>
          <span onClick={(e) => { e.preventDefault(); onFijar(); }}>Fijar mi límite</span>
        </CtaButton>
      </div>
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
