'use client';

// Mascota de CashPet — Gastón, el Gato. Un solo componente reusado en toda la app para que
// siempre sea el MISMO personaje: PNG con fondo transparente (public/gaston/), una imagen por
// emoción. Las 5 emociones del código (las 4 del gasto del día + neutral) se mapean 1:1 a las
// 5 imágenes nuevas, eligiendo la cara que calza con el TEXTO de al lado (gastas poco → feliz,
// vas bien → tranquilo, casi te pasas → preocupado, te pasaste → sarcástico). `sarcastica` es un
// estado extra solo para spots donde el copy es burlón (landing). Tamaño ≤ 72px usa la versión
// `_cabeza` (espacios chicos: Inicio, pantalla de planes, encabezados del recorrido); más grande
// usa el cuerpo completo.
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';

export type EmocionMascota = 'celebrando' | 'feliz' | 'neutral' | 'desconfiada' | 'decepcionada';

type EmocionVisual = EmocionMascota | 'sarcastica';

const IMAGEN: Record<EmocionVisual, { archivo: string; alt: string }> = {
  celebrando: { archivo: 'feliz', alt: 'Gastón feliz' },
  feliz: { archivo: 'tranquilo', alt: 'Gastón tranquilo' },
  neutral: { archivo: 'tranquilo', alt: 'Gastón tranquilo' },
  desconfiada: { archivo: 'preocupado', alt: 'Gastón preocupado' },
  decepcionada: { archivo: 'sarcastico', alt: 'Gastón sarcástico' },
  sarcastica: { archivo: 'sarcastico', alt: 'Gastón sarcástico' },
};

const TAMANO_MAXIMO_CABEZA = 72;

export function Mascota({ size = 100, emocion = 'feliz' }: { size?: number; emocion?: EmocionVisual }) {
  const reduce = useReducedMotion();
  const { archivo, alt } = IMAGEN[emocion];
  const sufijo = size <= TAMANO_MAXIMO_CABEZA ? '_cabeza' : '';
  return (
    // inline-block + caja cuadrada de `size`: ocupa el mismo lugar que el SVG anterior, así el
    // layout de cada pantalla no se mueve aunque los PNG no sean cuadrados (object-contain).
    <motion.span
      className="relative inline-block"
      style={{ width: size, height: size }}
      // Respiración idle sutil — Gastón nunca queda 100% estático, sin distraer del contenido.
      animate={reduce ? undefined : { scale: [1, 1.015, 1] }}
      transition={reduce ? undefined : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <Image
        src={`/gaston/gaston_${archivo}${sufijo}.png`}
        alt={alt}
        fill
        sizes={`${size}px`}
        // Las de 110px+ son lo primero que se ve (landing, bienvenida del recorrido): no lazy.
        priority={size >= 110}
        className="object-contain"
      />
    </motion.span>
  );
}
