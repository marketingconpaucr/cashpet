'use client';

// Inicio — la pantalla del ritual diario (M0): anotar un gasto en segundos y ver a Gastón
// reaccionar al instante contra el límite de HOY. Es la pantalla principal de la app —
// protagonista único: el estado del día (gastado vs. límite), no una lista de funciones.
// Datos en localStorage (lib/datosApp.ts) — Supabase se conecta en Sesión 6.

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronDown, Flame, PiggyBank, Plus } from 'lucide-react';
import { CtaButton, Hairline } from '@/components/landing/ui';
import { Mascota } from '@/components/Mascota';
import { BarraPresupuestoDia, BottomNav, ChipCategoria, ChipRacha, FilaGasto, SeccionVacia } from '@/components/app/ui';
import {
  CATEGORIAS,
  calcularEmocion,
  cargarDatosApp,
  etiquetaMontoOriginal,
  formatoMoneda,
  guardarDatosApp,
  iconoCategoria,
  simboloMoneda,
  sumaPorTipo,
  textoReaccion,
  tipoPresupuesto,
  type DatosApp,
  type Gasto,
} from '@/lib/datosApp';

const DATOS_INICIALES: DatosApp = { moneda: 'CRC', presupuestoMensual: 500000, presupuestoLibreDiario: 25000, racha: 1, nivelMascota: 1, gastosHoy: [] };

// Las 4 categorías de gasto hormiga diario van primero (gate de carga cognitiva: ≤4-5
// antes de agrupar) — las 6 menos frecuentes (pagos mensuales, etc.) quedan detrás de
// "Ver todas" en vez de una grilla de 10 de una sola vez.
const FRECUENTES = ['Despensa/Comida', 'Transporte', 'Hobbies/Ocio', 'Servicios'];
const CATEGORIAS_FRECUENTES = CATEGORIAS.filter((c) => FRECUENTES.includes(c.label));
const CATEGORIAS_RESTO = CATEGORIAS.filter((c) => !FRECUENTES.includes(c.label));

export default function InicioPage() {
  const [datos, setDatos] = useState<DatosApp>(DATOS_INICIALES);
  const [cargado, setCargado] = useState(false);
  const [agregando, setAgregando] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState<string | null>(null);
  const [mostrarTodas, setMostrarTodas] = useState(false);
  const [busquedaCategoria, setBusquedaCategoria] = useState('');
  const [categoriaPersonalizada, setCategoriaPersonalizada] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [campoError, setCampoError] = useState<'monto' | 'categoria' | 'tipoCambio' | null>(null);
  const [eliminado, setEliminado] = useState<Gasto | null>(null);
  // Moneda secundaria (2026-09-24): si está activada en Perfil, el usuario puede anotar
  // un gasto en esa moneda y convertirlo a mano con el tipo de cambio del día.
  const [monedaGasto, setMonedaGasto] = useState<'principal' | 'secundaria'>('principal');
  const [tipoCambio, setTipoCambio] = useState('');

  useEffect(() => {
    setDatos(cargarDatosApp());
    setCargado(true);
  }, []);

  // El ritual diario es sobre la bolsa LIBRE (impulso), no sobre lo fijo del mes — lo fijo
  // (renta, recibos, súper) se resume en Progreso, no compite por el dato héroe de Inicio.
  const gastadoLibreHoy = sumaPorTipo(datos.gastosHoy, 'libre');
  const emocion = calcularEmocion(gastadoLibreHoy, datos.presupuestoLibreDiario);

  // Preseleccionar la categoría del último gasto (no el monto: cada gasto es nuevo, pero
  // la categoría se repite 3-5 veces al día en el ritual — obligar a re-elegirla siempre
  // penaliza justo el loop diario que es la razón de ser de esta pantalla, 11ª revisión).
  const abrirFormulario = () => {
    const ultima = datos.gastosHoy[0]?.categoria ?? null;
    const esConocida = ultima ? CATEGORIAS.some((c) => c.label === ultima) : false;
    setEditandoId(null);
    setMonto('');
    setCategoria(ultima);
    setMostrarTodas(esConocida && !CATEGORIAS_FRECUENTES.some((c) => c.label === ultima));
    setCategoriaPersonalizada(ultima !== null && !esConocida);
    setBusquedaCategoria('');
    setMonedaGasto('principal');
    setTipoCambio(datos.ultimoTipoCambio ? String(datos.ultimoTipoCambio) : '');
    setAgregando(true);
  };

  const editarGasto = (g: Gasto) => {
    const esConocida = CATEGORIAS.some((c) => c.label === g.categoria);
    setEditandoId(g.id);
    if (g.monedaOriginal && g.montoOriginal != null) {
      setMonto(String(g.montoOriginal));
      setMonedaGasto('secundaria');
      setTipoCambio(g.tipoCambio ? String(g.tipoCambio) : '');
    } else {
      setMonto(String(g.monto));
      setMonedaGasto('principal');
      setTipoCambio(datos.ultimoTipoCambio ? String(datos.ultimoTipoCambio) : '');
    }
    setCategoria(g.categoria);
    setMostrarTodas(esConocida && !CATEGORIAS_FRECUENTES.some((c) => c.label === g.categoria));
    setCategoriaPersonalizada(!esConocida);
    setAgregando(true);
  };

  const cerrarFormulario = () => {
    setAgregando(false);
    setEditandoId(null);
    setMonto('');
    setCategoria(null);
    setCategoriaPersonalizada(false);
    setError(null);
    setCampoError(null);
  };

  const anotarGasto = () => {
    // Todas las monedas de la app usan maximumFractionDigits: 0 (lib/datosApp.ts) — sin
    // centavos. Parsear solo dígitos evita el bug real de la 10ª revisión: `parseFloat`
    // con reemplazo de coma→punto interpretaba "25.000" o "25,000" (el usuario separando
    // miles, como ve el propio límite formateado: "₡25 000") como 25 en vez de 25 000 —
    // corrupción silenciosa de un monto real, sin ningún error visible.
    const soloDigitos = monto.replace(/[^\d]/g, '');
    const valor = soloDigitos ? parseInt(soloDigitos, 10) : NaN;
    if (!Number.isFinite(valor) || valor <= 0) {
      setError('Escribe cuánto gastaste');
      setCampoError('monto');
      setTimeout(() => { setError(null); setCampoError(null); }, 2000);
      return;
    }
    // El tipo de cambio sí puede tener decimales (ej. 530,50) — a diferencia del monto,
    // que nunca lleva centavos en esta app.
    const usaSecundaria = monedaGasto === 'secundaria' && Boolean(datos.monedaSecundaria);
    let tasa = 0;
    if (usaSecundaria) {
      tasa = parseFloat(tipoCambio.replace(',', '.').replace(/[^\d.]/g, ''));
      if (!Number.isFinite(tasa) || tasa <= 0) {
        setError('Escribe el tipo de cambio de hoy');
        setCampoError('tipoCambio');
        setTimeout(() => { setError(null); setCampoError(null); }, 2000);
        return;
      }
    }
    if (!categoria) {
      setError('Elige una categoría');
      setCampoError('categoria');
      setTimeout(() => { setError(null); setCampoError(null); }, 2000);
      return;
    }
    const montoConvertido = usaSecundaria ? Math.round(valor * tasa) : valor;
    const camposMoneda = usaSecundaria
      ? { montoOriginal: valor, monedaOriginal: datos.monedaSecundaria, tipoCambio: tasa }
      : { montoOriginal: undefined, monedaOriginal: undefined, tipoCambio: undefined };
    const actualizado: DatosApp = editandoId
      ? {
          ...datos,
          ...(usaSecundaria ? { ultimoTipoCambio: tasa } : {}),
          gastosHoy: datos.gastosHoy.map((g) =>
            g.id === editandoId ? { ...g, monto: montoConvertido, categoria, ...camposMoneda } : g
          ),
        }
      : {
          ...datos,
          ...(usaSecundaria ? { ultimoTipoCambio: tasa } : {}),
          gastosHoy: [
            {
              id: crypto.randomUUID(),
              monto: montoConvertido,
              categoria,
              hora: new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' }),
              ...camposMoneda,
            },
            ...datos.gastosHoy,
          ],
        };
    setDatos(actualizado);
    guardarDatosApp(actualizado);
    cerrarFormulario();
  };

  // Undo (regla 8 de UX): borrar es reversible, no pide confirmación con un modal —
  // avisa y deja 4s para deshacer (defecto real: antes un gasto mal anotado no se podía corregir).
  const eliminarGasto = (id: string) => {
    const gasto = datos.gastosHoy.find((g) => g.id === id) ?? null;
    const actualizado: DatosApp = { ...datos, gastosHoy: datos.gastosHoy.filter((g) => g.id !== id) };
    setDatos(actualizado);
    guardarDatosApp(actualizado);
    setEliminado(gasto);
    setTimeout(() => setEliminado((actual) => (actual?.id === id ? null : actual)), 4000);
  };

  const deshacerEliminar = () => {
    if (!eliminado) return;
    const actualizado: DatosApp = { ...datos, gastosHoy: [eliminado, ...datos.gastosHoy] };
    setDatos(actualizado);
    guardarDatosApp(actualizado);
    setEliminado(null);
  };

  const categoriasVisibles = mostrarTodas
    ? CATEGORIAS.filter((c) => c.label.toLowerCase().includes(busquedaCategoria.trim().toLowerCase()))
    : CATEGORIAS_FRECUENTES;

  const reduce = useReducedMotion();

  return (
    <>
      <div
        className="flex flex-1 flex-col px-4 pt-4 pb-6"
        style={{ opacity: cargado ? 1 : 0 }}
        inert={agregando}
      >
        <header className="flex items-center justify-between">
          <h1 className="text-balance text-[25px] font-bold leading-[1.15] [font-family:var(--font-display)]">
            Hola de nuevo
          </h1>
          <ChipRacha dias={datos.racha} icon={Flame} />
        </header>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 flex flex-col items-center text-center"
        >
          <Mascota size={72} emocion={emocion} />
          <Hairline surface="surface" emphasis className="mt-3 max-w-[30ch] shadow-[var(--shadow-1)]">
            <p className="px-4 py-3 text-[15px] font-semibold text-[var(--text-primary)]">{textoReaccion(emocion)}</p>
          </Hairline>
        </motion.div>

        <div className="mt-5">
          <BarraPresupuestoDia gastado={gastadoLibreHoy} limite={datos.presupuestoLibreDiario} formatear={(v) => formatoMoneda(v, datos.moneda)} />
        </div>

        <div className="mt-5">
          <CtaButton href="#" alto={56} onClick={(e) => { e.preventDefault(); abrirFormulario(); }}>
            <span className="inline-flex items-center gap-2 text-[15px]">
              <Plus size={18} aria-hidden="true" />
              Anotar gasto
            </span>
          </CtaButton>
        </div>

        <div className="mt-6 flex-1">
          <h2 className="text-xs font-semibold text-[var(--text-secondary)]">Hoy</h2>
          {datos.gastosHoy.length === 0 ? (
            <SeccionVacia
              icon={PiggyBank}
              titulo="Todavía nada hoy"
              cuerpo="Anota tu primer gasto del día y mira cómo reacciona Gastón."
            />
          ) : (
            <div className="mt-2 flex flex-col gap-2">
              <AnimatePresence initial={false}>
                {datos.gastosHoy.map((g, i) => (
                  <FilaGasto
                    key={g.id}
                    indice={i}
                    icon={iconoCategoria(g.categoria)}
                    categoria={g.categoria}
                    monto={formatoMoneda(g.monto, datos.moneda)}
                    hora={g.hora}
                    tipo={tipoPresupuesto(g.categoria)}
                    montoOriginal={etiquetaMontoOriginal(g)}
                    onEditar={() => editarGasto(g)}
                    onEliminar={() => eliminarGasto(g.id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
          <AnimatePresence>
            {eliminado && (
              <motion.div
                role="status"
                aria-live="polite"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2 }}
                className="mt-2 flex items-center justify-between rounded-[var(--radius-button)] bg-[var(--surface-2)] px-3 py-2"
              >
                <span className="text-xs text-[var(--text-secondary)]">Gasto eliminado</span>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.94 }}
                  onClick={deshacerEliminar}
                  className="text-xs font-semibold text-[var(--accent)] [touch-action:manipulation]"
                >
                  Deshacer
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div inert={agregando}>
        <BottomNav activo="inicio" />
      </div>

      {/* Bottom-sheet real (no un reemplazo del contenido que dejaba medio viewport vacío,
          defecto real de la 6ª revisión): el backdrop cubre TAMBIÉN el BottomNav (z-index),
          conservando la protección contra perder el gasto sin guardar al navegar afuera. */}
      <AnimatePresence>
        {agregando && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={cerrarFormulario}
            className="fixed inset-0 z-20 bg-[color-mix(in_oklab,var(--text-primary)_45%,transparent)]"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {agregando && (
          <motion.div
            key="sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Anotar gasto"
            initial={reduce ? { opacity: 0 } : { y: '100%' }}
            animate={reduce ? { opacity: 1 } : { y: 0 }}
            exit={reduce ? { opacity: 0 } : { y: '100%' }}
            transition={{ duration: reduce ? 0.2 : 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 bottom-0 z-30 max-h-[85dvh] overflow-y-auto rounded-t-[var(--radius-card)] bg-[var(--surface)] pb-[max(12px,env(safe-area-inset-bottom))] shadow-[var(--shadow-2)]"
          >
            {/* Manija con función real (arrastrar hacia abajo cierra), no solo decorativa
                (regla 11: todo elemento con apariencia interactiva hace algo). */}
            <motion.div
              onPanEnd={(_e, info) => { if (info.offset.y > 40) cerrarFormulario(); }}
              className="mx-auto mt-2.5 h-1 w-9 shrink-0 touch-none rounded-full bg-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)]"
              aria-hidden="true"
            />
            <form
              noValidate
              onSubmit={(e) => { e.preventDefault(); anotarGasto(); }}
              className="flex flex-col gap-3 p-4"
            >
              {datos.monedaSecundaria && (() => {
                const monedaSec = datos.monedaSecundaria;
                return (
                  <div className="flex gap-2 rounded-[var(--radius-button)] bg-[var(--surface-2)] p-1">
                    {(['principal', 'secundaria'] as const).map((opcion) => (
                      <button
                        key={opcion}
                        type="button"
                        onClick={() => setMonedaGasto(opcion)}
                        aria-pressed={monedaGasto === opcion}
                        className={`h-9 flex-1 rounded-[var(--radius-button)] text-sm font-semibold [touch-action:manipulation] ${
                          monedaGasto === opcion ? 'bg-[var(--surface)] text-[var(--accent)] shadow-[var(--shadow-1)]' : 'text-[var(--text-tertiary)]'
                        }`}
                      >
                        {opcion === 'principal' ? simboloMoneda(datos.moneda) : simboloMoneda(monedaSec)} {opcion === 'principal' ? datos.moneda : monedaSec}
                      </button>
                    ))}
                  </div>
                );
              })()}
              <input
                    type="text"
                    inputMode="numeric"
                    autoFocus
                    value={monto}
                    onChange={(e) => { setMonto(e.target.value); if (error) { setError(null); setCampoError(null); } }}
                    placeholder={`Monto (${monedaGasto === 'secundaria' && datos.monedaSecundaria ? simboloMoneda(datos.monedaSecundaria) : simboloMoneda(datos.moneda)})`}
                    aria-invalid={campoError === 'monto'}
                    className={`h-14 w-full rounded-[var(--radius-button)] border bg-[var(--surface-2)] px-4 text-base text-[var(--text-primary)] shadow-[inset_0_1px_2px_color-mix(in_oklab,var(--text-primary)_10%,transparent)] outline-none focus:border-[var(--accent)] focus:bg-[var(--surface)] ${campoError === 'monto' ? 'border-[var(--error)]' : 'border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)]'}`}
                  />
                  {monedaGasto === 'secundaria' && datos.monedaSecundaria && (
                    <input
                      type="text"
                      inputMode="decimal"
                      value={tipoCambio}
                      onChange={(e) => { setTipoCambio(e.target.value); if (error) { setError(null); setCampoError(null); } }}
                      placeholder={`Tipo de cambio (${simboloMoneda(datos.moneda)} por ${simboloMoneda(datos.monedaSecundaria)}1)`}
                      aria-invalid={campoError === 'tipoCambio'}
                      className={`h-12 w-full rounded-[var(--radius-button)] border bg-[var(--surface-2)] px-4 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:bg-[var(--surface)] ${campoError === 'tipoCambio' ? 'border-[var(--error)]' : 'border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)]'}`}
                    />
                  )}
                  {!categoriaPersonalizada ? (
                    <>
                      {mostrarTodas && (
                        <input
                          type="text"
                          value={busquedaCategoria}
                          onChange={(e) => setBusquedaCategoria(e.target.value)}
                          placeholder="Busca una categoría"
                          className="h-11 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--surface-2)] px-4 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:bg-[var(--surface)]"
                        />
                      )}
                      <div className={`flex flex-wrap gap-2 rounded-[var(--radius-button)] ${campoError === 'categoria' ? 'outline outline-2 outline-[var(--error)] outline-offset-4' : ''}`}>
                        {categoriasVisibles.map((c, i) => (
                          <ChipCategoria
                            key={c.label}
                            indice={i}
                            icon={c.icon}
                            label={c.label}
                            seleccionado={categoria === c.label}
                            onClick={() => setCategoria(c.label)}
                          />
                        ))}
                        <ChipCategoria
                          indice={categoriasVisibles.length}
                          icon={Plus}
                          label="Otra"
                          seleccionado={false}
                          onClick={() => { setCategoriaPersonalizada(true); setCategoria(''); }}
                        />
                      </div>
                      {CATEGORIAS_RESTO.length > 0 && (
                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.96 }}
                          onClick={() => { setMostrarTodas((v) => !v); setBusquedaCategoria(''); }}
                          className="flex min-h-11 items-center justify-center gap-1 text-xs font-medium text-[var(--text-tertiary)] [touch-action:manipulation]"
                        >
                          {mostrarTodas ? 'Ver menos' : 'Ver todas las categorías'}
                          <ChevronDown size={14} className={mostrarTodas ? 'rotate-180' : ''} aria-hidden="true" />
                        </motion.button>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        autoFocus
                        value={categoria ?? ''}
                        onChange={(e) => { setCategoria(e.target.value); if (error) { setError(null); setCampoError(null); } }}
                        placeholder="¿En qué se te fue?"
                        className="h-14 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--surface-2)] px-4 text-base text-[var(--text-primary)] shadow-[inset_0_1px_2px_color-mix(in_oklab,var(--text-primary)_10%,transparent)] outline-none focus:border-[var(--accent)] focus:bg-[var(--surface)]"
                      />
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.96 }}
                        onClick={() => { setCategoriaPersonalizada(false); setCategoria(null); }}
                        className="flex min-h-11 items-center justify-center text-center text-xs font-medium text-[var(--text-tertiary)] underline-offset-2 hover:underline [touch-action:manipulation]"
                      >
                        ‹ Elegir de la lista
                      </motion.button>
                    </div>
                  )}
                  {error && (
                    <p role="alert" aria-live="assertive" className="text-center text-[15px] font-medium text-[var(--error)]">
                      {error}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.96 }}
                      onClick={cerrarFormulario}
                      className="h-12 flex-1 rounded-[var(--radius-button)] text-[15px] font-medium text-[var(--text-tertiary)] [touch-action:manipulation]"
                    >
                      Cancelar
                    </motion.button>
                    <div className="flex-[2]">
                      <CtaButton href="#" alto={52} submit>
                        <span className="text-[15px]">{editandoId ? 'Guardar' : 'Anotar'}</span>
                      </CtaButton>
                    </div>
                  </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
