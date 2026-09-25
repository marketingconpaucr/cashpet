'use client';

// Onboarding de CashPet — recorrido de inicio (Modelo 2, onboarding-first: sin cuenta,
// respuestas en localStorage hasta el pago/login — ver ESTADO.md). Deriva sus preguntas
// de FICHA-AVATAR.md (Camila): la pregunta-ancla ecoa el dolor #1, las categorías vienen
// de su Excel, el momento del día ancla la hora de notificación (24-GAMIFICACION.md).
// Blueprint visual: docs/sistema/50-DISENO-ONBOARDING-PAYWALL.md §A/§B.

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Moon, Plus, ShoppingBag, Sparkles, Sunrise, Sun, Sunset, Trash2 } from 'lucide-react';
import { Mascota, type EmocionMascota } from '@/components/Mascota';
import { Accent, CtaButton, Hairline } from '@/components/landing/ui';
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
  /** Presupuesto LIBRE (impulso, día a día): min, max, default, step. */
  rango: [number, number, number, number];
  /** Presupuesto MENSUAL (fijo: renta, recibos, súper): min, max, default, step. Rango
   * ~15-20x el libre diario — estimación LATAM razonable, no validada con datos de
   * mercado propios (misma naturaleza de estimación que el rango libre de arriba). */
  rangoMensual: [number, number, number, number];
  /** Ingreso mensual: min, max, default, step. Estimación LATAM razonable (misma
   * naturaleza que los rangos de arriba, no validada con datos de mercado propios) —
   * se usa solo para calcular un tope realista de presupuesto libre (ingreso - gastos
   * fijos), 2026-09-24 a pedido del usuario ("no es realista conforme a mis ingresos"). */
  rangoIngreso: [number, number, number, number];
}

const PAISES: PaisMoneda[] = [
  { nombre: 'México', moneda: 'MXN', locale: 'es-MX', rango: [100, 2000, 500, 10], rangoMensual: [3000, 30000, 12000, 500], rangoIngreso: [8000, 60000, 18000, 1000] },
  { nombre: 'Colombia', moneda: 'COP', locale: 'es-CO', rango: [20000, 400000, 100000, 5000], rangoMensual: [500000, 6000000, 2000000, 50000], rangoIngreso: [1500000, 12000000, 3000000, 100000] },
  { nombre: 'Argentina', moneda: 'ARS', locale: 'es-AR', rango: [2000, 40000, 10000, 500], rangoMensual: [200000, 4000000, 900000, 10000], rangoIngreso: [500000, 8000000, 1500000, 50000] },
  { nombre: 'Chile', moneda: 'CLP', locale: 'es-CL', rango: [5000, 100000, 25000, 1000], rangoMensual: [400000, 3000000, 900000, 10000], rangoIngreso: [800000, 6000000, 1500000, 50000] },
  { nombre: 'Perú', moneda: 'PEN', locale: 'es-PE', rango: [20, 400, 100, 5], rangoMensual: [800, 6000, 2500, 50], rangoIngreso: [1500, 12000, 4000, 100] },
  { nombre: 'Costa Rica', moneda: 'CRC', locale: 'es-CR', rango: [5000, 100000, 25000, 1000], rangoMensual: [300000, 2000000, 700000, 10000], rangoIngreso: [600000, 4000000, 1200000, 50000] },
  { nombre: 'Ecuador', moneda: 'USD', locale: 'es-EC', rango: [5, 100, 25, 1], rangoMensual: [300, 2000, 800, 25], rangoIngreso: [500, 4000, 1200, 50] },
  { nombre: 'Guatemala', moneda: 'GTQ', locale: 'es-GT', rango: [50, 1000, 250, 10], rangoMensual: [2000, 15000, 6000, 100], rangoIngreso: [4000, 30000, 9000, 200] },
  { nombre: 'República Dominicana', moneda: 'DOP', locale: 'es-DO', rango: [500, 10000, 2500, 100], rangoMensual: [15000, 120000, 45000, 1000], rangoIngreso: [30000, 200000, 60000, 2000] },
];
const PAIS_OTRO: PaisMoneda = { nombre: 'Otro país', moneda: 'USD', locale: 'es', rango: [5, 100, 25, 1], rangoMensual: [300, 2000, 800, 25], rangoIngreso: [500, 4000, 1200, 50] };

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
  'Suscripciones',
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
  'ingreso',
  'gastosFijos',
  'presupuestoLibre',
  'activacion',
  'reconocimientoFinal',
  'loading',
] as const;
type Paso = (typeof PASOS)[number];

const PROGRESO: Record<Paso, number> = {
  bienvenida: 0,
  pais: 9,
  dolor: 18,
  reconocimiento1: 18,
  categorias: 30,
  momento: 42,
  ingreso: 54,
  gastosFijos: 66,
  presupuestoLibre: 78,
  activacion: 90,
  reconocimientoFinal: 90,
  loading: 100,
};

function formatoMoneda(v: number, moneda: string, locale: string): string {
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: moneda, maximumFractionDigits: 0 }).format(v);
  } catch {
    return `${moneda} ${v}`;
  }
}

// Símbolo real de la moneda para placeholders (ej. "₡", "$") en vez del código ISO
// crudo — el resto de la app ya formatea así, este era el único lugar que no.
function simboloMoneda(moneda: string, locale: string): string {
  try {
    const parte = new Intl.NumberFormat(locale, { style: 'currency', currency: moneda, maximumFractionDigits: 0 })
      .formatToParts(0)
      .find((p) => p.type === 'currency');
    return parte?.value ?? moneda;
  } catch {
    return moneda;
  }
}

// El máximo del slider YA ES el tope realista (ingreso - gastos fijos, ver
// libreDiarioMax más abajo) — el feedback solo indica dónde cae el usuario DENTRO
// de ese tope real, y siempre menciona el tope para que quede claro de dónde sale
// (2026-09-24, a pedido del usuario: "no es realista conforme a mis ingresos").
function feedbackPresupuestoLibre(v: number, min: number, max: number, maxTexto: string, huboAjuste: boolean): string {
  if (huboAjuste) {
    return `Tus gastos fijos casi igualan tu ingreso — te dejamos un mínimo (${maxTexto}) para que empieces. Puedes ajustar esto luego.`;
  }
  const rel = max > min ? (v - min) / (max - min) : 0;
  const calif = rel < 0.35 ? 'ajustado' : rel < 0.7 ? 'realista' : 'generoso, cerca de tu máximo real';
  return `Un límite ${calif} · hasta ${maxTexto} es lo que te alcanza según tu ingreso y tus gastos fijos.`;
}

function feedbackIngreso(): string {
  return 'Esto queda privado — solo lo usamos para calcular cuánto puedes gastar libre sin ahogarte.';
}

export default function OnboardingPage() {
  const router = useRouter();
  const [indice, setIndice] = useState(0);
  const paso = PASOS[indice];
  // Portal a document.body para el CTA fijo de "gastos fijos" (mismo motivo que en
  // components/onboarding/ui.tsx → PantallaPregunta: `fixed` dentro del árbol de
  // TransicionPaso queda relativo al motion.div animado, no al viewport real).
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);

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
  // Dos presupuestos, no uno: LIBRE (impulso, día a día) + MENSUAL (fijo: renta, recibos,
  // súper) — ver "Dos presupuestos" en lib/datosApp.ts. Lo fijo ya NO es un slider único:
  // se arma sumando gastos fijos anotados uno por uno (2026-09-24, a pedido del usuario:
  // "poder escribir cuál recibo y cuánto dinero"), y el tope de lo libre se calcula desde
  // el ingreso real, no se elige a ciegas ("no es realista conforme a mis ingresos").
  const [presupuestoLibre, setPresupuestoLibre] = useState(monedaActual.rango[2]);
  const [ingresoMensual, setIngresoMensual] = useState(monedaActual.rangoIngreso[2]);
  const [gastosFijosItems, setGastosFijosItems] = useState<{ id: string; nombre: string; monto: number }[]>([]);
  const [nuevoGastoNombre, setNuevoGastoNombre] = useState('');
  const [nuevoGastoMonto, setNuevoGastoMonto] = useState('');
  const [errorGastoFijo, setErrorGastoFijo] = useState<string | null>(null);

  // Elegir país resetea TODO lo derivado de la moneda en el MISMO batch de estado (no un
  // useEffect reactivo aparte) — bug real encontrado en pruebas: con un efecto separado,
  // el render intermedio calculaba el tope realista mezclando el ingreso VIEJO (de la
  // moneda anterior) con el país NUEVO, dejaba un tope minúsculo por una fracción de
  // segundo, y el clamp de abajo lo aplicaba con Math.min — que nunca vuelve a subir aunque
  // el tope se corrija en el siguiente render. Setear todo junto aquí evita ese render
  // intermedio inconsistente por completo.
  const elegirPais = (p: PaisMoneda | null) => {
    const m = p ?? PAIS_OTRO;
    setPais(p);
    setPresupuestoLibre(m.rango[2]);
    setIngresoMensual(m.rangoIngreso[2]);
    setGastosFijosItems([]);
  };

  const totalGastosFijos = gastosFijosItems.reduce((acc, g) => acc + g.monto, 0);
  // Tope realista de "libre" = (ingreso - gastos fijos) / 30, redondeado al step de la
  // moneda — nunca baja del piso del país (huboAjusteRealista avisa cuando se activó ese
  // piso porque lo fijo casi se come todo el ingreso, en vez de fallar en silencio).
  const libreRealistaCalculado = Math.round((ingresoMensual - totalGastosFijos) / 30 / monedaActual.rango[3]) * monedaActual.rango[3];
  const huboAjusteRealista = libreRealistaCalculado < monedaActual.rango[0];
  const libreDiarioMax = Math.max(monedaActual.rango[0], libreRealistaCalculado);
  useEffect(() => {
    setPresupuestoLibre((v) => Math.min(v, libreDiarioMax));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [libreDiarioMax]);

  const agregarGastoFijo = () => {
    const soloDigitos = nuevoGastoMonto.replace(/[^\d]/g, '');
    const monto = soloDigitos ? parseInt(soloDigitos, 10) : NaN;
    if (!nuevoGastoNombre.trim()) {
      setErrorGastoFijo('Escribe a qué se va ese gasto');
      setTimeout(() => setErrorGastoFijo(null), 2000);
      return;
    }
    if (!Number.isFinite(monto) || monto <= 0) {
      setErrorGastoFijo('Escribe cuánto pagas por eso');
      setTimeout(() => setErrorGastoFijo(null), 2000);
      return;
    }
    setGastosFijosItems((items) => [...items, { id: crypto.randomUUID(), nombre: nuevoGastoNombre.trim(), monto }]);
    setNuevoGastoNombre('');
    setNuevoGastoMonto('');
  };

  const eliminarGastoFijo = (id: string) => {
    setGastosFijosItems((items) => items.filter((g) => g.id !== id));
  };

  const [gastoMonto, setGastoMonto] = useState('');
  const [gastoCategoria, setGastoCategoria] = useState<string | null>(null);
  const [reaccion, setReaccion] = useState<EmocionMascota | null>(null);

  // Feedback de validación (defecto real que encontró el revisor-visual: los botones no
  // avisaban nada cuando faltaba completar algo) — mensaje + sacudida breve, nunca silencio.
  const [errorCategorias, setErrorCategorias] = useState(false);
  const [errorGasto, setErrorGasto] = useState<string | null>(null);
  const [errorPais, setErrorPais] = useState(false);

  const avanzar = () => setIndice((i) => Math.min(i + 1, PASOS.length - 1));
  const atras = () => {
    // Si el usuario ya vio la reacción de Gastón y retrocede (ej. a "presupuestoLibre" para
    // ajustar su límite), la reacción vieja no debe seguir esperando al reingresar —
    // sin este reset, avanzar de nuevo salta directo al resultado con datos obsoletos.
    if (paso === 'activacion') {
      setReaccion(null);
      setGastoMonto('');
      setGastoCategoria(null);
      setErrorGasto(null);
    }
    setIndice((i) => Math.max(i - 1, 0));
  };

  const confirmarOtroPais = () => {
    if (!otroPaisTexto.trim()) {
      setErrorPais(true);
      setTimeout(() => setErrorPais(false), 2000);
      return;
    }
    elegirPais(null);
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
    const proporcion = monto / presupuestoLibre;
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
          presupuestoLibreDiario: presupuestoLibre,
          presupuestoMensual: totalGastosFijos,
          ingresoMensual,
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
            'radial-gradient(600px 360px at 15% 0%, color-mix(in oklab, var(--accent) 6%, transparent) 0%, transparent 60%), ' +
            'radial-gradient(520px 420px at 100% 100%, color-mix(in oklab, var(--accent-2) 5%, transparent) 0%, transparent 55%)',
        }}
      />
      {/* Sin min-h-dvh acá: el div de afuera ya lo garantiza — un segundo piso de altura
          mínima anidado en un hijo flex-1 puede sumar altura de más en navegadores
          móviles reales (defecto real encontrado y corregido en la app interna, mismo
          patrón, ver app/(interna)/layout.tsx). */}
      <div className="relative flex flex-1 flex-col">
      {paso !== 'bienvenida' && paso !== 'loading' && (
        <EncabezadoOnboarding porcentaje={PROGRESO[paso]} onAtras={atras} mostrarAtras={mostrarAtras} />
      )}

      {paso === 'pais' && !mostrarOtroPais && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-x-0 bottom-0 h-16"
          style={{ background: 'linear-gradient(to bottom, transparent, var(--bg))' }}
        />
      )}

      <TransicionPaso pasoKey={paso}>
        {paso === 'bienvenida' && (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <Mascota size={110} emocion="feliz" />
            <h1 className="mt-6 text-balance text-[28px] font-bold leading-[1.15] [font-family:var(--font-display)]">
              Hola, soy <Accent>Gastón</Accent>
            </h1>
            <p className="mt-3 max-w-[34ch] text-[15px] leading-relaxed text-[var(--text-secondary)]">
              Contesta unas preguntas rápidas y te muestro cómo te voy a decir si vas bien o te estás
              pasando, apenas anotes un gasto.
            </p>
            <div className="mt-8 w-full pb-[max(16px,env(safe-area-inset-bottom))]">
              <CtaButton href="#" alto={56} onClick={(e) => { e.preventDefault(); avanzar(); }}>
                Empezar
              </CtaButton>
            </div>
          </div>
        )}

        {paso === 'pais' && (
          <PantallaPregunta tituloMarked={<>¿En qué <Accent>país</Accent> estás?</>} subcopy="Así te muestro todo en tu moneda.">
            {!mostrarOtroPais ? (
              <>
                <input
                  type="text"
                  value={busquedaPais}
                  onChange={(e) => setBusquedaPais(e.target.value)}
                  placeholder="Busca tu país"
                  className="mb-1 h-14 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--surface-2)] px-4 text-base text-[var(--text-primary)] shadow-[inset_0_1px_2px_color-mix(in_oklab,var(--text-primary)_10%,transparent)] outline-none focus:border-[var(--accent)] focus:bg-[var(--surface)]"
                />
                <ChipOpcion indice={0} label="Otro país" seleccionado={mostrarOtroPais} onClick={() => setMostrarOtroPais(true)} />
                {paisesFiltrados.length === 0 && (
                  <p className="px-1 text-sm text-[var(--text-secondary)]">No encontramos tu país — usa &ldquo;Otro país&rdquo; arriba.</p>
                )}
                {paisesFiltrados.map((p, i) => (
                  <ChipOpcion
                    key={p.nombre}
                    indice={i + 1}
                    label={p.nombre}
                    seleccionado={pais?.nombre === p.nombre}
                    onClick={() => {
                      elegirPais(p);
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
                  className="h-14 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--surface-2)] px-4 text-base text-[var(--text-primary)] shadow-[inset_0_1px_2px_color-mix(in_oklab,var(--text-primary)_10%,transparent)] outline-none focus:border-[var(--accent)] focus:bg-[var(--surface)]"
                />
                <p className="text-xs text-[var(--text-tertiary)]">Por ahora te mostramos los montos en USD — lo ajustamos si hace falta.</p>
                <motion.div animate={errorPais ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }} transition={{ duration: 0.4 }}>
                  <CtaButton href="#" alto={56} onClick={(e) => { e.preventDefault(); confirmarOtroPais(); }}>
                    Continuar
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
          <PantallaPregunta tituloMarked={<>¿Cuándo sientes que se te <Accent>evapora</Accent> el dinero?</>}>
            {OPCIONES_DOLOR.map((op, i) => (
              <ChipOpcion key={op} indice={i} label={op} seleccionado={seleccionDolor.elegido === op} onClick={() => seleccionDolor.elegir(op)} />
            ))}
          </PantallaPregunta>
        )}

        {paso === 'reconocimiento1' && (
          <PantallaReconocimiento
            emocion="feliz"
            tituloMarked={<>No es falta de <Accent>voluntad</Accent></>}
            cuerpo={
              dolor === 'Ni idea — y eso es lo que quiero descubrir'
                ? 'Si ni siquiera sabes cuándo se te va, el problema no es tu disciplina: es que nadie te avisa EN EL MOMENTO. Por eso existe El Chequeo de Gastón.'
                : 'Que sepas exactamente cuándo se te escapa el dinero ya te pone adelante de la mayoría. El problema nunca fue no saber ahorrar — fue que nadie te avisaba a tiempo. Para eso está El Chequeo de Gastón.'
            }
            onContinuar={avanzar}
          />
        )}

        {paso === 'categorias' && (
          <PantallaPregunta
            tituloMarked={<>¿En qué se te va más el <Accent>dinero</Accent>?</>}
            subcopy="Elige todas las que apliquen."
            ctaFijo={
              <div>
                <motion.div animate={errorCategorias ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }} transition={{ duration: 0.4 }}>
                  <CtaButton href="#" alto={52} fullMobile onClick={(e) => { e.preventDefault(); confirmarCategorias(); }}>
                    Continuar
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
                  className="h-14 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--surface-2)] px-4 text-base text-[var(--text-primary)] shadow-[inset_0_1px_2px_color-mix(in_oklab,var(--text-primary)_10%,transparent)] outline-none focus:border-[var(--accent)] focus:bg-[var(--surface)]"
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
          <PantallaPregunta tituloMarked={<>¿En qué momento sueles gastar <Accent>sin pensarlo</Accent>?</>}>
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

        {paso === 'ingreso' && (
          <SliderCompromiso
            tituloMarked={<>¿Cuánto <Accent>ganas</Accent> al mes?</>}
            valor={ingresoMensual}
            min={monedaActual.rangoIngreso[0]}
            max={monedaActual.rangoIngreso[1]}
            step={monedaActual.rangoIngreso[3]}
            formatear={(v) => formatoMoneda(v, monedaActual.moneda, monedaActual.locale)}
            onCambiar={setIngresoMensual}
            onFijar={avanzar}
            feedback={feedbackIngreso()}
            unidad="al mes"
            ariaLabel="Ingreso mensual"
            permitirEscribir
          />
        )}

        {paso === 'gastosFijos' && (
          <div className="flex flex-1 flex-col px-4 pb-[120px]">
            <h1 className="mt-6 text-balance text-[28px] font-bold leading-[1.15] [font-family:var(--font-display)]">
              ¿Cuáles son tus <Accent>gastos fijos</Accent> cada mes?
            </h1>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">Renta, recibos, súper — agrégalos uno por uno.</p>

            <div className="mt-6 flex flex-col gap-2">
              <input
                type="text"
                value={nuevoGastoNombre}
                onChange={(e) => { setNuevoGastoNombre(e.target.value); if (errorGastoFijo) setErrorGastoFijo(null); }}
                placeholder="Ej. Renta"
                className="h-14 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--surface-2)] px-4 text-base text-[var(--text-primary)] shadow-[inset_0_1px_2px_color-mix(in_oklab,var(--text-primary)_10%,transparent)] outline-none focus:border-[var(--accent)] focus:bg-[var(--surface)]"
              />
              <input
                type="text"
                inputMode="numeric"
                value={nuevoGastoMonto}
                onChange={(e) => { setNuevoGastoMonto(e.target.value); if (errorGastoFijo) setErrorGastoFijo(null); }}
                placeholder={`Monto (${simboloMoneda(monedaActual.moneda, monedaActual.locale)})`}
                className="h-14 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--surface-2)] px-4 text-base text-[var(--text-primary)] shadow-[inset_0_1px_2px_color-mix(in_oklab,var(--text-primary)_10%,transparent)] outline-none focus:border-[var(--accent)] focus:bg-[var(--surface)]"
              />
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={agregarGastoFijo}
                className="flex h-12 items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_45%,transparent)] text-[15px] font-semibold text-[var(--accent)] [touch-action:manipulation]"
              >
                <Plus size={18} aria-hidden="true" />
                Agregar
              </motion.button>
              {errorGastoFijo && <p className="text-center text-sm font-medium text-[var(--error)]">{errorGastoFijo}</p>}
            </div>

            {gastosFijosItems.length > 0 && (
              <div className="mt-6 flex flex-col gap-2">
                {gastosFijosItems.map((g) => (
                  <div key={g.id} className="flex items-center gap-3 rounded-[var(--radius-button)] bg-[var(--surface-2)] px-3 py-2.5">
                    <p className="min-w-0 flex-1 truncate text-[15px] font-semibold text-[var(--text-primary)]">{g.nombre}</p>
                    <span className="shrink-0 text-[15px] font-bold tabular-nums text-[var(--text-primary)]">{formatoMoneda(g.monto, monedaActual.moneda, monedaActual.locale)}</span>
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.9 }}
                      onClick={() => eliminarGastoFijo(g.id)}
                      aria-label={`Eliminar ${g.nombre}`}
                      className="shrink-0 text-[var(--text-tertiary)] [touch-action:manipulation]"
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </motion.button>
                  </div>
                ))}
                <div className="mt-2 flex items-center justify-between px-1">
                  <span className="text-sm font-medium text-[var(--text-secondary)]">Total fijo al mes</span>
                  <span className="text-[15px] font-bold tabular-nums text-[var(--text-primary)]">{formatoMoneda(totalGastosFijos, monedaActual.moneda, monedaActual.locale)}</span>
                </div>
              </div>
            )}

            {/* Portal a document.body (no sticky): mismo motivo que PantallaPregunta en
                components/onboarding/ui.tsx — `fixed`/`sticky` dentro del árbol animado
                de TransicionPaso no es confiable en Safari/WebKit real. `pb-[120px]` en el
                contenedor de arriba compensa la altura de este botón. */}
            {montado &&
              createPortal(
                <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[color-mix(in_oklab,var(--text-tertiary)_15%,transparent)] bg-[var(--bg)] px-4 pt-4 pb-[max(16px,env(safe-area-inset-bottom))]">
                  <CtaButton href="#" alto={56} onClick={(e) => { e.preventDefault(); avanzar(); }}>
                    {gastosFijosItems.length > 0 ? 'Continuar' : 'No tengo gastos fijos'}
                  </CtaButton>
                </div>,
                document.body
              )}
          </div>
        )}

        {paso === 'presupuestoLibre' && (
          <SliderCompromiso
            tituloMarked={<>¿Cuánto quieres tener <Accent>libre</Accent> al día para gastos del día a día?</>}
            valor={presupuestoLibre}
            min={monedaActual.rango[0]}
            max={libreDiarioMax}
            step={monedaActual.rango[3]}
            formatear={(v) => formatoMoneda(v, monedaActual.moneda, monedaActual.locale)}
            onCambiar={setPresupuestoLibre}
            onFijar={avanzar}
            feedback={feedbackPresupuestoLibre(
              presupuestoLibre,
              monedaActual.rango[0],
              libreDiarioMax,
              formatoMoneda(libreDiarioMax, monedaActual.moneda, monedaActual.locale),
              huboAjusteRealista
            )}
          />
        )}

        {paso === 'activacion' && (
          <div className={`flex flex-1 flex-col px-4 ${reaccion ? 'pt-6' : 'justify-center pb-16'}`}>
            {!reaccion ? (
              <>
                <h1 className="text-balance text-[28px] font-bold leading-[1.15] [font-family:var(--font-display)]">
                  Anota tu <Accent>primer gasto</Accent>
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
                    placeholder={`Monto (${simboloMoneda(monedaActual.moneda, monedaActual.locale)})`}
                    className="h-14 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--surface-2)] px-4 text-base text-[var(--text-primary)] shadow-[inset_0_1px_2px_color-mix(in_oklab,var(--text-primary)_10%,transparent)] outline-none focus:border-[var(--accent)] focus:bg-[var(--surface)]"
                  />
                  {/* Antes mostraba solo las primeras 4 de las 6 categorías (`.slice(0, 4)`),
                      sin ninguna forma de ver o elegir las otras 2 — defecto real reportado
                      por el usuario ("acá no deja agregar otras categorías"). Ahora muestra
                      las 6 completas. */}
                  <div className="flex flex-col gap-3">
                    {OPCIONES_CATEGORIA.map((op, i) => (
                      <ChipOpcion key={op} indice={i} label={op} icon={ShoppingBag} seleccionado={gastoCategoria === op} onClick={() => setGastoCategoria(op)} />
                    ))}
                  </div>
                  <div className="mt-4 pb-[max(16px,env(safe-area-inset-bottom))]">
                    <motion.div animate={errorGasto ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }} transition={{ duration: 0.4 }}>
                      <CtaButton href="#" alto={56} onClick={(e) => { e.preventDefault(); reaccionar(); }}>
                        Anotar gasto
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
                  Así te habla <Accent>Gastón</Accent>
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
                  <CtaButton href="#" alto={56} onClick={(e) => { e.preventDefault(); avanzar(); }}>
                    Seguir
                  </CtaButton>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {paso === 'reconocimientoFinal' && (
          <PantallaReconocimiento
            emocion="celebrando"
            tituloMarked={<>Ya diste el <Accent>primer paso</Accent></>}
            cuerpo="Pocos definen su límite Y anotan un gasto antes de tener la app instalada. El Chequeo de Gastón va a usar exactamente esa disciplina que ya mostraste."
            dato={
              <BarraMiniVisual
                etiqueta="Categorías de riesgo identificadas"
                valor={categorias.length + (otraCategoria.trim() ? 1 : 0)}
                total={OPCIONES_CATEGORIA.length + (otraCategoria.trim() ? 1 : 0)}
              />
            }
            ctaLabel="Ver mi plan"
            onContinuar={avanzar}
          />
        )}

        {paso === 'loading' && (
          <PantallaLoading
            titulo={<>Armando tu <Accent>Chequeo de Gastón</Accent>…</>}
            lineas={[
              `Tu presupuesto fijo: ${formatoMoneda(totalGastosFijos, monedaActual.moneda, monedaActual.locale)} al mes`,
              `Tu presupuesto libre: ${formatoMoneda(presupuestoLibre, monedaActual.moneda, monedaActual.locale)} al día`,
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
