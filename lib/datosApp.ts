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
  monto: number;
  categoria: string;
  hora: string;
}

export interface DatosApp {
  moneda: string;
  presupuestoMensual: number;
  presupuestoLibreDiario: number;
  racha: number;
  nivelMascota: number;
  gastosHoy: Gasto[];
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
        gastosHoy: d.gastoPrueba?.monto
          ? [{ id: 'inicial', monto: d.gastoPrueba.monto, categoria: d.gastoPrueba.categoria ?? 'Hobbies/Ocio', hora: horaActual() }]
          : [],
      };
    }
  } catch {
    // localStorage puede fallar (modo privado) — se sigue con el demo de abajo.
  }
  return {
    moneda: 'CRC',
    presupuestoMensual: 500000,
    presupuestoLibreDiario: 25000,
    racha: 1,
    nivelMascota: 1,
    gastosHoy: [
      { id: 'demo1', monto: 8000, categoria: 'Despensa/Comida', hora: horaActual() },
      { id: 'demo2', monto: 3500, categoria: 'Hobbies/Ocio', hora: horaActual() },
    ],
  };
}

export function cargarDatosApp(): DatosApp {
  try {
    const guardado = window.localStorage.getItem(CLAVE);
    if (guardado) return JSON.parse(guardado);
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
