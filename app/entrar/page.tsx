'use client';

// Pantalla de login de CashPet — último paso del funnel, después del paywall (nunca antes,
// ver docs/sistema/50-DISENO-ONBOARDING-PAYWALL.md §E). Sin contraseñas: magic link por email
// (decisión de auth en ESTADO.md → Decisiones técnicas). Supabase Auth aún no está conectado
// (Sesión 6): el envío es un mock honesto con estados diseñados (enviando/enviado), sin fingir
// un error de backend que no existe todavía — solo se valida el formato del correo en el cliente,
// que sí es una validación real.

import { useEffect, useState, type FormEvent } from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { AlertCircle, ChevronLeft, Loader2, Lock } from 'lucide-react';
import { Accent, CtaButton, Hairline } from '@/components/landing/ui';
import { Mascota } from '@/components/Mascota';

const REENVIO_SEGUNDOS = 60;

const CONTENEDOR: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const ITEM: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
};

export default function EntrarPage() {
  const reduce = useReducedMotion();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [estado, setEstado] = useState<'idle' | 'enviando' | 'enviado'>('idle');
  const [segundosRestantes, setSegundosRestantes] = useState(0);
  const [reenviando, setReenviando] = useState(false);
  const [reenviado, setReenviado] = useState(false);

  useEffect(() => {
    if (segundosRestantes <= 0) return;
    const t = setTimeout(() => setSegundosRestantes((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [segundosRestantes]);

  const enviarEnlace = (e: FormEvent) => {
    e.preventDefault();
    if (estado === 'enviando') return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Escribe un correo válido');
      return;
    }
    setError(null);
    setEstado('enviando');
    setTimeout(() => {
      setEstado('enviado');
      setSegundosRestantes(REENVIO_SEGUNDOS);
    }, 1000);
  };

  return (
    <div className="flex min-h-dvh flex-col bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(600px 360px at 15% 0%, color-mix(in oklab, var(--accent) 8%, transparent) 0%, transparent 60%), ' +
            'radial-gradient(520px 420px at 100% 100%, color-mix(in oklab, var(--accent-2) 7%, transparent) 0%, transparent 55%)',
        }}
      />
      {/* Sin min-h-dvh acá: el div de afuera ya lo garantiza (ver app/(interna)/layout.tsx
          para el detalle del defecto real que corrigió este mismo patrón redundante). */}
      <div className="relative flex flex-1 flex-col">
        <header className="flex items-center px-2 pt-3">
          <a
            href="/"
            aria-label="Volver al inicio"
            className="flex size-11 items-center justify-center rounded-full bg-[var(--surface-2)] text-[var(--text-secondary)]"
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </a>
        </header>

        <div className="flex flex-1 flex-col justify-center px-6 pb-16">
          {estado !== 'enviado' ? (
            <motion.div
              variants={reduce ? undefined : CONTENEDOR}
              initial={reduce ? false : 'hidden'}
              animate="visible"
            >
              <motion.div variants={reduce ? undefined : ITEM}>
                <Mascota size={88} emocion="feliz" />
              </motion.div>
              <motion.h1
                variants={reduce ? undefined : ITEM}
                className="mt-4 text-balance text-[28px] font-bold leading-[1.15] [font-family:var(--font-display)]"
              >
                Entra a tu <Accent>plan</Accent>
              </motion.h1>
              <motion.p variants={reduce ? undefined : ITEM} className="mt-2 text-sm text-[var(--text-secondary)]">
                Para guardarlo y verlo en cualquier dispositivo.
              </motion.p>

              <motion.form variants={reduce ? undefined : ITEM} onSubmit={enviarEnlace} noValidate className="mt-8">
                <Hairline surface="surface" emphasis className="shadow-[var(--shadow-1)]">
                  <div className="flex flex-col gap-3 p-3">
                    <label htmlFor="correo" className="text-xs font-medium text-[var(--text-tertiary)]">
                      Correo electrónico
                    </label>
                    <input
                      id="correo"
                      type="email"
                      autoFocus
                      autoComplete="email"
                      inputMode="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder="tu@correo.com"
                      aria-invalid={!!error}
                      aria-describedby={error ? 'correo-error' : undefined}
                      className={`-mt-2 h-14 w-full rounded-[var(--radius-button)] border bg-[var(--surface-2)] px-4 text-base text-[var(--text-primary)] shadow-[inset_0_1px_2px_color-mix(in_oklab,var(--text-primary)_10%,transparent)] outline-none focus:bg-[var(--surface)] ${
                        error
                          ? 'border-[var(--error)] focus:border-[var(--error)]'
                          : 'border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] focus:border-[var(--accent)]'
                      }`}
                    />
                    {error && (
                      <p id="correo-error" role="alert" className="flex items-center gap-1.5 text-sm font-medium text-[var(--error)]">
                        <AlertCircle size={15} aria-hidden="true" />
                        {error} (ej. tu@correo.com)
                      </p>
                    )}

                    <div className={estado === 'enviando' ? 'pointer-events-none opacity-70' : ''}>
                      <CtaButton href="#" alto={56} submit>
                        <span className="inline-flex items-center gap-2 text-base">
                          {estado === 'enviando' && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
                          {estado === 'enviando' ? 'Enviando…' : 'Enviarme mi enlace de acceso'}
                        </span>
                      </CtaButton>
                    </div>
                  </div>
                </Hairline>
              </motion.form>

              <motion.p
                variants={reduce ? undefined : ITEM}
                className="mt-4 flex items-center gap-2 text-sm text-[var(--text-secondary)]"
              >
                <Lock size={14} aria-hidden="true" />
                Sin contraseñas: te llegará un enlace de un solo uso.
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center text-center"
            >
              <Mascota size={80} emocion="feliz" />
              <h1 className="mt-5 text-balance text-[28px] font-bold leading-[1.15] [font-family:var(--font-display)]">
                Revisa tu correo
              </h1>

              <Hairline surface="surface" emphasis className="mt-4 shadow-[var(--shadow-1)]">
                <div className="px-4 py-3">
                  <p className="text-sm text-[var(--text-secondary)]">
                    Te enviamos el enlace a <span className="font-semibold text-[var(--text-primary)]">{email}</span>
                  </p>
                  <p className="mt-2 text-xs text-[var(--text-tertiary)]">¿No lo ves? Revisa spam o promociones.</p>
                </div>
              </Hairline>

              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                disabled={segundosRestantes > 0 || reenviando}
                onClick={() => {
                  setReenviando(true);
                  setTimeout(() => {
                    setReenviando(false);
                    setReenviado(true);
                    setSegundosRestantes(REENVIO_SEGUNDOS);
                    setTimeout(() => setReenviado(false), 3000);
                  }, 1000);
                }}
                className="mt-8 h-11 px-2 text-sm font-medium text-[var(--accent)] disabled:text-[var(--text-tertiary)] [touch-action:manipulation]"
              >
                {reenviando
                  ? 'Reenviando…'
                  : reenviado
                    ? 'Enlace reenviado ✓'
                    : segundosRestantes > 0
                      ? `Reenviar en ${segundosRestantes}s`
                      : 'Reenviar enlace'}
              </motion.button>

              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setEstado('idle');
                  setSegundosRestantes(0);
                }}
                className="mt-2 h-11 px-2 text-sm text-[var(--text-tertiary)] underline-offset-2 hover:underline [touch-action:manipulation]"
              >
                ¿Correo equivocado? Cambiarlo
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
