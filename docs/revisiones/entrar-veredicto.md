# VEREDICTO revisor-visual — entrar
Fecha: 2026-09-17 00:00
Screenshot: docs/revisiones/entrar-1-inicial.png, docs/revisiones/entrar-2-error.png, docs/revisiones/entrar-4-enviado.png
Usabilidad: 28/40  (detalle: h1:3 h2:4 h3:2 h4:2 h5:2 h6:4 h7:3 h8:3 h9:2 h10:3)
Craft: 14/20  (detalle: jerarquía:3 profundidad:3 identidad:3 movimiento:2 encaje:3)
Copy (si vende): N/A (no vende)
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Top defectos:
1. [Input de correo, estado error — entrar-2-error.png + app/entrar/page.tsx línea 84] El borde del input NUNCA cambia de color cuando hay error: sigue con el mismo `border-[color-mix(...text-tertiary...)]` de siempre; la única señal es el texto debajo. Un usuario escaneando rápido no ve qué campo falló. Fix: condicionar el borde a `border-[var(--color-error)]` (o el token de error de FICHA-ARTE) cuando `error` no es null.
2. [Texto de error "Escribe un correo válido", línea 86] Usa `text-[var(--accent)]` — el mismo violeta del CTA y de los links — en vez del color semántico de error (#E0574C) que la propia FICHA-ARTE define y reserva para esta función. Un error que se ve igual que un link normal rompe la consistencia de tokens y tarda más en leerse como error. Fix: usar el token de error + un ícono de alerta junto al texto.
3. [Botón "Reenviar" en "Revisa tu correo", líneas 115-128] El `onClick` pone `estado` en `'enviando'` pero el botón sigue habilitado durante los 700ms del mock porque `disabled` solo depende de `segundosRestantes` (ya en 0 al momento del click). Un usuario impaciente puede tocarlo varias veces antes de que se re-deshabilite, disparando varios reenvíos reales una vez Supabase esté conectado (riesgo de rate-limit). Fix: `disabled={segundosRestantes > 0 || estado === 'enviando'}`.
4. [Header, cuadrado violeta arriba-izquierda, presente en las 3 pantallas] Es el único control de "volver" del flujo (`aria-label="Volver al inicio"`) pero visualmente es un bloque de marca abstracto sin flecha ni affordance de "atrás" — nada indica que es tapable ni a dónde lleva. En "Revisa tu correo" es además la ÚNICA salida si el usuario escribió mal el correo, y lleva a la landing completa, no de vuelta al formulario con el dato editable. Fix: agregar un link explícito "¿Correo equivocado? Cambiarlo" en el estado enviado (vuelve a `idle` conservando o limpiando el campo), y dar al ícono del header una forma de flecha reconocible.
5. [Código — `<p>` de error, línea 86, verificado en archivo] Sin `role="alert"` ni `aria-live="polite"`: un lector de pantalla no anuncia la validación cuando aparece tras el submit fallido (heurística 1 y 9 verificadas en código, no en el screenshot). Fix: agregar `role="alert"` al párrafo de error.
