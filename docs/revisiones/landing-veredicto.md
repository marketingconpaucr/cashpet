# VEREDICTO revisor-visual — landing
Fecha: 2026-09-17 00:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 31/40
Craft: 14/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Puente Solución→carrusel y frame "Mecanismo" de AppPorDentro] La misma captura `mecanismo.png` se repite dos veces en el mismo scroll (a segundos de diferencia) — cheapens la sensación de "enriquecido" que se buscaba con esta ronda → usar una captura distinta para el frame "Mecanismo" del carrusel, o eliminar el puente duplicado.
2. [Bloque "$1.800–$2.400" y puente de mecanismo, entre Agitación/Solución y Solución/carrusel] Ambos bloques nuevos son `<div>` sueltos que no usan `SectionShell`/`useReveal` del kit: no tienen stagger de entrada, y el número más grande de toda la página ($1.800–$2.400, 48px) no cuenta hacia arriba pese a ser exactamente el caso de uso del baseline "conteo animado de números héroe" → migrar ambos bloques al patrón motion del kit y animar el conteo del número.
3. [Transición Solución → puente del mecanismo] Ambas secciones usan el mismo `--bg` sin separador ni cambio de superficie — se funden en un solo plano, rompiendo la alternancia base/elevado que sí se respeta en el resto del scroll (código: `app/page.tsx` líneas 113-149) → alternar una de las dos a `--surface` o `--surface-2`.
4. [Header, esquina superior derecha, enlace "Entrar"] Apunta a `/entrar`, ruta que no existe en `app/` (404 al hacer clic) — viola la propia regla del kit ("todo enlace apunta a una página que existe") aplicada solo al footer → crear la página de login o quitar el enlace hasta que exista.
5. [CTA violeta con texto crema, en Hero/Oferta/CtaFinal] Contraste medido texto-sobre-botón ≈3.9:1 (accent #7C5CFC vs texto --bg #FDF1E7 a 17px semibold) — por debajo de 4.5:1 AA para texto que no califica como "grande" → oscurecer el texto del botón o ajustar el acento.
