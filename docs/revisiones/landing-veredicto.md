# VEREDICTO revisor-visual — landing
Fecha: 2026-09-17 00:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 36/40
Craft: 17/20
Copy (si vende): 20/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos:
1. [components/landing/ui.tsx — CtaButton, halo aplicado en CtaFinal] El fix de contraste es un borde de 1px semitransparente (color-mix(--bg 45%) sobre --accent): el cálculo cierra el piso de 3:1 contra el fondo oscuro (~5.7:1 con mi propio cálculo en oklab aprox., ~3.77:1 con el cálculo del builder — ambos por encima del piso), pero al ser 1px es un margen ajustado que el antialiasing de pantallas reales puede adelgazar más de lo que muestra el cálculo → validar en un dispositivo físico (no solo screenshot) antes de dar el ajuste por definitivo; si algún día se retoca --accent de nuevo, revalidar este halo contra --text-primary también.
2. [app/page.tsx — Garantía/pisoLegal] El texto quedó correcto pero largo en una sola oración con dos cifras encadenadas ("15 días desde tu primer cobro, después de tus 7 días de prueba gratis") — se entiende con una segunda lectura; un usuario que solo escanea podría necesitar releer para armar la secuencia 7+15 → separar en dos frases cortas o un mini-timeline (Día 1: empieza tu prueba → Día 8: primer cobro → hasta el día 22: garantía).
3. [toda la página — 10 secciones + 2 puentes intermedios, ~7.775px de alto] La cantidad de bloques secuenciales (hero, problema, agitación, puente-costo, solución, puente-mecanismo, carrusel, oferta, garantía, FAQ, CTA final, footer) es alta para el estándar "minimalista" del eje 8; ningún bloque individual sobrecarga, pero el scroll total es largo → si se revisita esta landing, evaluar fusionar los dos puentes intermedios (costo real + mecanismo en acción) en una sola sección.
4. [components/landing/Oferta.tsx] Los dos CTA de la sección (relleno "Empezar mis 7 días gratis" vs outline "Elegir mensual") están bien jerarquizados por estilo, pero a primer vistazo en 375px ambos compiten por atención al estar en cards de igual tamaño lado a lado (apiladas en mobile) → si se retoca, reducir aún más el peso visual del outline (texto más chico o quitar el ícono de estrella del badge en el plan mensual).
5. [components/landing — sin foco] No hay `focus-visible` custom en ningún componente del kit de landing (CtaButton, Faq, FooterLegal, dots del carrusel): se depende 100% del outline nativo del navegador, que en Chrome/Safari mobile puede no renderizarse igual sobre --accent → agregar un anillo de foco explícito (2px, color-mix con --accent) a los componentes interactivos del kit.
