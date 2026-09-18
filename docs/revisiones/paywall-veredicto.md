# VEREDICTO revisor-visual — paywall
Fecha: 2026-09-17 00:00
Screenshot: docs/revisiones/paywall-1-recap.png, docs/revisiones/paywall-2-timeline.png, docs/revisiones/paywall-3-precio-anual.png, docs/revisiones/paywall-3b-precio-mensual.png
Usabilidad: 30/40
Craft: 14/20
Copy (si vende): 17/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Pantalla precio, footer] "Restaurar compra" ejecuta exactamente lo mismo que "Ahora no" (router.push('/')) sin verificar ni restaurar ninguna compra real y sin dar ningún feedback de éxito/fracaso → implementar la lógica real (o quitar el botón hasta conectar Hotmart) y mostrar un mensaje de resultado.
2. [Toda la secuencia] No existe en código ningún estado de error (pago fallido, "no encontramos una compra activa", falla de red al navegar) — heurística 9 sin cumplir en una superficie donde el dinero está en juego → diseñar y cablear los estados de error antes de conectar el cobro real.
3. [Pantallas timeline y precio] Gastón (el dispositivo ownable de la marca) solo aparece en la pantalla 1 (recap); desaparece por completo en las otras 2, que quedan visualmente genéricas → sumar a Gastón (chico) en timeline y precio para sostener la identidad en toda la secuencia.
4. [Recap: 4 filas · Precio: checks y plan cards] Ningún ítem de estas listas tiene animación de entrada escalonada, mientras que ChipOpcion en el onboarding sí usa stagger de 50-80ms por ítem — inconsistencia de movimiento y baseline #1 (stagger de entrada) incompleta → aplicar el mismo patrón de delay-por-índice a FilaRecap, CheckItem y PlanCard.
5. [Precio: PlanCard y toggle de aviso por correo] Estos dos elementos tocables no tienen whileTap, mientras CtaButton y ChipOpcion sí lo tienen en el resto de la app → agregar whileTap={{scale:0.97}} para consistencia de feedback táctil.
