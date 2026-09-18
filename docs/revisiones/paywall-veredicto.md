# VEREDICTO revisor-visual — paywall
Fecha: 2026-09-17 00:00
Screenshot: docs/revisiones/paywall-1-recap.png, docs/revisiones/paywall-2-timeline.png, docs/revisiones/paywall-3-precio-anual.png, docs/revisiones/paywall-3b-precio-mensual.png
Usabilidad: 30/40  (detalle: h1:3 h2:4 h3:3 h4:4 h5:3 h6:4 h7:2 h8:3 h9:1 h10:3)
Craft: 15/20  (detalle: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3)
Copy (si vende): 17/20  (detalle: idea:3 especificidad:2 emoción:4 oferta:4 acción:4)
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Superficie de cobro completa — heuristic 9, verificado en código] Sigue sin existir NINGÚN estado de error (pago rechazado, timeout, tarjeta inválida) en las 3 pantallas del paywall; el comentario en app/paywall/page.tsx confirma que es diferido a Sesión 6. Es el techo real que mantiene la usabilidad estancada en ~30/40 desde hace 3 rondas — sin este diseño (aunque sea el estado visual, sin conectar Hotmart todavía) la pantalla de dinero no puede certificarse. Fix: diseñar y maquetar el estado de error con copy qué-pasó+qué-hacer AHORA, aunque el request real llegue después.
2. [Timeline, checkbox "¿Te avisamos por correo antes del cobro?"] El toggle cambia su propio estado visual pero no tiene ningún efecto ni confirmación visible en el resto del flujo (heurística 1: el usuario no sabe qué pasa si lo desmarca, ni ve confirmación de que su preferencia se guardó). Fix: agregar un microcopy de confirmación bajo el toggle ("Te llegará a tu correo") o eliminarlo si aún no está conectado a nada real.
3. [Pantalla de precio, Gastón a 64px] En la pantalla de mayor fricción (donde se decide pagar), el dispositivo ownable de la marca vuelve a ser el más chico de la secuencia (64px vs 96px en recap y 88px en timeline) — diluye la identidad justo cuando más pesa. Fix: subir a 80px mínimo reorganizando el espacio vertical (el value stack de 2 líneas tiene margen para ceder unos px sin comprimir el resto).
4. [Recap, 6 filas de respuestas] Las 6 filas ahora se ven completas sin scroll (bien resuelto), pero siguen sin agruparse — el gate de carga cognitiva pide ≤4-5 ítems antes de agrupar. Fix: agrupar en 2 bloques visuales (p.ej. "Tu perfil" con país+dolor+momento, "Tus primeros pasos" con categorías+gasto+límite) para que la lista se lea como 2 unidades, no 6 filas sueltas.
5. [Copy, eje especificidad y prueba] El mecanismo "Freno de 5 Segundos" y "Rachas y niveles de Gastón" se afirman sin ninguna prueba (demo, testimonio, captura del mecanismo en acción) — solo hay matemática de precio como especificidad. Fix: sumar 1 micro-prueba visual (ej. una captura chica de la burbuja de Gastón reaccionando a un gasto real, ya generada en el onboarding) junto al value stack de la pantalla de precio.
