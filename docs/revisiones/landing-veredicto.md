# VEREDICTO revisor-visual — landing
Fecha: 2026-09-17 00:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 29/40
Craft: 15/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. Prueba social ausente en toda la página (Agitación/Oferta): las cifras se suavizaron ("$1.000 al año", lenguaje de posibilidad) pero sigue sin haber ni un testimonio, rating o dato citado con fuente en ningún punto del scroll → agregar al menos 1 prueba verificable (testimonio real, rating de tienda, caso) antes de publicar.
2. Copy eje "Especificidad y prueba" = 2/4 (regla de la Rúbrica 4: eje ≤2 se corrige aunque el total pase 16/20): el stack de valor de Oferta.tsx inventa precios individuales ($107.88/$19/$15) sin respaldo → o se sustituyen por precios reales de líneas de producto, o se retira el stack.
3. FICHA-AVATAR.md sigue en estado BORRADOR ("Aprobada por el usuario: NO, pendiente confirmación") y toda la landing (hero, agitación, FAQ) ya está escrita sobre esa ficha sin aprobar → conseguir aprobación formal antes de dar la landing por lista, cualquier cambio de foco de avatar obliga a reescribir copy.
4. components/landing/AppPorDentro.tsx líneas 6-9: el comentario de cabecera sigue diciendo "Sin screenshot → frame PLACEHOLDER gris... Los screenshots reales los toma la IA al cerrar la app (paso obligatorio de 19 §5)" pese a que los 4 frames ya cargan PNG reales desde app/page.tsx → actualizar el comentario para que no induzca a revertir a placeholders en un futuro cambio.
5. Redundancia de la garantía: aparece como bullet en cada plan de Oferta, como sección propia inmediatamente después, de nuevo en el FAQ y otra vez en el PS del CTA final → 4 menciones seguidas del mismo beneficio sin variar ángulo se siente insistente al bajar por el scroll; recortar a 2-3 apariciones con enfoque distinto cada vez.
