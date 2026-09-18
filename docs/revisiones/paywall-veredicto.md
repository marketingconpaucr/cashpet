# VEREDICTO revisor-visual — paywall
Fecha: 2026-09-17 00:00
Screenshot: docs/revisiones/paywall-1-recap.png, docs/revisiones/paywall-2-timeline.png, docs/revisiones/paywall-3-precio-anual.png, docs/revisiones/paywall-3b-precio-mensual.png
Usabilidad: 30/40
Craft: 15/20
Copy (si vende): 17/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Pantalla de precio, subtítulo + value stack] El copy no agita la escena exacta del dolor de Camila (el "20 del mes" sin saber en qué se fue el sueldo, el "microinfarto" al abrir la app del banco — FICHA-AVATAR.md) — se queda en el ángulo racional del precio ("$0.30 al día"). Fix: agregar 1 línea corta que nombre la escena antes del value stack, sin alargar el bloque de texto.
2. [Gastón en las 3 pantallas — 48-72px] El único dispositivo ownable de la marca aparece demasiado pequeño para leerse con expresión a 375px, diluyendo la identidad (FICHA-ARTE.md lo define como protagonista "hero-dato", no un ícono de esquina). Fix: subir el tamaño mínimo del mascote a 88-96px en las 3 pantallas del paywall, o sumar un segundo detalle de firma (textura/patrón propio) que sostenga la identidad cuando el gato es chico.
3. [Recap, subtítulo "Hecho con tus 6 respuestas"] Solo se listan 4 filas (país, categorías, momento, límite diario) — el usuario no puede verificar las otras 2 respuestas que dice haber dado, rompe la promesa del propio subtítulo. Fix: mostrar las 6 filas o cambiar el copy a "4 de tus respuestas".
4. [Errores claros y con solución — heurística 9, verificado en código] Cero estados de error en toda la superficie de cobro (comentario en app/paywall/page.tsx confirma que es decisión deliberada hasta Sesión 6). Deferral documentado y razonable por ahora, pero sigue siendo un hueco real: no puede declararse "lista para vender" hasta diseñar pago rechazado/timeout junto con la integración real de Hotmart.
5. [Pantalla de precio — ritmo vertical] El espacio entre el value stack ("Rachas y niveles de Gastón") y las plan cards (mt-5) es más apretado que el resto de separaciones de la secuencia (mt-8/mt-10 en recap y timeline) — pequeña inconsistencia de ritmo que un ojo entrenado nota. Fix: subir a mt-6/mt-8 para igualar el resto de la secuencia.
