# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-17 00:00
Screenshot: docs/revisiones/onboarding-01-bienvenida.png (+ 02 a 11, recorrido completo /onboarding)
Usabilidad: 24/40
Craft: 11/20
Copy (si vende): 15/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. 3 de 11 pantallas (dolor, reconocimiento1, presupuesto) se capturaron mostrando el fantasma semitransparente de la pantalla ANTERIOR en transición de salida, no su propio contenido asentado — no se pudo verificar su render real (transición chip-autoavance: pais→dolor, dolor→reconocimiento1, momento→presupuesto) → re-capturar esperando ≥900ms tras el tap (300ms de pausa de useSeleccionUnica + 560ms de exit+enter de TransicionPaso) antes de aceptar la pantalla; si persiste con espera larga, corregir el stacking real de AnimatePresence.
2. Botones "Continuar" (categorías) y "Anotar gasto" (activación) no dan ninguna señal cuando la validación falla — app/onboarding/page.tsx líneas 306-311 y 170-180, el usuario toca y no pasa nada, sin mensaje ni hint → agregar feedback inline (mensaje o shake) cuando falta selección o el monto es inválido.
3. Las pantallas de reconocimiento (reconocimiento1 y reconocimientoFinal, componente PantallaReconocimiento en components/onboarding/ui.tsx) usan solo un ícono Lucide genérico dentro de un chip como única carga emocional del momento — viola explícitamente la regla de 50-DISENO-ONBOARDING-PAYWALL.md ("prohibido el ícono duotone genérico como ÚNICA carga del momento de reconocimiento") y no incluye el mini-visual con colores reales exigido → reemplazar por ilustración propia o mini-visual con datos reales (ej. barra límite-vs-gasto con los tokens de color de la app).
4. La fórmula de copy de reconocimiento1 (nombrar patrón + quitar culpa + nombrar mecanismo) solo se completa en la rama "Ni idea — y eso es lo que quiero descubrir"; en las otras 4 respuestas de dolor (la mayoría de usuarios) el texto nunca nombra el mecanismo "Freno de 5 Segundos" — app/onboarding/page.tsx líneas 286-297 → agregar la mención del mecanismo también en la rama genérica (else).
5. La pantalla de loading final (paso 'loading', app/onboarding/page.tsx líneas 426-436) no sigue el blueprint canónico B1/B2 de 50-DISENO-ONBOARDING-PAYWALL.md: sin anillo de progreso ni % contando, sin aparición escalonada de las 3 líneas, usa el carácter "✓" del sistema en vez de check custom SVG, y sin aria-live/aria-busy → reconstruir con el patrón del blueprint (anillo con mesetas, líneas que aparecen una a una 600-900ms, check custom, aria-live="polite").

Notas adicionales (no listadas arriba por límite de 5, pero relevantes):
- Profundidad plana: chips/cards no muestran la sombra sutil tintada violeta ni el hairline degradado que exige FICHA-ARTE.md (solo el CTA principal tiene sombra) — fondo sin textura/gradiente en toda la app.
- Carga cognitiva: el paso "país" muestra 10 chips sin buscador/agrupación (excede el umbral de 4-5 ítems antes de pedir scroll) y "categorías" muestra 7 — considerar buscador o agrupación regional para país.
