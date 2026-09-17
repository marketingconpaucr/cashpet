# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-17 00:00
Screenshot: docs/revisiones/onboarding-01-bienvenida.png (+ 02 a 11c, recorrido completo /onboarding, 15 capturas)
Usabilidad: 32/40
Craft: 15/20
Copy (si vende): 16/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Top defectos:
1. [Header, pantalla "país" (indice=1), page.tsx línea 232 `mostrarAtras = ... && indice > 1`; onboarding-02-pais.png] En el 2º paso del recorrido el header sigue mostrando el logo-a-inicio en vez de la flecha "atrás" que ya usan todos los pasos siguientes — un usuario que avanza y quiere retroceder un paso (no salir del todo) no tiene esa opción justo aquí, rompiendo la consistencia del propio patrón de header (heurística 4) → bajar el umbral a `indice > 0` para que "país" también muestre flecha atrás.
2. [Lista "país", onboarding-02-pais.png] 9 países + chip "Otro país" exigen scroll y la captura corta antes de llegar a "Otro país" — quien no ve su país en la lista visible no tiene pista de que existe una salida más abajo (heurística 6/gate de carga cognitiva, ítem "≤4-5 antes de scroll") → agregar un hint visual de scroll (fade inferior) o mover "Otro país" fijo debajo del buscador, no al final de la lista.
3. [CtaButton, components/landing/ui.tsx línea 206, usado en todo el onboarding] Texto `--bg` (#FDF1E7) sobre `--accent` (#7C5CFC) mide ~3.95:1 — pasa el piso de 3:1 exigido para el CTA-vivo pero queda bajo el 4.5:1 de AA para texto normal (17px/600 no califica como "texto grande" con margen cómodo) → oscurecer levemente `--accent` para uso en app/onboarding (mismo ajuste que ya se hizo en la landing con #7154E5) o subir el peso/tamaño del label del botón.
4. [Craft eje 4 — movimiento, `reconocimientoFinal`, ui.tsx `PantallaReconocimiento` líneas 161-192, onboarding-10-reconocimientofinal.png] La pantalla que el propio copy llama "hito" ("Ya diste el primer paso") solo tiene fade-in + barra que se dibuja — no hay celebración real (mascota con spring/bounce, partícula, halo) que la distinga de una pantalla de reconocimiento normal → dar a este paso un tratamiento único (Gastón con spring más marcado o un micro-destello) reservado para hitos reales, distinto del fade estándar de las demás `PantallaReconocimiento`.
5. [Craft eje 1/8, pantallas "dolor"/"momento"/"presupuesto", onboarding-03/06/07] El patrón `justify-center` que resolvió los vacíos rotos de la 4ª pasada ahora centra el bloque dejando ~130-150px simétricos de aire arriba y abajo en varias pantallas de pregunta — ya no se ve roto, pero para el estándar de "pantalla llena de valor" (regla 7) sigue sintiéndose despoblada frente al resto del flujo (que sí llena el espacio con chips/inputs) → considerar un elemento de apoyo ligero (ilustración pequeña de Gastón o un dato de contexto) en las preguntas de opción única más cortas.

Defectos de la 4ª pasada verificados:
1. [Vacío ~350-400px en "presupuesto" entre feedback y CTA] RESUELTO — `SliderCompromiso` (ui.tsx línea 243) quitó el `mt-auto` y centra todo el bloque con `justify-center`; el vacío remanente es ahora simétrico arriba/abajo, no roto (ver TOP #5 de esta pasada, ya no es un defecto de ruptura sino de densidad).
2. [Vacío ~200-230px en "activación" sin reacción] RESUELTO — el contenedor (page.tsx línea 447) usa `justify-center pb-16` cuando `!reaccion`; onboarding-08-activacion.png confirma los márgenes arriba/abajo prácticamente simétricos.
3. [Fondo 100% plano en toda la app] RESUELTO — capa fixed con 2 `radial-gradient` del acento (page.tsx líneas 236-245) visible en las 15 capturas, aporta el 3er nivel de profundidad ("base") que faltaba.
4. [Inputs libres sin `<form>`, Enter no funcionaba] RESUELTO — los 3 inputs de texto libre (país-otro línea 296, categoría-otra línea 387, monto de gasto línea 454) están envueltos en `<form onSubmit>` con la misma validación que sus botones.
5. [Último ítem del checklist de `PantallaLoading` nunca mostraba su check antes de navegar] RESUELTO — el timer `completar` (ui.tsx líneas 314-317) marca todos los ítems completos ~400ms antes de `onCompletar`; confirmado en la nueva captura onboarding-11c-loading-final.png (3/3 ítems con check antes del salto a /paywall).

Notas adicionales (no listadas arriba por límite de 5):
- [Copy, eje "Claridad de oferta" = 2/20] Sigue igual que en la 4ª pasada: el onboarding no revela precio por diseño (se difiere al paywall). La regla "ningún eje ≤2" sigue técnicamente incumplida — aceptado como diferido, a condición de que el paywall retome el mecanismo "Freno de 5 Segundos" con la misma fuerza y cierre la oferta explícitamente.
- [Accesibilidad menor] Los inputs de texto libre usan solo `placeholder` como indicación (sin `<label>` asociado) — no bloquea, pero un lector de pantalla pierde el contexto en cuanto el usuario empieza a escribir.
- [Craft eje 3 — identidad] La "respiración"/parpadeo idle de Gastón sigue sin implementarse (queda anotado en FICHA-ARTE.md como Sesión 5) — no se penaliza esta pasada porque el alcance ya lo declara diferido, pero seguirá siendo la puerta de entrada al 4/4 del eje 3.
