'use client';

// Hace que una pantalla se vuelva a pintar sola cuando cambia el día del celular. Sin esto, una
// app que queda abierta pasada la medianoche seguía mostrando el día (y la semana) anterior hasta
// que el usuario tocaba algo o recargaba. Dos mecanismos a la vez, porque ninguno alcanza solo:
//  · un temporizador a la próxima medianoche local (cubre la app abierta y a la vista);
//  · revisar al volver a la pestaña/app (en segundo plano el celular pausa los temporizadores).
// Devuelve la fecha local de hoy ('YYYY-MM-DD'); lo que importa es que su cambio fuerza el re-render,
// y los cálculos del día/semana/racha (lib/datosApp.ts) leen la fecha actual al pintarse.

import { useEffect, useState } from 'react';
import { aISO } from '@/lib/semana';

export function useFechaHoy(): string {
  const [hoy, setHoy] = useState(() => aISO(new Date()));

  useEffect(() => {
    const revisar = () => setHoy((anterior) => {
      const actual = aISO(new Date());
      return actual === anterior ? anterior : actual;
    });

    let temporizador: ReturnType<typeof setTimeout>;
    const programar = () => {
      const ahora = new Date();
      // 1 s después de la medianoche, para caer seguro en el día nuevo.
      const proximaMedianoche = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + 1, 0, 0, 1);
      temporizador = setTimeout(() => {
        revisar();
        programar();
      }, proximaMedianoche.getTime() - ahora.getTime());
    };
    programar();

    const alVolver = () => {
      if (document.visibilityState === 'visible') revisar();
    };
    document.addEventListener('visibilitychange', alVolver);
    window.addEventListener('focus', revisar);
    return () => {
      clearTimeout(temporizador);
      document.removeEventListener('visibilitychange', alVolver);
      window.removeEventListener('focus', revisar);
    };
  }, []);

  return hoy;
}
