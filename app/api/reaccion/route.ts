// BFF (patrón de 09-SEGURIDAD.md): el frontend llama esta ruta, nunca a Anthropic directo —
// la clave vive solo en el servidor (lib/ai.ts). Sin auth todavía (la app interna sigue en
// localStorage, Supabase Auth no está conectado aún — ver ESTADO.md "Problemas conocidos"):
// el único freno de abuso por ahora es el kill-switch de presupuesto global en lib/ai.ts.

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { generarReaccionGaston } from '@/lib/ai';

const EMOCIONES = ['celebrando', 'feliz', 'neutral', 'desconfiada', 'decepcionada'] as const;

const Entrada = z.object({
  emocion: z.enum(EMOCIONES),
  categoria: z.string().max(60).nullable(),
  monto: z.number().positive().nullable(),
  moneda: z.string().max(10),
  racha: z.number().int().min(0).max(100_000),
  gastadoHoy: z.number().min(0),
  presupuestoHoy: z.number().min(0),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = Entrada.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ texto: null }, { status: 400 });
  }

  const texto = await generarReaccionGaston(parsed.data);
  return NextResponse.json({ texto });
}
