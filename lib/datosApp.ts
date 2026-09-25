// Datos de la app interna (Sesión 5) — Supabase Auth/BD aún no están conectados (Sesión 6):
// todo vive en localStorage por ahora. Se siembra desde las respuestas reales del onboarding
// (cashpet_onboarding) para que el primer uso de la app nunca se sienta vacío (32-DEL-MVP-AL-PRODUCTO).
// Compartido por /inicio, /progreso y /perfil — un solo lugar de verdad para el mock.

import type { EmocionMascota } from '@/components/Mascota';
import {
  Bus,
  CreditCard,
  Gamepad2,
  Gift,
  Heart,
  Home,
  PawPrint,
  PiggyBank,
  RefreshCw,
  ShoppingBag,
  ShoppingCart,
  Users,
  Zap,
  type LucideIcon,
} from 'lucide-react';

// Mismo mapa moneda→locale que app/onboarding y app/paywall — 'es' a secas pierde el
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
  USD: 'en-US',
};

export function formatoMoneda(v: number, moneda: string): string {
  const locale = LOCALE_POR_MONEDA[moneda] ?? 'es';
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: moneda, maximumFractionDigits: 0 }).format(v);
  } catch {
    return `${moneda} ${v}`;
  }
}

// Símbolo real de la moneda para placeholders (ej. "₡", "$") en vez del código ISO
// crudo — mismo fix ya aplicado en el onboarding, replicado aquí.
export function simboloMoneda(moneda: string): string {
  const locale = LOCALE_POR_MONEDA[moneda] ?? 'es';
  try {
    const parte = new Intl.NumberFormat(locale, { style: 'currency', currency: moneda, maximumFractionDigits: 0 })
      .formatToParts(0)
      .find((p) => p.type === 'currency');
    return parte?.value ?? moneda;
  } catch {
    return moneda;
  }
}

// Nombre coloquial de la moneda (ej. "Colones") para el selector de moneda secundaria —
// el resto de la app nunca muestra el código ISO crudo ("CRC"), esto no debía ser la
// excepción (defecto real, 12ª revisión).
const NOMBRE_MONEDA: Record<string, string> = {
  MXN: 'Pesos',
  COP: 'Pesos',
  ARS: 'Pesos',
  CLP: 'Pesos',
  PEN: 'Soles',
  CRC: 'Colones',
  GTQ: 'Quetzales',
  DOP: 'Pesos',
  USD: 'Dólares',
};

export function nombreMoneda(moneda: string): string {
  return NOMBRE_MONEDA[moneda] ?? moneda;
}

// Categorías reales de la app (ESTADO.md → Decisiones de producto, extraídas del Excel
// personal del usuario) — reemplazan las categorías de "gasto hormiga" del onboarding,
// que eran solo para el diagnóstico inicial.
export const CATEGORIAS: { label: string; icon: LucideIcon }[] = [
  { label: 'Renta/Vivienda', icon: Home },
  { label: 'Despensa/Comida', icon: ShoppingCart },
  { label: 'Servicios', icon: Zap },
  { label: 'Transporte', icon: Bus },
  { label: 'Salud', icon: Heart },
  { label: 'Mascotas', icon: PawPrint },
  { label: 'Suscripciones', icon: RefreshCw },
  { label: 'Tarjeta de Crédito', icon: CreditCard },
  { label: 'Ahorros', icon: PiggyBank },
  { label: 'Hobbies/Ocio', icon: Gamepad2 },
  { label: 'Compras', icon: ShoppingBag },
  { label: 'Regalos', icon: Gift },
  { label: 'Familia', icon: Users },
];

export function iconoCategoria(categoria: string): LucideIcon {
  return CATEGORIAS.find((c) => c.label === categoria)?.icon ?? ShoppingCart;
}

// Dos presupuestos, no uno (decisión de producto 2026-09-24, a pedido del usuario): lo
// FIJO (planeado, recurrente — renta, recibos, súper) sale del presupuesto MENSUAL; lo
// LIBRE (impulso — café, antojos, salidas) sale de una bolsa aparte que se administra
// DÍA a día para que no se acabe antes de fin de mes. Cada categoría se clasifica sola
// — el usuario no elige "fijo o libre" cada vez que anota un gasto.
export type TipoPresupuesto = 'fijo' | 'libre';

const CATEGORIAS_FIJAS = new Set([
  'Renta/Vivienda',
  'Servicios',
  'Despensa/Comida',
  'Suscripciones',
  'Tarjeta de Crédito',
  'Salud',
  'Mascotas',
  'Ahorros',
]);

// Categorías fuera de esa lista (Transporte, Hobbies/Ocio, Compras, Regalos, Familia, y
// cualquier categoría personalizada que el usuario escriba con "Otra") son LIBRE por
// defecto — el gasto de impulso variable, no lo planeado del mes.
export function tipoPresupuesto(categoria: string): TipoPresupuesto {
  return CATEGORIAS_FIJAS.has(categoria) ? 'fijo' : 'libre';
}

export interface Gasto {
  id: string;
  /** Siempre en la moneda PRINCIPAL — todo el cálculo de presupuestos usa este valor,
   * ya convertido si el gasto se anotó en la moneda secundaria (ver abajo). */
  monto: number;
  categoria: string;
  hora: string;
  /** ISO 'YYYY-MM-DD', siempre en hora LOCAL del usuario (2026-09-25, a pedido del
   * usuario: recordar el historial de días pasados y sacar estadísticas por período).
   * String zero-padded a propósito: compara cronológicamente con `<`/`>=` de texto
   * plano, sin parsear Date en cada filtro. */
  fecha: string;
  /** Moneda secundaria (2026-09-24, a pedido del usuario: ingresos/pagos mezclados en 2
   * monedas, ej. dólares y colones en Costa Rica). Si el gasto se anotó en la moneda
   * secundaria, se guarda el monto/moneda originales + el tipo de cambio usado ese día
   * (manual, no automático: "el tipo de cambio es muy variable" según cada banco/día) —
   * así el historial conserva trazabilidad sin perder precisión en los presupuestos, que
   * siguen siendo de una sola moneda. */
  montoOriginal?: number;
  monedaOriginal?: string;
  tipoCambio?: number;
}

export interface DatosApp {
  moneda: string;
  /** Ej. 'USD' — si está definida, el usuario puede anotar gastos en esta moneda además
   * de la principal (activado desde Perfil). undefined = solo una moneda, comportamiento
   * de antes. */
  monedaSecundaria?: string;
  /** Precarga el campo de tipo de cambio la próxima vez que se anota en la moneda
   * secundaria — conveniencia, no una tasa fija: el usuario la puede corregir siempre. */
  ultimoTipoCambio?: number;
  presupuestoMensual: number;
  presupuestoLibreDiario: number;
  racha: number;
  nivelMascota: number;
  /** TODO el historial, no solo hoy (2026-09-25) — Inicio filtra con `gastosDeHoy()`,
   * Progreso filtra por período con `filtrarPorRango()`. El nombre cambió de
   * `gastosHoy` a `gastos` porque ya no es solo el día de hoy. */
  gastos: Gasto[];
}

// Etiqueta compacta del monto original para el historial (ej. "$12.50") — null si el
// gasto se anotó directo en la moneda principal (el caso normal, sin nada que aclarar).
// A diferencia de formatoMoneda (siempre redondea a unidades enteras, convención del
// resto de la app), acá SÍ se conservan los centavos si el usuario los escribió — es
// trazabilidad de lo que anotó, no el monto ya convertido (defecto real, 12ª revisión:
// "$12.50" se mostraba redondeado a "$13", perdiendo precisión sin necesidad).
export function etiquetaMontoOriginal(g: Gasto): string | null {
  if (!g.monedaOriginal || g.montoOriginal == null) return null;
  const locale = LOCALE_POR_MONEDA[g.monedaOriginal] ?? 'es';
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: g.monedaOriginal,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(g.montoOriginal);
  } catch {
    return `${g.monedaOriginal} ${g.montoOriginal}`;
  }
}

// Suma solo los gastos de un tipo (fijo o libre) — usado para separar el dato héroe de
// Inicio (libre de hoy) del resumen de Progreso (fijo del mes).
export function sumaPorTipo(gastos: Gasto[], tipo: TipoPresupuesto): number {
  return gastos.filter((g) => tipoPresupuesto(g.categoria) === tipo).reduce((acc, g) => acc + g.monto, 0);
}

const CLAVE = 'cashpet_app';

function horaActual(): string {
  return new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

// 'YYYY-MM-DD' en hora LOCAL — nunca toISOString() (ese va en UTC y puede mostrar el
// día de ayer/mañana según la zona horaria del usuario, bug real conocido de esa API).
export function fechaHoy(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function fechaDesdeHoy(diasAtras: number): string {
  const d = new Date();
  d.setDate(d.getDate() - diasAtras);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

// El ritual diario de Inicio sigue siendo solo sobre HOY — el historial completo vive
// en `datos.gastos`, esto filtra el subconjunto de siempre (2026-09-25).
export function gastosDeHoy(gastos: Gasto[]): Gasto[] {
  const hoy = fechaHoy();
  return gastos.filter((g) => g.fecha === hoy);
}

// Estadísticas por período (2026-09-25, a pedido del usuario: "estadísticas mensuales,
// trimestrales o anuales, con la opción de aplicar filtros"). `offset` navega entre
// períodos: 0 = el actual, -1 = el anterior, +1 = el siguiente (nunca más allá de hoy
// en la práctica — Progreso desactiva la flecha "siguiente" en offset 0).
export type Periodo = 'mes' | 'trimestre' | 'año';

const NOMBRES_MES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

function ultimoDiaDelMes(anio: number, mesIdx0: number): number {
  return new Date(anio, mesIdx0 + 1, 0).getDate();
}

function capitalizar(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export interface RangoPeriodo {
  desde: string;
  hasta: string;
  etiqueta: string;
}

// Aritmética con enteros (meses/trimestres totales desde el año 0) en vez de sumar/restar
// directo sobre el mes de un Date — evita el desborde de "mes 13" o "mes -1" que Date
// normaliza de formas no siempre obvias, y deja el offset negativo simple con `((n % m) + m) % m`.
export function rangoPeriodo(periodo: Periodo, offset: number, ref: Date = new Date()): RangoPeriodo {
  const anioRef = ref.getFullYear();
  const mesRef = ref.getMonth();

  if (periodo === 'mes') {
    const total = anioRef * 12 + mesRef + offset;
    const anio = Math.floor(total / 12);
    const mes = ((total % 12) + 12) % 12;
    return {
      desde: `${anio}-${pad2(mes + 1)}-01`,
      hasta: `${anio}-${pad2(mes + 1)}-${pad2(ultimoDiaDelMes(anio, mes))}`,
      etiqueta: `${capitalizar(NOMBRES_MES[mes])} ${anio}`,
    };
  }

  if (periodo === 'trimestre') {
    const trimestreRef = Math.floor(mesRef / 3);
    const total = anioRef * 4 + trimestreRef + offset;
    const anio = Math.floor(total / 4);
    const trimestre = ((total % 4) + 4) % 4;
    const mesInicio = trimestre * 3;
    const mesFin = mesInicio + 2;
    return {
      desde: `${anio}-${pad2(mesInicio + 1)}-01`,
      hasta: `${anio}-${pad2(mesFin + 1)}-${pad2(ultimoDiaDelMes(anio, mesFin))}`,
      etiqueta: `T${trimestre + 1} ${anio} (${capitalizar(NOMBRES_MES[mesInicio].slice(0, 3))}-${capitalizar(NOMBRES_MES[mesFin].slice(0, 3))})`,
    };
  }

  const anio = anioRef + offset;
  return { desde: `${anio}-01-01`, hasta: `${anio}-12-31`, etiqueta: `${anio}` };
}

// Comparación de texto plano (no Date) porque 'YYYY-MM-DD' zero-padded ya ordena
// cronológicamente — más simple y sin riesgo de desfase de zona horaria.
export function filtrarPorRango(gastos: Gasto[], desde: string, hasta: string): Gasto[] {
  return gastos.filter((g) => g.fecha >= desde && g.fecha <= hasta);
}

export function porCategoria(gastos: Gasto[]): { categoria: string; monto: number }[] {
  const mapa = gastos.reduce<Record<string, number>>((acc, g) => {
    acc[g.categoria] = (acc[g.categoria] ?? 0) + g.monto;
    return acc;
  }, {});
  return Object.entries(mapa)
    .map(([categoria, monto]) => ({ categoria, monto }))
    .sort((a, b) => b.monto - a.monto);
}

// Nunca una app vacía (32): si no hay datos guardados, se siembra desde el onboarding real
// del usuario (o, si tampoco existe, con un demo realista) — jamás "0 gastos, $0 de límite".
function sembrarDatos(): DatosApp {
  try {
    const onboarding = window.localStorage.getItem('cashpet_onboarding');
    if (onboarding) {
      const d = JSON.parse(onboarding);
      return {
        moneda: d.moneda ?? 'USD',
        presupuestoMensual: d.presupuestoMensual ?? 500,
        presupuestoLibreDiario: d.presupuestoLibreDiario ?? 25,
        racha: 1,
        nivelMascota: 1,
        // Un usuario real recién llegado solo tiene SU gasto de prueba de hoy — nunca se
        // le fabrica historial falso de días que no vivió (32: "nunca vacía" es sobre no
        // esconder datos reales, no sobre inventar transacciones que no pasaron).
        gastos: d.gastoPrueba?.monto
          ? [{ id: 'inicial', monto: d.gastoPrueba.monto, categoria: d.gastoPrueba.categoria ?? 'Hobbies/Ocio', hora: horaActual(), fecha: fechaHoy() }]
          : [],
      };
    }
  } catch {
    // localStorage puede fallar (modo privado) — se sigue con el demo de abajo.
  }
  // Este demo (sin onboarding real detrás) SÍ es un ejemplo genérico de por sí — se le
  // agrega algo de historial de meses previos para que Progreso no se vea vacío en este
  // caso límite (localStorage bloqueado / primera visita directa a /inicio sin pasar por
  // el onboarding).
  return {
    moneda: 'CRC',
    presupuestoMensual: 500000,
    presupuestoLibreDiario: 25000,
    racha: 1,
    nivelMascota: 1,
    gastos: [
      { id: 'demo1', monto: 8000, categoria: 'Despensa/Comida', hora: horaActual(), fecha: fechaHoy() },
      { id: 'demo2', monto: 3500, categoria: 'Hobbies/Ocio', hora: horaActual(), fecha: fechaHoy() },
      { id: 'demo3', monto: 450000, categoria: 'Renta/Vivienda', hora: '08:00', fecha: fechaDesdeHoy(20) },
      { id: 'demo4', monto: 60000, categoria: 'Servicios', hora: '09:30', fecha: fechaDesdeHoy(18) },
      { id: 'demo5', monto: 12000, categoria: 'Transporte', hora: '07:45', fecha: fechaDesdeHoy(15) },
      { id: 'demo6', monto: 9500, categoria: 'Hobbies/Ocio', hora: '19:20', fecha: fechaDesdeHoy(12) },
      { id: 'demo7', monto: 450000, categoria: 'Renta/Vivienda', hora: '08:00', fecha: fechaDesdeHoy(50) },
      { id: 'demo8', monto: 22000, categoria: 'Despensa/Comida', hora: '17:10', fecha: fechaDesdeHoy(45) },
      { id: 'demo9', monto: 15000, categoria: 'Compras', hora: '16:00', fecha: fechaDesdeHoy(40) },
      { id: 'demo10', monto: 450000, categoria: 'Renta/Vivienda', hora: '08:00', fecha: fechaDesdeHoy(80) },
      { id: 'demo11', monto: 18000, categoria: 'Transporte', hora: '07:45', fecha: fechaDesdeHoy(75) },
    ],
  };
}

export function cargarDatosApp(): DatosApp {
  try {
    const guardado = window.localStorage.getItem(CLAVE);
    if (guardado) {
      const parseado = JSON.parse(guardado);
      // Guarda de forma (2026-09-25): un `cashpet_app` guardado con la forma vieja
      // (`gastosHoy` en vez de `gastos`, de antes de este cambio) no debe tumbar toda
      // la pantalla — mejor tratarlo como si no hubiera nada guardado y volver a sembrar.
      if (Array.isArray(parseado?.gastos)) return parseado;
    }
  } catch {
    // sigue al seed
  }
  const datos = sembrarDatos();
  guardarDatosApp(datos);
  return datos;
}

export function guardarDatosApp(datos: DatosApp): void {
  try {
    window.localStorage.setItem(CLAVE, JSON.stringify(datos));
  } catch {
    // modo privado — la sesión sigue funcionando en memoria, solo no persiste.
  }
}

// Misma lógica de umbrales del onboarding (ESTADO.md → Decisiones técnicas), ahora contra
// el gasto LIBRE acumulado del día (no el fijo del mes: el ritual diario de Inicio es
// sobre la bolsa de impulso, ver "Dos presupuestos" arriba) en vez de un solo gasto de prueba.
export function calcularEmocion(gastado: number, presupuesto: number): EmocionMascota {
  const proporcion = presupuesto > 0 ? gastado / presupuesto : 0;
  if (proporcion <= 0.5) return 'celebrando';
  if (proporcion <= 1) return 'feliz';
  if (proporcion <= 1.5) return 'desconfiada';
  return 'decepcionada';
}

// Vocabulario y tono de FICHA-AVATAR.md/FICHA-ARTE.md: "gastos hormiga", "se me evapora",
// personalidad sarcástica y altanera — Gastón se ve tierno pero habla con filo.
export function textoReaccion(emocion: EmocionMascota): string {
  switch (emocion) {
    case 'celebrando':
      return 'Ni un gasto hormiga te agarró hoy. Sigue así y no se te evapora nada.';
    case 'feliz':
      return 'Vas bien, todavía dentro de tu límite. No te aplaudo, pero casi.';
    case 'desconfiada':
      return 'Ya casi tocas tu límite de hoy. Un gasto hormiga más y te fastidiaste.';
    case 'decepcionada':
    default:
      return 'Se te evaporó el límite de hoy. Otra vez. Mañana frenamos a tiempo, ¿va?';
  }
}
