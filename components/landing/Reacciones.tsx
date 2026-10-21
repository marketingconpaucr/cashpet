'use client';

// Franja "Gastón reacciona a cómo vas" — muestra las caras que de verdad tiene la app (las 4
// del gasto del día), cada una con la situación y una frase de ejemplo. No es sección canónica
// del 19: es un puente visual dentro de la Solución (paso 02 del mecanismo, "Gastón te hace el
// chequeo"). Las frases son las mismas que usa la app como respaldo (lib/datosApp.ts →
// textoReaccion), recortadas a la primera oración cuando pasan el presupuesto de palabras.
// Copy fuente: docs/copy/landing.md → "Puente visual — las caras de Gastón".

import { motion } from 'motion/react';
import { Mascota, type EmocionMascota } from '@/components/Mascota';
import { Kicker, SectionShell, useReveal, VIEWPORT_ONCE } from './ui';
import { MarkedCopy, warnCopy } from './MarkedCopy';

export interface ReaccionGaston {
  emocion: EmocionMascota;
  /** Situación del usuario — 2-3 palabras, en mayúsculas pequeñas. */
  situacion: string;
  /** Frase de ejemplo de Gastón (máx 14 palabras). */
  frase: string;
}

export function Reacciones({
  kicker = 'ASÍ REACCIONA',
  tituloMarked,
  subtitulo,
  reacciones,
}: {
  kicker?: string;
  tituloMarked: string;
  subtitulo: string;
  reacciones: ReaccionGaston[];
}) {
  warnCopy('Reacciones → título', tituloMarked, 8);
  warnCopy('Reacciones → subtítulo', subtitulo, 14);
  reacciones.forEach((r, i) => warnCopy(`Reacciones → frase ${i + 1}`, r.frase, 14));
  const { contenedor, item } = useReveal();

  return (
    <SectionShell elevacion="elevada" compacta ariaLabel="Las reacciones de Gastón">
      <motion.div variants={contenedor} initial="hidden" whileInView="visible" viewport={VIEWPORT_ONCE}>
        <motion.div variants={item} className="mx-auto max-w-[620px] text-center">
          <Kicker>{kicker}</Kicker>
          <h2 className="text-balance text-[30px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)] md:text-[40px]">
            <MarkedCopy text={tituloMarked} />
          </h2>
          <p className="mt-3 text-[15px] leading-snug text-[var(--text-secondary)] md:text-[17px]">{subtitulo}</p>
        </motion.div>

        {/* Mobile: filas (cara a la izquierda, texto a la derecha) — en 2 columnas el texto se
            apretaba a 5-6 líneas. md: 2×2. lg: 4 tarjetas en columna. */}
        <ul className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          {reacciones.map((r) => (
            <motion.li
              key={r.situacion}
              variants={item}
              className="flex items-center gap-4 rounded-[var(--radius-card)] bg-[var(--surface-2)] p-4 lg:flex-col lg:gap-3 lg:p-6 lg:text-center"
            >
              <Mascota size={88} emocion={r.emocion} />
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--accent)]">{r.situacion}</p>
                <p className="mt-1 text-pretty text-[15px] font-medium leading-snug text-[var(--text-primary)]">
                  &ldquo;{r.frase}&rdquo;
                </p>
              </div>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </SectionShell>
  );
}
