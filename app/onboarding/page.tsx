'use client';

// Onboarding de CashPet — recorrido de inicio (Modelo 2, onboarding-first: sin cuenta,
// respuestas en localStorage hasta el pago/login — ver ESTADO.md). Deriva sus preguntas
// de FICHA-AVATAR.md (Camila): la pregunta-ancla ecoa el dolor #1, las categorías vienen
// de su Excel, el momento del día ancla la hora de notificación (24-GAMIFICACION.md).
// Blueprint visual: docs/sistema/50-DISENO-ONBOARDING-PAYWALL.md §A/§B.

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Moon, ShoppingBag, Sparkles, Sunrise, Sun, Sunset } from 'lucide-react';
import { Mascota, type EmocionMascota } from '@/components/Mascota';
import { CtaButton, Hairline } from '@/components/landing/ui';
import {
  BarraMiniVisual,
  ChipOpcion,
  EncabezadoOnboarding,
  PantallaLoading,
  PantallaPregunta,
  PantallaReconocimiento,
  SliderCompromiso,
  TransicionPaso,
  useSeleccionUnica,
} from '@/components/onboarding/ui';

interface PaisMoneda {
  nombre: string;
  moneda: string;
  /** Locale BCP-47 específico (no el genérico 'es'): Intl.NumberFormat con 'es' a secas
   * pierde el símbolo real y agrupa mal los miles de 4 cifras (bug verificado en Node/ICU
   * — 'es-CR' da "₡5 000", 'es' a secas da "5000 CRC"). Un locale por país lo evita. */
  locale: string;
  rango: [number, number, number, number]; // min, max, default, step
}

const PAISES: PaisMoneda[] = [
  { nombre: 'México', moneda: 'MXN', locale: 'es-MX', rango: [100, 2000, 500, 10] },
  { nombre: 'Colombia', moneda: 'COP', locale: 'es-CO', rango: [20000, 400000, 100000, 5000] },
  { nombre: 'Argentina', moneda: 'ARS', locale: 'es-AR', rango: [2000, 40000, 10000, 500] },
  { nombre: 'Chile', moneda: 'CLP', locale: 'es-CL', rango: [5000, 100000, 25000, 1000] },
  { nombre: 'Perú', moneda: 'PEN', locale: 'es-PE', rango: [20, 400, 100, 5] },
  { nombre: 'Costa Rica', moneda: 'CRC', locale: 'es-CR', rango: [5000, 100000, 25000, 1000] },
  { nombre: 'Ecuador', moneda: 'USD', locale: 'es-EC', rango: [5, 100, 25, 1] },
  { nombre: 'Guatemala', moneda: 'GTQ', locale: 'es-GT', rango: [50, 1000, 250, 10] },
  { nombre: 'República Dominicana', moneda: 'DOP', locale: 'es-DO', rango: [500, 10000, 2500, 100] },
];
const PAIS_OTRO: PaisMoneda = { nombre: 'Otro país', moneda: 'USD', locale: 'es', rango: [5, 100, 25, 1] };

const OPCIONES_DOLOR = [
  'En la quincena/fin de mes',
  'Los fines de semana',
  'Con los gastos hormiga del día a día',
  'Con compras por impulso en línea',
  'Ni idea — y eso es lo que quiero descubrir',
];

const OPCIONES_CATEGORIA = [
  'Café y antojos',
  'Comida a domicilio',
  'Compras en línea/redes',
  'Salidas y ocio de fin de semana',
  'Suscripciones que ya ni uso',
  'Transporte (Uber/taxi)',
];

const OPCIONES_MOMENTO: { label: string; icon: typeof Sunrise }[] = [
  { label: 'Al despertar/en la mañana', icon: Sunrise },
  { label: 'A la hora del almuerzo', icon: Sun },
  { label: 'En la tarde/noche al salir', icon: Sunset },
  { label: 'De madrugada, cuando no puedes dormir', icon: Moon },
  { label: 'Los fines de semana en general', icon: Sparkles },
];

const PASOS = [
  'bienvenida',
  'pais',
  'dolor',
  'reconocimiento1',
  'categorias',
  'momento',
  'presupuesto',
  'activacion',
  'reconocimientoFinal',
  'loading',
] as const;
type Paso = (typeof PASOS)[number];

const PROGRESO: Record<Paso, number> = {
  bienvenida: 0,
  pais: 12,
  dolor: 26,
  reconocimiento1: 26,
  categorias: 42,
  momento: 58,
  presupuesto: 74,
  activacion: 88,
  reconocimientoFinal: 88,
  loading: 100,
};

function formatoMoneda(v: number, moneda: string, locale: string): string {
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: moneda, maximumFractionDigits: 0 }).format(v);
  } catch {
    return `${moneda} ${v}`;
  }
}

function feedbackPresupuesto(v: number, min: number, max: number): string {
  const rel = (v - min) / (max - min);
  if (rel < 0.35) return 'Un límite ajustado — Gastón te va a mantener a raya';
  if (rel < 0.7) return 'Un límite realista para empezar';
  return 'Un límite generoso — igual te avisamos si te pasas';
}

export default function OnboardingPage() {
  const router = useRouter();
  const [indice, setIndice] = useState(0);
  const paso = PASOS[indice];

  const [pais, setPais] = useState<PaisMoneda | null>(null);
  const [otroPaisTexto, setOtroPaisTexto] = useState('');
  const [mostrarOtroPais, setMostrarOtroPais] = useState(false);
  const [busquedaPais, setBusquedaPais] = useState('');
  const paisesFiltrados = useMemo(
    () => PAISES.filter((p) => p.nombre.toLowerCase().includes(busquedaPais.trim().toLowerCase())),
    [busquedaPais]
  );

  const [dolor, setDolor] = useState<string | null>(null);

  const [categorias, setCategorias] = useState<string[]>([]);
  const [otraCategoria, setOtraCategoria] = useState('');
  const [mostrarOtraCategoria, setMostrarOtraCategoria] = useState(false);

  const [momento, setMomento] = useState<string | null>(null);

  const monedaActual = pais ?? PAIS_OTRO;
  const [presupuesto, setPresupuesto] = useState(monedaActual.rango[2]);
  useEffect(() => {
    setPresupuesto(monedaActual.rango[2]);
    // Solo al fijar el país por primera vez — no queremos resetear si el usuario ya ajustó el slider.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monedaActual.moneda]);

  const [gastoMonto, setGastoMonto] = useState('');
  const [gastoCategoria, setGastoCategoria] = useState<string | null>(null);
  const [reaccion, setReaccion] = useState<EmocionMascota | null>(null);

  // Feedback de validación (defecto real que encontró el revisor-visual: los botones no
  // avisaban nada cuando faltaba completar algo) — mensaje + sacudida breve, nunca silencio.
  const [errorCategorias, setErrorCategorias] = useState(false);
  const [errorGasto, setErrorGasto] = useState<string | null>(null);
  const [errorPais, setErrorPais] = useState(false);

  const avanzar = () => setIndice((i) => Math.min(i + 1, PASOS.length - 1));
  const atras = () => setIndice((i) => Math.max(i - 1, 0));

  const confirmarOtroPais = () => {
    if (!otroPaisTexto.trim()) {
      setErrorPais(true);
      setTimeout(() => setErrorPais(false), 2000);
      return;
    }
    setPais(null);
    avanzar();
  };

  const seleccionDolor = useSeleccionUnica((v) => {
    setDolor(v);
    avanzar();
  });
  const seleccionMomento = useSeleccionUnica((v) => {
    setMomento(v);
    avanzar();
  });

  const toggleCategoria = (label: string) => {
    setCategorias((prev) => (prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label]));
  };

  const confirmarCategorias = () => {
    if (categorias.length === 0 && !otraCategoria) {
      setErrorCategorias(true);
      setTimeout(() => setErrorCategorias(false), 2000);
      return;
    }
    avanzar();
  };

  const reaccionar = () => {
    const monto = parseFloat(gastoMonto.replace(',', '.'));
    if (!Number.isFinite(monto) || monto <= 0 || !gastoCategoria) {
      setErrorGasto(!gastoMonto.trim() || !Number.isFinite(monto) || monto <= 0 ? 'Escribe cuánto gastaste' : 'Elige una categoría');
      setTimeout(() => setErrorGasto(null), 2000);
      return;
    }
    const proporcion = monto / presupuesto;
    let emocion: EmocionMascota;
    if (proporcion <= 0.5) emocion = 'celebrando';
    else if (proporcion <= 1) emocion = 'feliz';
    else if (proporcion <= 1.5) emocion = 'desconfiada';
    else emocion = 'decepcionada';
    setReaccion(emocion);
  };

  // Guarda todo en localStorage al llegar al loading final — Modelo 2: sin cuenta todavía,
  // se migra a Supabase recién al crear la cuenta (ver ESTADO.md → Decisiones técnicas).
  useEffect(() => {
    if (paso !== 'loading') return;
    try {
      window.localStorage.setItem(
        'cashpet_onboarding',
        JSON.stringify({
          pais: pais?.nombre ?? (otroPaisTexto || 'Otro país'),
          moneda: monedaActual.moneda,
          dolor,
          categorias: categorias.concat(otraCategoria ? [otraCategoria] : []),
          momento,
          presupuestoDiario: presupuesto,
          gastoPrueba: { monto: parseFloat(gastoMonto) || 0, categoria: gastoCategoria },
        })
      );
    } catch {
      // localStorage puede fallar (modo privado) — no bloquea el flujo, se re-preguntará si hace falta.
    }
    // La navegación a /paywall la dispara <PantallaLoading> (onCompletar) cuando termina su
    // propia secuencia visual — no un timeout aparte aquí.
  }, [paso]); // eslint-disable-line react-hooks/exhaustive-deps

  const mostrarAtras = paso !== 'bienvenida' && paso !== 'loading' && indice > 0;

  return (
    <div className="relative flex min-h-dvh flex-col bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      {/* Fondo con profundidad: mesh sutil del acento, nunca fill plano (mismo patrón del Hero de la landing) */}
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
      {paso !== 'bienvenida' && paso !== 'loading' && (
        <EncabezadoOnboarding porcentaje={PROGRESO[paso]} onAtras={atras} mostrarAtras={mostrarAtras} />
      )}

      <TransicionPaso pasoKey={paso}>
        {paso === 'bienvenida' && (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <Mascota size={110} emocion="feliz" />
            <h1 className="mt-6 text-balance text-[28px] font-bold leading-[1.15] [font-family:var(--font-display)]">
              Hola, soy Gastón
            </h1>
            <p className="mt-3 max-w-[34ch] text-[15px] leading-relaxed text-[var(--text-secondary)]">
              Contesta unas preguntas rápidas y te muestro cómo te voy a frenar antes de la próxima compra
              que ibas a lamentar.
            </p>
            <div className="mt-8 w-full pb-[max(16px,env(safe-area-inset-bottom))]">
              <CtaButton href="#" alto={56}>
                <span onClick={(e) => { e.preventDefault(); avanzar(); }}>Empezar</span>
              </CtaButton>
            </div>
          </div>
        )}

        {paso === 'pais' && (
          <PantallaPregunta tituloMarked="¿En qué país estás?" subcopy="Así te muestro todo en tu moneda.">
            {!mostrarOtroPais ? (
              <>
                <input
                  type="text"
                  value={busquedaPais}
                  onChange={(e) => setBusquedaPais(e.target.value)}
                  placeholder="Busca tu país"
                  className="mb-1 h-14 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--surface)] px-4 text-base text-[var(--text-primary)] shadow-[var(--shadow-1)] outline-none focus:border-[var(--accent)]"
                />
                <ChipOpcion indice={0} label="Otro país" seleccionado={mostrarOtroPais} onClick={() => setMostrarOtroPais(true)} />
                {paisesFiltrados.map((p, i) => (
                  <ChipOpcion
                    key={p.nombre}
                    indice={i + 1}
                    label={p.nombre}
                    seleccionado={pais?.nombre === p.nombre}
                    onClick={() => {
                      setPais(p);
                      setTimeout(avanzar, 300);
                    }}
                  />
                ))}
              </>
            ) : (
              <form
                className="flex flex-col gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  confirmarOtroPais();
                }}
              >
                <input
                  type="text"
                  autoFocus
                  value={otroPaisTexto}
                  onChange={(e) => setOtroPaisTexto(e.target.value)}
                  placeholder="Escribe tu país"
                  className="h-14 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--surface)] px-4 text-base text-[var(--text-primary)] shadow-[var(--shadow-1)] outline-none focus:border-[var(--accent)]"
                />
                <p className="text-xs text-[var(--text-tertiary)]">Por ahora te mostramos los montos en USD — lo ajustamos si hace falta.</p>
                <motion.div animate={errorPais ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }} transition={{ duration: 0.4 }}>
                  <CtaButton href="#" alto={56}>
                    <span
                      onClick={(e) => {
                        e.preventDefault();
                        confirmarOtroPais();
                      }}
                    >
                      Continuar
                    </span>
                  </CtaButton>
                </motion.div>
                {errorPais && <p className="text-center text-sm font-medium text-[var(--accent)]">Escribe el nombre de tu país</p>}
                <button
                  type="button"
                  onClick={() => {
                    setMostrarOtroPais(false);
                    setOtroPaisTexto('');
                    setErrorPais(false);
                  }}
                  className="mt-1 text-center text-sm font-medium text-[var(--text-tertiary)] underline-offset-2 hover:underline"
                >
                  ‹ Elegir de la lista
                </button>
              </form>
            )}
          </PantallaPregunta>
        )}

        {paso === 'dolor' && (
          <PantallaPregunta tituloMarked="¿Cuándo sientes que se te evapora el dinero?">
            {OPCIONES_DOLOR.map((op, i) => (
              <ChipOpcion key={op} indice={i} label={op} seleccionado={seleccionDolor.elegido === op} onClick={() => seleccionDolor.elegir(op)} />
            ))}
          </PantallaPregunta>
        )}

        {paso === 'reconocimiento1' && (
          <PantallaReconocimiento
            emocion="feliz"
            tituloMarked="No es falta de voluntad"
            cuerpo={
              dolor === 'Ni idea — y eso es lo que quiero descubrir'
                ? 'Si ni siquiera sabes cuándo se te va, el problema no es tu disciplina: es que nadie te avisa EN EL MOMENTO. Por eso existe el Freno de 5 Segundos.'
                : 'Que sepas exactamente cuándo se te escapa el dinero ya te pone adelante de la mayoría. El problema nunca fue no saber ahorrar — fue que nadie te avisaba a tiempo. Para eso está el Freno de 5 Segundos.'
            }
            onContinuar={avanzar}
          />
        )}

        {paso === 'categorias' && (
          <PantallaPregunta
            tituloMarked="¿En qué se te va más el dinero?"
            subcopy="Elige todas las que apliquen."
            ctaFijo={
              <div>
                <motion.div animate={errorCategorias ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }} transition={{ duration: 0.4 }}>
                  <CtaButton href="#" alto={52} fullMobile>
                    <span onClick={(e) => { e.preventDefault(); confirmarCategorias(); }}>
                      Continuar
                    </span>
                  </CtaButton>
                </motion.div>
                {errorCategorias && (
                  <p className="mt-2 text-center text-sm font-medium text-[var(--accent)]">Elige al menos una opción</p>
                )}
              </div>
            }
          >
            {OPCIONES_CATEGORIA.map((op, i) => (
              <ChipOpcion key={op} indice={i} label={op} seleccionado={categorias.includes(op)} onClick={() => toggleCategoria(op)} />
            ))}
            {!mostrarOtraCategoria ? (
              <ChipOpcion indice={OPCIONES_CATEGORIA.length} label="Otra cosa" seleccionado={false} onClick={() => setMostrarOtraCategoria(true)} />
            ) : (
              <form
                className="flex flex-col gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  confirmarCategorias();
                }}
              >
                <input
                  type="text"
                  autoFocus
                  value={otraCategoria}
                  onChange={(e) => setOtraCategoria(e.target.value)}
                  placeholder="¿En qué más?"
                  className="h-14 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--surface)] px-4 text-base text-[var(--text-primary)] shadow-[var(--shadow-1)] outline-none focus:border-[var(--accent)]"
                />
                <button
                  type="button"
                  onClick={() => {
                    setMostrarOtraCategoria(false);
                    setOtraCategoria('');
                  }}
                  className="text-center text-sm font-medium text-[var(--text-tertiary)] underline-offset-2 hover:underline"
                >
                  ‹ Elegir de la lista
                </button>
              </form>
            )}
          </PantallaPregunta>
        )}

        {paso === 'momento' && (
          <PantallaPregunta tituloMarked="¿En qué momento sueles gastar sin pensarlo?">
            {OPCIONES_MOMENTO.map((op, i) => (
              <ChipOpcion
                key={op.label}
                indice={i}
                label={op.label}
                icon={op.icon}
                seleccionado={seleccionMomento.elegido === op.label}
                onClick={() => seleccionMomento.elegir(op.label)}
              />
            ))}
          </PantallaPregunta>
        )}

        {paso === 'presupuesto' && (
          <SliderCompromiso
            tituloMarked="¿Cuánto quieres gastar como máximo al día?"
            valor={presupuesto}
            min={monedaActual.rango[0]}
            max={monedaActual.rango[1]}
            step={monedaActual.rango[3]}
            formatear={(v) => formatoMoneda(v, monedaActual.moneda, monedaActual.locale)}
            onCambiar={setPresupuesto}
            onFijar={avanzar}
            feedback={feedbackPresupuesto(presupuesto, monedaActual.rango[0], monedaActual.rango[1])}
          />
        )}

        {paso === 'activacion' && (
          <div className={`flex flex-1 flex-col px-4 ${reaccion ? 'pt-6' : 'justify-center pb-16'}`}>
            {!reaccion ? (
              <>
                <h1 className="text-balance text-[28px] font-bold leading-[1.15] [font-family:var(--font-display)]">
                  Anota tu primer gasto
                </h1>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">Cualquiera de hoy — así ves a Gastón reaccionar de verdad.</p>
                <form
                  className="mt-8 flex flex-col gap-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    reaccionar();
                  }}
                >
                  <input
                    type="text"
                    inputMode="decimal"
                    autoFocus
                    value={gastoMonto}
                    onChange={(e) => setGastoMonto(e.target.value)}
                    placeholder={`Monto (${monedaActual.moneda})`}
                    className="h-14 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--surface)] px-4 text-base text-[var(--text-primary)] shadow-[var(--shadow-1)] outline-none focus:border-[var(--accent)]"
                  />
                  <div className="flex flex-col gap-3">
                    {OPCIONES_CATEGORIA.slice(0, 4).map((op, i) => (
                      <ChipOpcion key={op} indice={i} label={op} icon={ShoppingBag} seleccionado={gastoCategoria === op} onClick={() => setGastoCategoria(op)} />
                    ))}
                  </div>
                  <div className="mt-4 pb-[max(16px,env(safe-area-inset-bottom))]">
                    <motion.div animate={errorGasto ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }} transition={{ duration: 0.4 }}>
                      <CtaButton href="#" alto={56}>
                        <span onClick={(e) => { e.preventDefault(); reaccionar(); }}>Anotar gasto</span>
                      </CtaButton>
                    </motion.div>
                    {errorGasto && <p className="mt-2 text-center text-sm font-medium text-[var(--accent)]">{errorGasto}</p>}
                  </div>
                </form>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-1 flex-col items-center justify-center text-center"
              >
                <h1 className="text-balance text-[28px] font-bold leading-[1.15] [font-family:var(--font-display)]">
                  Así te habla Gastón
                </h1>
                <p className="mt-2 max-w-[30ch] text-sm text-[var(--text-secondary)]">Esto va a hacer con cada gasto que anotes.</p>
                <Mascota size={110} emocion={reaccion} />
                <Hairline surface="surface" className="mt-5 max-w-[30ch] shadow-[var(--shadow-1)]">
                  <p className="px-4 py-3 text-[15px] font-semibold">
                    {reaccion === 'celebrando' && '"¡Eso sí es control! Vas muy por debajo de tu límite."'}
                    {reaccion === 'feliz' && '"Anotado. Vas bien, dentro de tu límite de hoy."'}
                    {reaccion === 'desconfiada' && '"Mmm, ya casi tocas tu límite de hoy. Te sigo de cerca."'}
                    {reaccion === 'decepcionada' && '"Eso ya se pasó de tu límite de hoy. No voy a llorar, pero lo anoté."'}
                  </p>
                </Hairline>
                <div className="mt-8 w-full pb-[max(16px,env(safe-area-inset-bottom))]">
                  <CtaButton href="#" alto={56}>
                    <span onClick={(e) => { e.preventDefault(); avanzar(); }}>Seguir</span>
                  </CtaButton>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {paso === 'reconocimientoFinal' && (
          <PantallaReconocimiento
            emocion="celebrando"
            tituloMarked="Ya diste el primer paso"
            cuerpo="Pocos definen su límite Y anotan un gasto antes de tener la app instalada. Tu Freno de 5 Segundos va a usar exactamente esa disciplina que ya mostraste."
            dato={<BarraMiniVisual etiqueta="Categorías de riesgo identificadas" valor={categorias.length} total={OPCIONES_CATEGORIA.length} />}
            ctaLabel="Ver mi plan"
            onContinuar={avanzar}
          />
        )}

        {paso === 'loading' && (
          <PantallaLoading
            titulo="Armando tu Freno de 5 Segundos…"
            lineas={[
              `Ajustando tu límite diario: ${formatoMoneda(presupuesto, monedaActual.moneda, monedaActual.locale)}`,
              'Configurando tus categorías de riesgo',
              `Tu momento de riesgo: ${momento}`,
            ]}
            onCompletar={() => router.push('/paywall')}
          />
        )}
      </TransicionPaso>
      </div>
    </div>
  );
}
