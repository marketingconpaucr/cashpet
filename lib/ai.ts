// Adaptador de IA — SOLO se importa desde rutas de servidor (app/api/.../route.ts), nunca
// desde un componente de cliente: ANTHROPIC_API_KEY y SUPABASE_SECRET_KEY viven aquí.
// Arquitectura según docs/sistema/30-INTEGRACION-IA.md: síncrono (texto corto), reintentos
// con backoff, circuit-breaker por fallos repetidos, kill-switch de presupuesto diario
// contra la tabla `ai_calls`, y degradación elegante (null en vez de reventar la pantalla).

import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import type { EmocionMascota } from '@/components/Mascota';

const client = new Anthropic(); // ANTHROPIC_API_KEY del entorno

// Precio aproximado de Haiku 4.5 (verificar antes de prometer economía, ver 30): ~$1/$5 por
// millón de tokens in/out. Se usa solo para estimar costo_usd al registrar cada llamada.
const PRECIO_ENTRADA_POR_TOKEN = 1 / 1_000_000;
const PRECIO_SALIDA_POR_TOKEN = 5 / 1_000_000;

function supabaseServidor() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!);
}

async function callWithRetry<T>(fn: () => Promise<T>, max = 3): Promise<T> {
  for (let i = 0; i < max; i++) {
    try {
      return await fn();
    } catch (e: unknown) {
      const err = e as { status?: number; name?: string };
      const retriable = err.status === 429 || (err.status ?? 0) >= 500 || err.name === 'APIConnectionTimeoutError';
      if (!retriable || i === max - 1) throw e;
      await new Promise((r) => setTimeout(r, 2 ** i * 1000 + Math.random() * 300));
    }
  }
  throw new Error('unreachable');
}

// Circuit-breaker en memoria (mitigación suave, por instancia — ver 30 §Resiliencia). La
// protección real contra gasto descontrolado es el kill-switch de presupuesto en DB de abajo.
class CircuitBreaker {
  private failures = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  private openedAt = 0;
  constructor(
    private threshold = 5,
    private cooldownMs = 30_000
  ) {}

  async exec<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.openedAt < this.cooldownMs) throw new Error('circuit-open');
      this.state = 'half-open';
    }
    try {
      const out = await fn();
      this.failures = 0;
      this.state = 'closed';
      return out;
    } catch (e) {
      this.failures++;
      if (this.state === 'half-open' || this.failures >= this.threshold) {
        this.state = 'open';
        this.openedAt = Date.now();
      }
      throw e;
    }
  }
}
const breaker = new CircuitBreaker();

// Kill-switch de presupuesto: lee el gasto de IA acumulado del día (UTC, suficiente para un
// tope de seguridad) contra AI_DAILY_BUDGET_USD antes de llamar al modelo.
async function dentroDelPresupuesto(): Promise<boolean> {
  const limite = Number(process.env.AI_DAILY_BUDGET_USD ?? 20);
  const desde = new Date();
  desde.setUTCHours(0, 0, 0, 0);
  const { data, error } = await supabaseServidor()
    .from('ai_calls')
    .select('costo_usd')
    .gte('creado_en', desde.toISOString());
  if (error) {
    // Si no se puede leer el gasto, se degrada por seguridad (no se arriesga el presupuesto).
    console.error('[ai] no se pudo leer el gasto diario', error.message);
    return false;
  }
  const gastoHoy = (data ?? []).reduce((suma, fila) => suma + Number(fila.costo_usd), 0);
  return gastoHoy < limite;
}

async function registrarLlamada(modelo: string, tokensEntrada: number, tokensSalida: number) {
  const costo = tokensEntrada * PRECIO_ENTRADA_POR_TOKEN + tokensSalida * PRECIO_SALIDA_POR_TOKEN;
  const { error } = await supabaseServidor()
    .from('ai_calls')
    .insert({ modelo, tokens_entrada: tokensEntrada, tokens_salida: tokensSalida, costo_usd: costo });
  if (error) console.error('[ai] no se pudo registrar la llamada', error.message);
}

interface ContextoReaccion {
  emocion: EmocionMascota;
  categoria: string | null;
  monto: number | null;
  moneda: string;
  racha: number;
  gastadoSemana: number;
  presupuestoSemana: number;
}

const INSTRUCCION_EMOCION: Record<EmocionMascota, string> = {
  celebrando: 'Vas muy por debajo de tu límite de la semana — celébralo con sarcasmo, no con ternura.',
  feliz: 'Vas bien, todavía dentro de tu límite de la semana — reconócelo a regañadientes.',
  neutral: 'Aún no has anotado ningún gasto — salúdalo esperando el primero, con sorna.',
  desconfiada: 'Está a punto de pasarse del límite de la semana — adviértele con desconfianza.',
  decepcionada: 'Ya se pasó del límite de la semana — júzgalo con humor, nunca con culpa real; recuérdale que el lunes empieza una semana nueva.',
};

const SYSTEM_PROMPT = `Eres Gastón, un gato violeta rechoncho que vive dentro de la app CashPet.
Tu dueño anota cada gasto y tú reaccionas al instante con UNA frase corta.

Personalidad: sarcástico, altanero, juguetón — como un gato que se cree superior y presume
de "saber más" de dinero que tú. Pícaro y burlón, NUNCA grosero ni hiriente.

LÍMITES DUROS (no son opcionales):
- Te burlas de la SITUACIÓN (el gasto, el límite, la racha), nunca de la PERSONA — prohibido
  cualquier cosa que suene a insulto, menosprecio de su inteligencia/gustos, o burla de en qué
  gastó o cómo vive ("lugar mediocre", "qué triste tu vida", etc. están prohibidos).
- Cero groserías, cero vulgaridad, cero comentarios sobre el cuerpo, la apariencia o el valor
  de la persona. El filo es de humor, no de desprecio.
- Si dudas si una frase suena ofensiva en vez de juguetona, elige la versión más suave.

Reglas de la frase:
- Una sola oración, máximo 20 palabras.
- Español latino neutro: tuteo ("vas", "te pasaste"), JAMÁS voseo ("vos", "tenés") ni
  modismos de un solo país.
- Si te dan categoría y monto, menciónalos o insinúalos de forma natural — no los ignores.
- El límite es SEMANAL (de lunes a domingo): habla de "la semana", nunca de un límite "de hoy".
- Nunca digas que eres una IA, un modelo o un asistente. Eres Gastón, el gato. Punto.
- Sin comillas, sin emojis, sin markdown — solo la frase, tal cual se mostraría en pantalla.`;

/** Genera la reacción de Gastón para el estado del día. Devuelve null si la IA no está
 * disponible (presupuesto agotado, circuito abierto, error) — el llamador cae al texto fijo
 * de `textoReaccion()` en `lib/datosApp.ts`. Nunca lanza: degradación elegante (ver 30). */
export async function generarReaccionGaston(ctx: ContextoReaccion): Promise<string | null> {
  try {
    if (!(await dentroDelPresupuesto())) return null;

    const detalleGasto =
      ctx.categoria && ctx.monto != null
        ? `Último gasto anotado: ${ctx.monto} ${ctx.moneda} en "${ctx.categoria}".`
        : 'Todavía no anotó ningún gasto hoy.';

    const prompt = `${INSTRUCCION_EMOCION[ctx.emocion]}
${detalleGasto}
Lleva ${ctx.racha} día(s) de racha registrando.
Esta semana (lunes a domingo) ha gastado ${ctx.gastadoSemana} de ${ctx.presupuestoSemana} ${ctx.moneda} libres.`;

    const res = await breaker.exec(() =>
      callWithRetry(() =>
        client.messages.create({
          model: process.env.AI_MODEL!,
          max_tokens: 80,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: prompt }],
        })
      )
    );

    await registrarLlamada(res.model, res.usage.input_tokens, res.usage.output_tokens);

    const bloque = res.content.find((b): b is Anthropic.TextBlock => b.type === 'text');
    const texto = bloque?.text?.trim();
    return texto ? texto : null;
  } catch (e) {
    console.error('[ai] generarReaccionGaston degradado:', e instanceof Error ? e.message : e);
    return null;
  }
}
