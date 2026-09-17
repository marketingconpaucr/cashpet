# VEREDICTO revisor-visual — landing
Fecha: 2026-09-17 00:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 35/40
Craft: 17/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [components/landing/CtaFinal.tsx — botón "Quiero mi mascota financiera" sobre el bloque invertido "Deja de gastar en piloto automático"] El fix de accesibilidad que oscureció --accent de #7C5CFC a #7154E5 (tokens.css) resolvió el contraste del CTA contra --bg (~4.6:1, ok) pero rompió el contraste del MISMO botón contra el fondo oscuro de este bloque (--text-primary #3A2A1E): antes medía ~3.13:1 (pasaba el piso de 3:1 de UI), ahora mide ~2.68:1 — por debajo del mínimo. Es el único CTA de la página que no cumple las 4 anclas del "CTA héroe vivo" → en este bloque, pinta el botón con un acento más claro (p.ej. el #7C5CFC original, que aquí sí pasa) o agrégale un borde de 1px en color-mix(--bg 20%) para separarlo ópticamente del fondo; no reuses el mismo --accent oscurecido pensado para fondos claros.
2. [components/landing/Garantia.tsx — condicionMarked + pisoLegal] El texto no aclara si "tus primeros 15 días" de garantía corren desde el registro o desde el primer cobro (después de los 7 días gratis) — con dos plazos superpuestos (7 + 15) el usuario tiene que inferir la secuencia → reescribir explícito: "15 días desde tu primer cobro (después de tus 7 días gratis)".
3. [app/page.tsx L54 — franja de prueba social bajo el CTA del hero] "Como el mecanismo detrás de Cleo, con más de 1.1 millones de usuarios pagos" es una cifra de un competidor, no de CashPet, y se presenta sin fuente ni fecha visible para el usuario (a diferencia del dato "+$1.800" que sí trae respaldo en FICHA-AVATAR.md) → mover a nota a pie con fuente, o reemplazar por un dato propio de CashPet apenas exista.

Nota de progreso (6ª pasada): los 5 defectos de la 5ª pasada están verificados como corregidos en código — frames unificados a rounded-[30px]/border-[5px] en ambos puentes, escenas del mecanismo con expresión y contexto distintos (verificado visualmente en mecanismo.png vs mecanismo-impulso.png), contraste del CTA del hero recalculado y ahora real (~4.6:1), ancla desktop agregada, fallback onError en las 6 imágenes. El gate de usabilidad (35/40) queda a 1 punto del umbral (36), bloqueado principalmente por el defecto #1 (regresión de contraste introducida por el propio fix #3 de esta pasada, que solo se midió contra --bg y no contra el fondo oscuro de CtaFinal).
