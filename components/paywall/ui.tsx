'use client';

// KIT DEL PAYWALL — piezas compartidas de las 3 pantallas de la secuencia
// (recap → timeline del trial → precio). Blueprint: 50-DISENO-ONBOARDING-PAYWALL.md §C.
// Reusa los mismos tokens/componentes que landing y onboarding — misma identidad,
// un solo sistema visual en toda la app.

import { type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Check, X, type LucideIcon } from 'lucide-react';
import { Hairline } from '@/components/landing/ui';

/* ── <CerrarPaywall> — X 44x44px, SIEMPRE visible desde el frame 1 (C2: nunca oculta,
   nunca con delay — es ley, no un detalle de UX). El primer tap cierra, sin segunda modal. ── */
export function CerrarPaywall({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Cerrar"
      className="flex size-11 shrink-0 items-center justify-center text-[var(--text-secondary)] [touch-action:manipulation]"
    >
      <X size={20} aria-hidden="true" />
    </button>
  );
}

/* ── <FilaRecap> — una respuesta REAL del usuario (nunca genérica), en la pantalla 1.
   Fondo hundido (surface-2) — es un dato ya guardado, no un campo editable. ── */
export function FilaRecap({ icon: Icono, label, valor }: { icon: LucideIcon; label: string; valor: string }) {
  return (
    <div className="flex items-start gap-3 rounded-[var(--radius-button)] bg-[var(--surface-2)] px-4 py-3">
      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_12%,transparent)]">
        <Icono size={18} strokeWidth={2} color="var(--accent)" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-[var(--text-tertiary)]">{label}</p>
        <p className="text-[15px] font-semibold leading-snug text-[var(--text-primary)]">{valor}</p>
      </div>
    </div>
  );
}

/* ── <CheckItem> — checkmark custom (círculo acento 12% + Check SVG), NUNCA el ✓ del
   sistema ni emoji (regla dura del 55, C2 variante d). ── */
export function CheckItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-center gap-3 text-[15px] text-[var(--text-primary)]">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_14%,transparent)]">
        <Check size={14} strokeWidth={3} color="var(--accent)" aria-hidden="true" />
      </span>
      {children}
    </li>
  );
}

/* ── <NodoTimeline> — 1 de los 3 nodos del timeline del trial (C4). La línea se dibuja
   de arriba a abajo al entrar; nodo "hecho"/"activo" FILL acento, "pendiente" outline. ── */
export function NodoTimeline({
  estado,
  titulo,
  caption,
  ultimo = false,
}: {
  estado: 'hecho' | 'pendiente';
  titulo: string;
  caption: string;
  ultimo?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <span
          className={`size-3 shrink-0 rounded-full ${estado === 'hecho' ? 'bg-[var(--accent)]' : 'border-2 border-[var(--accent)] bg-transparent'}`}
          aria-hidden="true"
        />
        {!ultimo && (
          <motion.span
            className="mt-1 w-0.5 flex-1 bg-[color-mix(in_oklab,var(--accent)_35%,transparent)]"
            initial={reduce ? false : { scaleY: 0 }}
            animate={{ scaleY: 1 }}
            style={{ transformOrigin: 'top', minHeight: 40 }}
            transition={{ duration: reduce ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
      </div>
      <div className={ultimo ? '' : 'pb-6'}>
        <p className="text-[15px] font-semibold text-[var(--text-primary)]">{titulo}</p>
        <p className="mt-0.5 text-[13px] text-[var(--text-secondary)]">{caption}</p>
      </div>
    </div>
  );
}

/* ── <PlanCard> — card tocable de plan (C2 §4): recomendado PRE-SELECCIONADO, badge
   compite en peso visual con el CTA (el ahorro es el elemento más ruidoso de la pantalla). ── */
export function PlanCard({
  nombre,
  precioMes,
  detalle,
  badge,
  seleccionado,
  onClick,
}: {
  nombre: string;
  precioMes: string;
  detalle: string;
  badge?: string;
  seleccionado: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={seleccionado}
      className={`relative flex w-full flex-col rounded-[var(--radius-card)] border px-4 py-3.5 text-left transition-colors duration-150 [touch-action:manipulation] ${
        seleccionado
          ? 'border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_7%,transparent)]'
          : 'border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--surface)]'
      }`}
      style={{ borderWidth: seleccionado ? 2 : 1 }}
    >
      {badge && (
        <span className="absolute -top-2.5 left-4 rounded-full bg-[var(--accent)] px-2 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--bg)]">
          {badge}
        </span>
      )}
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[15px] font-semibold text-[var(--text-primary)]">{nombre}</span>
        <span className="text-[22px] font-bold tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">
          {precioMes}
          <span className="text-[13px] font-medium text-[var(--text-secondary)]">/mes</span>
        </span>
      </div>
      <p className="mt-1 text-[13px] text-[var(--text-secondary)]">{detalle}</p>
    </button>
  );
}
