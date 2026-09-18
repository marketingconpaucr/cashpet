'use client';

// Pantalla de login de CashPet — último paso del funnel, después del paywall (nunca antes,
// ver docs/sistema/50-DISENO-ONBOARDING-PAYWALL.md §E). Sin contraseñas: magic link por email
// (decisión de auth en ESTADO.md → Decisiones técnicas). Supabase Auth aún no está conectado
// (Sesión 6): el envío es un mock honesto con estados diseñados (enviando/enviado), sin fingir
// un error de backend que no existe todavía — solo se valida el formato del correo en el cliente,
// que sí es una validación real.

import { useEffect, useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail } from 'lucide-react';
import { Accent, CtaButton } from '@/components/landing/ui';
import { Mascota } from '@/components/Mascota';

const REENVIO_SEGUNDOS = 60;

export default function EntrarPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [estado, setEstado] = useState<'idle' | 'enviando' | 'enviado'>('idle');
  const [segundosRestantes, setSegundosRestantes] = useState(0);

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
    }, 700);
  };

  return (
    <div className="flex min-h-dvh flex-col bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(600px 360px at 15% 0%, color-mix(in oklab, var(--accent) 10%, transparent) 0%, transparent 60%), ' +
            'radial-gradient(520px 420px at 100% 100%, color-mix(in oklab, var(--accent-2) 8%, transparent) 0%, transparent 55%)',
        }}
      />
      <div className="relative flex min-h-dvh flex-1 flex-col">
        <header className="flex items-center px-4 pt-3">
          <a href="/" aria-label="Volver al inicio" className="flex size-11 items-center justify-center">
            <span aria-hidden="true" className="size-6 rounded-lg bg-[var(--accent)]" />
          </a>
        </header>

        <div className="flex flex-1 flex-col justify-center px-6 pb-16">
          {estado !== 'enviado' ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Mascota size={72} emocion="feliz" />
              <h1 className="mt-4 text-balance text-[28px] font-bold leading-[1.15] [font-family:var(--font-display)]">
                Entra a tu <Accent>plan</Accent>
              </h1>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Para guardarlo y verlo en cualquier dispositivo.
              </p>

              <form onSubmit={enviarEnlace} className="mt-8 flex flex-col gap-3">
                <input
                  type="email"
                  autoFocus
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  aria-label="Correo electrónico"
                  className="h-14 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--surface-2)] px-4 text-base text-[var(--text-primary)] shadow-[inset_0_1px_2px_color-mix(in_oklab,var(--text-primary)_10%,transparent)] outline-none focus:border-[var(--accent)] focus:bg-[var(--surface)]"
                />
                {error && <p className="text-sm font-medium text-[var(--accent)]">{error}</p>}

                <CtaButton href="#" alto={56} onClick={enviarEnlace}>
                  {estado === 'enviando' ? 'Enviando…' : 'Enviarme mi enlace de acceso'}
                </CtaButton>
              </form>

              <p className="mt-4 flex items-center gap-2 text-[13px] text-[var(--text-secondary)]">
                <Lock size={14} aria-hidden="true" />
                Sin contraseñas: te llegará un enlace de un solo uso.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center text-center"
            >
              <span className="flex size-16 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_12%,transparent)]">
                <Mail size={28} color="var(--accent)" aria-hidden="true" />
              </span>
              <h1 className="mt-5 text-balance text-[26px] font-bold leading-[1.15] [font-family:var(--font-display)]">
                Revisa tu correo
              </h1>
              <p className="mt-2 max-w-[32ch] text-sm text-[var(--text-secondary)]">
                Te enviamos el enlace a <span className="font-semibold text-[var(--text-primary)]">{email}</span>
              </p>

              <button
                type="button"
                disabled={segundosRestantes > 0}
                onClick={() => {
                  setEstado('enviando');
                  setTimeout(() => {
                    setEstado('enviado');
                    setSegundosRestantes(REENVIO_SEGUNDOS);
                  }, 700);
                }}
                className="mt-8 h-11 px-2 text-sm font-medium text-[var(--accent)] disabled:text-[var(--text-tertiary)] [touch-action:manipulation]"
              >
                {segundosRestantes > 0 ? `Reenviar en ${segundosRestantes}s` : 'Reenviar enlace'}
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
