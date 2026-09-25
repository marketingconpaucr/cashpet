'use client';

// template.tsx (a diferencia de layout.tsx) se re-monta en cada navegación — es lo que
// permite un fade real entre /inicio, /progreso y /perfil (defecto real, 8ª revisión de
// Inicio: el corte entre tabs era instantáneo mientras el resto de la pantalla usa easing
// en todo). Solo la transición de ENTRADA: el BottomNav necesita quedar interactivo de
// inmediato, no vale la pena un exit que retrase el tap del usuario.

import { motion, useReducedMotion } from 'motion/react';

export default function InternaTemplate({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      // Sin min-h-dvh (ver nota en layout.tsx): ya lo garantiza el layout de afuera —
      // un tercer piso de altura mínima anidado (body → layout → este template) es
      // justo el tipo de redundancia que causaba la pantalla creciendo de más en
      // navegadores móviles reales.
      className="flex flex-1 flex-col"
    >
      {children}
    </motion.div>
  );
}
