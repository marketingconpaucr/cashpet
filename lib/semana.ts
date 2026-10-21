// Lógica PURA de semanas, racha, nivel y tope libre — sin React ni imports del proyecto, para
// poder probarla sola. Decisiones de producto del usuario (2026-10-21, ver ESTADO.md):
//  · el presupuesto libre es SEMANAL (lunes a domingo) aunque los gastos se anoten por día;
//  · la racha cuenta días seguidos con registro (un gasto o "Sin gastos hoy") y SOLO se rompe por
//    un día sin registrar nada;
//  · el nivel de Gastón sube por cada semana cerrada dentro del tope;
//  · el tope sale del dinero REAL que queda (ingreso − gastos fijos) repartido por los días del mes.

export type ISO = string; // 'YYYY-MM-DD' en hora LOCAL del usuario

const pad2 = (n: number): string => String(n).padStart(2, '0');

export function aISO(d: Date): ISO {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

// Mediodía a propósito: sumar días a medianoche puede saltar un día en cambios de horario.
function deISO(iso: ISO): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d, 12);
}

export function sumarDias(iso: ISO, n: number): ISO {
  const d = deISO(iso);
  d.setDate(d.getDate() + n);
  return aISO(d);
}

/** Lunes = 0 … domingo = 6. */
export function indiceSemana(iso: ISO): number {
  return (deISO(iso).getDay() + 6) % 7;
}

export function lunesDe(iso: ISO): ISO {
  return sumarDias(iso, -indiceSemana(iso));
}

export function domingoDe(iso: ISO): ISO {
  return sumarDias(lunesDe(iso), 6);
}

export function diasDelMes(anio: number, mesIdx0: number): number {
  return new Date(anio, mesIdx0 + 1, 0).getDate();
}

/** Tope diario máximo REAL: lo que queda tras los gastos fijos, repartido por los días del mes
 * de `ref`. Redondea hacia ABAJO (nunca por encima de lo que de verdad queda) y usa un paso fino
 * cuando el resto es chico, para que el tope exacto sea alcanzable (₡50.000 al mes en un mes de 31
 * días son ₡1.612 al día: con paso de ₡1.000 solo se podría llegar a ₡1.000). */
export function maxLibreDiario(
  ingreso: number,
  fijos: number,
  ref: Date,
  pasoBase: number
): { max: number; paso: number; sobranteMes: number } {
  const sobranteMes = ingreso - fijos;
  let paso = Math.max(1, pasoBase);
  if (sobranteMes <= 0) return { max: 0, paso, sobranteMes };
  const porDia = sobranteMes / diasDelMes(ref.getFullYear(), ref.getMonth());
  while (paso > 1 && porDia / paso < 10) paso = Math.max(1, Math.round(paso / 10));
  return { max: Math.floor(porDia / paso) * paso, paso, sobranteMes };
}

/** Días con registro = días con al menos un gasto + días marcados "Sin gastos hoy". */
export function diasRegistrados(fechasConGasto: ISO[], diasSinGastos: ISO[] = []): Set<ISO> {
  return new Set<ISO>([...fechasConGasto, ...diasSinGastos]);
}

/** Días seguidos con registro que terminan hoy. Si hoy todavía no se registra nada, el día sigue
 * abierto: la racha de ayer no se pierde hasta que pase la medianoche sin registro. */
export function calcularRacha(registrados: Set<ISO>, hoy: ISO): number {
  let dia = registrados.has(hoy) ? hoy : sumarDias(hoy, -1);
  let n = 0;
  while (registrados.has(dia)) {
    n++;
    dia = sumarDias(dia, -1);
  }
  return n;
}

export function mejorRacha(registrados: Set<ISO>): number {
  const orden = [...registrados].sort();
  let mejor = 0;
  let actual = 0;
  let previo: ISO | null = null;
  for (const dia of orden) {
    actual = previo !== null && sumarDias(previo, 1) === dia ? actual + 1 : 1;
    if (actual > mejor) mejor = actual;
    previo = dia;
  }
  return mejor;
}

/** Nivel de Gastón: 1 + cada semana YA CERRADA (lunes–domingo anterior a la de hoy) en la que hubo
 * al menos un registro y el gasto libre no pasó el tope semanal. Una semana sin registrar nada no
 * suma: el nivel no crece solo por dejar la app abandonada. */
export function calcularNivel(
  registrados: Set<ISO>,
  gastosLibres: { fecha: ISO; monto: number }[],
  topeSemanal: number,
  hoy: ISO
): number {
  if (registrados.size === 0) return 1;
  const gastoPorSemana = new Map<ISO, number>();
  for (const g of gastosLibres) {
    const lunes = lunesDe(g.fecha);
    gastoPorSemana.set(lunes, (gastoPorSemana.get(lunes) ?? 0) + g.monto);
  }
  const semanasActivas = new Set<ISO>([...registrados].map(lunesDe));
  const lunesActual = lunesDe(hoy);
  let cerradasEnVerde = 0;
  for (const lunes of semanasActivas) {
    if (lunes >= lunesActual) continue;
    if ((gastoPorSemana.get(lunes) ?? 0) <= topeSemanal) cerradasEnVerde++;
  }
  return 1 + cerradasEnVerde;
}
