'use client';

// Paywall de CashPet — secuencia de 3 pantallas (recap → timeline del trial → precio),
// +37% de conversión vs una sola página (Superwall 2026, ver 50-DISENO-ONBOARDING-PAYWALL.md
// §C0). Lee las respuestas REALES del onboarding desde localStorage — nada de esto se muestra
// si el usuario llegó sin pasar por /onboarding (mockup honesto, sin datos inventados).
// Hotmart aún no está conectado (Sesión 6): el CTA final navega a /entrar, no procesa un cobro.

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Calendar, ChevronLeft, Lock, MapPin, ShieldCheck, Tag, Wallet } from 'lucide-react';
import { Accent, CtaButton, Hairline } from '@/components/landing/ui';
import { Mascota } from '@/components/Mascota';
import { BarraProgreso, TransicionPaso } from '@/components/onboarding/ui';
import { CerrarPaywall, CheckItem, FilaRecap, NodoTimeline, PlanCard } from '@/components/paywall/ui';

interface DatosOnboarding {
  pais: string;
  moneda: string;
  dolor: string;
  categorias: string[];
  momento: string;
  presupuestoDiario: number;
  gastoPrueba: { monto: number; categoria: string };
}

// Mismo mapa moneda→locale que app/onboarding/page.tsx (PAISES) — 'es' a secas pierde el
// símbolo real y agrupa mal los miles (ver ESTADO.md → Decisiones técnicas).
const LOCALE_POR_MONEDA: Record<string, string> = {
  MXN: 'es-MX',
  COP: 'es-CO',
  ARS: 'es-AR',
  CLP: 'es-CL',
  PEN: 'es-PE',
  CRC: 'es-CR',
  GTQ: 'es-GT',
  DOP: 'es-DO',
};

function formatoMoneda(v: number, moneda: string): string {
  const locale = LOCALE_POR_MONEDA[moneda] ?? 'es';
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: moneda, maximumFractionDigits: 0 }).format(v);
  } catch {
    return `${moneda} ${v}`;
  }
}

const PASOS = ['recap', 'timeline', 'precio'] as const;
type Paso = (typeof PASOS)[number];

// Endowed progress (A1/50-DISENO): nunca arranca en 0%.
const PROGRESO: Record<Paso, number> = { recap: 35, timeline: 70, precio: 100 };

export default function PaywallPage() {
  const router = useRouter();
  const [indice, setIndice] = useState(0);
  const paso: Paso = PASOS[indice];
  const [datos, setDatos] = useState<DatosOnboarding | null>(null);
  const [plan, setPlan] = useState<'anual' | 'mensual'>('anual');
  const [avisoEmail, setAvisoEmail] = useState(true);

  useEffect(() => {
    try {
      const guardado = window.localStorage.getItem('cashpet_onboarding');
      if (guardado) setDatos(JSON.parse(guardado));
    } catch {
      // Sin localStorage (modo privado) — la pantalla sigue funcionando con los defaults del render.
    }
  }, []);

  const avanzar = () => setIndice((i) => Math.min(i + 1, PASOS.length - 1));
  const atras = () => setIndice((i) => Math.max(i - 1, 0));
  const cerrar = () => router.push('/');

  const moneda = datos?.moneda ?? 'USD';
  const cantidadCategorias = datos?.categorias?.length ?? 0;

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
        <header className="flex items-center gap-2 px-2 pt-3">
          <CerrarPaywall onClick={cerrar} />
          {indice > 0 && (
            <button
              type="button"
              onClick={atras}
              aria-label="Atrás"
              className="flex size-11 shrink-0 items-center justify-center text-[var(--text-secondary)] [touch-action:manipulation]"
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
          )}
          <BarraProgreso porcentaje={PROGRESO[paso]} />
          <span className="pl-1 pr-2 text-sm font-semibold text-[var(--text-secondary)] [font-family:var(--font-display)]">CashPet</span>
        </header>

        <TransicionPaso pasoKey={paso}>
          {paso === 'recap' && (
            <div className="flex flex-1 flex-col justify-center px-4 pb-16">
              <Mascota size={72} emocion="celebrando" />
              <h1 className="mt-4 text-balance text-[30px] font-bold leading-[1.15] [font-family:var(--font-display)]">
                Tu <Accent>Freno de 5 Segundos</Accent> está listo
              </h1>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">Hecho con tus 6 respuestas.</p>

              <div className="mt-6 flex flex-col gap-2">
                <FilaRecap indice={0} icon={MapPin} label="Tu país" valor={datos?.pais ?? 'Sin datos'} />
                <FilaRecap
                  indice={1}
                  icon={Tag}
                  label="Categorías de riesgo identificadas"
                  valor={cantidadCategorias > 0 ? `${cantidadCategorias} categorías` : 'Sin datos'}
                />
                <FilaRecap indice={2} icon={Calendar} label="Tu momento de riesgo" valor={datos?.momento ?? 'Sin datos'} />
                <FilaRecap
                  indice={3}
                  icon={Wallet}
                  label="Tu límite diario"
                  valor={datos ? formatoMoneda(datos.presupuestoDiario, moneda) : 'Sin datos'}
                />
              </div>

              <div className="mt-8 w-full pb-[max(16px,env(safe-area-inset-bottom))]">
                <CtaButton href="#" alto={56} onClick={(e) => { e.preventDefault(); avanzar(); }}>
                  Ver cómo funciona
                </CtaButton>
              </div>
            </div>
          )}

          {paso === 'timeline' && (
            <div className="flex flex-1 flex-col justify-center px-4 pb-16">
              <Mascota size={56} emocion="neutral" />
              <h1 className="mt-4 text-balance text-[30px] font-bold leading-[1.15] [font-family:var(--font-display)]">
                Así es tu <Accent>prueba gratis</Accent>
              </h1>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">7 días completos antes de que se cobre nada.</p>

              <div className="mt-8">
                <NodoTimeline estado="hecho" titulo="Hoy — acceso completo" caption="Todo tu plan, sin límites, sin tarjeta bloqueada." />
                <NodoTimeline estado="hecho" titulo="Día 6 — te avisamos" caption="Correo antes de cualquier cobro, sin sorpresas." />
                <NodoTimeline
                  estado="pendiente"
                  titulo={`Día 7 — 1er cobro: ${plan === 'anual' ? '$69.99/año' : '$8.99/mes'}`}
                  caption="Cancela antes sin costo."
                  ultimo
                />
              </div>

              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => setAvisoEmail((v) => !v)}
                className="mt-8 flex items-center gap-3 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--surface)] px-4 py-3 text-left [touch-action:manipulation]"
                aria-pressed={avisoEmail}
              >
                <span
                  className={`flex size-5 shrink-0 items-center justify-center rounded-[6px] border-2 ${avisoEmail ? 'border-[var(--accent)] bg-[var(--accent)]' : 'border-[color-mix(in_oklab,var(--text-tertiary)_50%,transparent)]'}`}
                  aria-hidden="true"
                >
                  {avisoEmail && <span className="size-2 rounded-[2px] bg-[var(--bg)]" />}
                </span>
                <span className="text-sm text-[var(--text-primary)]">¿Te avisamos por correo antes del cobro?</span>
              </motion.button>

              <div className="mt-10 w-full pb-[max(16px,env(safe-area-inset-bottom))]">
                <CtaButton href="#" alto={56} onClick={(e) => { e.preventDefault(); avanzar(); }}>
                  Ver los planes
                </CtaButton>
              </div>
            </div>
          )}

          {paso === 'precio' && (
            <div className="flex flex-1 flex-col px-4 pt-4">
              <Mascota size={48} emocion="feliz" />
              <h1 className="mt-3 text-balance text-[30px] font-bold leading-[1.15] [font-family:var(--font-display)]">
                Actívalo con <Accent>7 días gratis</Accent>
              </h1>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Menos de $0.30 al día para dejar de regalar $150-200 al mes en gastos hormiga.
              </p>

              <ul className="mt-4 flex flex-col gap-2">
                <CheckItem indice={0}>El Freno de 5 Segundos activo en cada gasto</CheckItem>
                <CheckItem indice={1}>Rachas y niveles de Gastón</CheckItem>
                <CheckItem indice={2}>Tus categorías de riesgo vigiladas</CheckItem>
              </ul>

              <div className="mt-6 flex flex-col gap-3">
                <PlanCard
                  indice={3}
                  nombre="Anual"
                  precioMes="$5.83"
                  detalle="Se cobra $69.99/año"
                  badge="2 meses gratis"
                  seleccionado={plan === 'anual'}
                  onClick={() => setPlan('anual')}
                />
                <PlanCard
                  indice={4}
                  nombre="Mensual"
                  precioMes="$8.99"
                  detalle="Se cobra cada mes"
                  seleccionado={plan === 'mensual'}
                  onClick={() => setPlan('mensual')}
                />
              </div>

              <div className="mt-6 w-full">
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.3 }}>
                  <CtaButton href="#" alto={56} onClick={(e) => { e.preventDefault(); router.push('/entrar'); }}>
                    Empezar mis 7 días gratis
                  </CtaButton>
                </motion.div>
                <p className="mt-2 text-center text-[13px] text-[var(--text-secondary)]">
                  Día 7: se cobra {plan === 'anual' ? '$69.99' : '$8.99'} · cancela antes sin costo
                </p>
              </div>

              {/* "Restaurar compra" se agrega recién cuando Hotmart esté conectado (Sesión 6):
                  mostrarlo ahora sin una compra real que restaurar sería un mock deshonesto
                  (defecto real de la 2ª revisión — hacía exactamente lo mismo que "Ahora no",
                  sin verificar ni restaurar nada). Ver ESTADO.md → Problemas conocidos. */}
              <div className="mt-4 flex items-center justify-center">
                <button type="button" onClick={cerrar} className="flex h-11 items-center px-2 text-sm text-[var(--text-tertiary)] [touch-action:manipulation]">
                  Ahora no
                </button>
              </div>

              <Hairline surface="surface" className="mt-2 mb-4">
                <div className="flex items-center justify-center gap-2 px-4 py-3 text-xs text-[var(--text-secondary)]">
                  <Lock size={14} aria-hidden="true" />
                  <span>Pago seguro</span>
                  <span aria-hidden="true">·</span>
                  <ShieldCheck size={14} aria-hidden="true" />
                  <span>Garantía de 15 días</span>
                </div>
              </Hairline>
            </div>
          )}
        </TransicionPaso>
      </div>
    </div>
  );
}
