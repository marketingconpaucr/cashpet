# VEREDICTO revisor-visual — Inicio
Fecha: 2026-09-24 00:00
Screenshot: docs/revisiones/inicio-1-normal.png
Usabilidad: 30/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Sheet "Anotar gasto", texto de error] El mensaje ("Escribe cuánto gastaste" / "Escribe el tipo de cambio de hoy") se renderiza SIEMPRE en la misma posición fija, después de la grilla de categorías — lejos del campo con borde rojo que realmente falló (el campo Monto está arriba de todo el formulario). Fix: renderizar el texto de error pegado debajo del campo inválido (o uno inline por campo), no en una posición fija compartida.
2. [Preview "≈ ₡26 495" bajo Tipo de cambio] Usa `text-tertiary` (el tono más apagado del sistema) y `text-xs` — justo el dato que existe para que un typo en monto/tipo de cambio no pase inadvertido antes de guardar (razón de ser de este mismo fix, ronda 13). Con ese tratamiento visual es fácil no registrarlo. Fix: subir a `text-secondary` + `font-medium` para que compita visualmente con el resto del formulario.
3. [Código — toggle "₡ Colones / $ Dólares"] Son dos `<button aria-pressed>` sueltos sin agrupador semántico (`role="radiogroup"`/`fieldset` o `role="tablist"`); un lector de pantalla no anuncia que es una sola elección mutuamente excluyente. Fix: envolver el par en `role="radiogroup"` con `aria-label="Moneda del gasto"`.
4. [Código — toast "Gasto eliminado" + Deshacer] Ventana fija de 4s sin indicador de tiempo restante; un usuario de lector de pantalla que tarda en llegar al botón "Deshacer" lo pierde sin aviso. Fix: extender a 5-6s o mostrar una micro-barra de progreso del tiempo que queda.
5. [Sistema de color, toda la app] `--text-secondary` y `--text-tertiary` son el mismo hex (#6F6B67, documentado en FICHA-ARTE.md) — el sistema tiene 2 niveles reales de texto, no 3, lo que limita matices finos de jerarquía (ej. el defecto 2 de arriba). Fix: diferenciar levemente tertiary (un tono más claro que siga pasando AA) o formalizar que el sistema es de 2 niveles y dejar de nombrar un tercero que no existe.

## Nota sobre los 3 fixes de esta ronda (verificados)
1. Preview en vivo de conversión: CONFIRMADO presente y correcto en screenshot y código (línea ~406-408 de page.tsx) — recalcula con cada tecla, se oculta si los valores no son válidos. Sin regresiones.
2. Label persistente "Tipo de cambio (₡ por $1)": CONFIRMADO — `<label>` fijo arriba del input, independiente del placeholder. Sin regresiones.
3. Contraste del toggle de moneda: el cambio de clase (`text-tertiary` → `text-secondary`) es válido, pero en esta paleta ambos tokens valen el mismo hex (#6F6B67) desde el rediseño "blanco sobrio" — el color renderizado no cambió respecto a antes del fix. Cálculo de contraste sobre `--surface-2` (#F2F1EF): ~4.68:1, pasa AA 4.5:1 por un margen ajustado pero real. Se acepta como resuelto.

## Recomendación explícita (14ª ronda, la más iterada del proyecto — onboarding=8, login=7, paywall=5)
Los 3 defectos de la 13ª pasada (concentrados en el sub-flujo opcional de moneda secundaria) están genuinamente corregidos, sin regresiones. El craft se mantiene establemente en 16/20 por 6ª ronda consecutiva — ese gate está cruzado y estable, no requiere más trabajo.

La usabilidad sube de 28/40 a 30/40 — mejora real pero modesta, y significativamente por debajo del gate de 36/40. A diferencia de rondas anteriores, el déficit YA NO está concentrado en 2-3 defectos aislados: en esta pasada, cada uno de los 10 criterios de Nielsen puntúa un 3 sólido ("bien, solo un ojo entrenado detecta qué afinar") — ninguno cae a 1 o 2 de forma clara, pero tampoco ninguno alcanza el 4 ("ejemplar, decil superior"). Cerrar los 6 puntos que faltan para 36/40 exigiría subir de 3 a 4 en al menos 6 de los 10 criterios simultáneamente — eso no es un ajuste de copy o de un color, es un salto de calidad de ejecución (feedback de error verdaderamente inline por campo, jerarquía tipográfica de 3 niveles reales, backend real con estados de carga genuinos en vez de localStorage síncrono, gamificación de hitos visible en esta pantalla, etc.) que ninguna ronda de "arreglar 2-3 defectos puntuales" va a producir.

Dado el patrón de las últimas 5 rondas reales (28, 28, 28, 28, 30) y que el craft ya es estable, la recomendación honesta es: ACEPTAR el estado actual de Inicio como production-viable (30/40 usabilidad está dentro del rango donde puntúa "la mayoría de UIs reales", 20-32/40, y el craft supera cómodamente su propio gate) y DEJAR de iterar esta pantalla con rondas de revisor-visual centradas en micro-defectos. Si se quiere cruzar 36/40 de verdad, se necesita una inversión deliberada y más grande (rediseño del sistema de mensajes de error a inline-por-campo, backend real con Supabase que traiga estados de carga genuinos, y una pasada de tipografía de 3 niveles reales) — no una 15ª ronda de "arreglar el siguiente defecto puntual".
