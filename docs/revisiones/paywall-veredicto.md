# VEREDICTO revisor-visual — paywall
Fecha: 2026-09-17 00:00
Screenshot: docs/revisiones/paywall-1-recap.png (+ paywall-2-timeline.png, paywall-3-precio-anual.png, paywall-3b-precio-mensual.png)
Usabilidad: 31/40
Craft: 15/20
Copy (si vende): 17/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Top defectos:
1. [Pantalla 3, toda la superficie de cobro] Cero estados de error diseñados (pago rechazado, timeout, plan inválido) → aunque el motivo (Hotmart no conectado, Sesión 6) es legítimo, hoy la heurística 9 está prácticamente vacía en la pantalla que maneja dinero real; diseñar al menos el estado de error genérico antes de declarar el paywall vendible.
2. [Pantalla 3, CTA "Empezar mis 7 días gratis"] El tap navega directo a /entrar sin ningún estado de carga/feedback intermedio; cuando se conecte el cobro real (>100ms de request) el usuario se quedará sin señal de que algo está pasando — reservar un estado loading en el CtaButton antes de integrar Hotmart.
3. [Pantalla 3, cuerpo completo] Densidad alta sin scroll: 3 checks + 2 PlanCard + CTA + microcopy + "Ahora no" + fila de confianza en una sola vista — al entrecerrar los ojos hay 5 bloques de peso similar compitiendo; recortar a 2 checks o dar más aire entre el bloque de confianza y el resto.
4. [Craft — identidad, las 3 pantallas] Gastón es un dispositivo ownable real, pero fuera de la mascota el resto del kit (cards, chips, badge de ahorro) es intercambiable con cualquier fintech gamificada clara+violeta; falta un segundo detalle de firma (textura/ilustración/trazo) que no dependa solo del personaje.
5. [Pantalla 3, fila "Pago seguro · Garantía de 15 días"] Queda como texto 12px gris pegado debajo del link de salida "Ahora no", con menos peso visual que un elemento secundario de escape — la garantía nombrada debe vivir pegada al CTA principal (ancla de conversión), no después del link de abandono.
