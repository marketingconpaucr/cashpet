# VEREDICTO revisor-visual — landing
Fecha: 2026-09-17 00:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 30/40
Craft: 14/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Puente mecanismo (app/page.tsx ~L158) vs carrusel "La app por dentro" (components/landing/AppPorDentro.tsx L106)] Los dos frames de teléfono usan radio y borde distintos (rounded-[24px] border-4 vs rounded-[30px] border-[5px]) — mismo tipo de componente, esquinas distintas a pocas secciones de distancia → unificar a un solo valor (24px, el token --radius-card) y un solo grosor de borde en ambos frames.
2. [Puente post-Agitación "+$1.800" y puente post-Solución "mecanismo-impulso.png"] Las dos escenas nuevas (domicilio vs. compra por Instagram) ya no repiten el archivo, pero comparten pose de mascota, burbuja y botón "Listo, seguimos" idénticos — a simple vista siguen leyéndose como la misma captura con el texto cambiado, no como dos pruebas distintas del mecanismo → variar la expresión de la mascota o el encuadre entre ambas escenas.
3. [tokens.css --accent + CtaButton en ui.tsx] El acento #7758F2 sobre --bg mide ~4.2-4.3:1 (calculado), no los 4.5:1 que FICHA-ARTE.md y el comentario del código declaran como objetivo ya cumplido para el texto del botón (17px/600, no califica como texto grande) — supera el piso de 3:1 del CTA héroe pero no cierra el gap de accesibilidad que el propio fix afirma haber cerrado → oscurecer un poco más el acento o pintar el texto del botón con --text-primary, y remedir antes de dar el fix por cerrado.
4. [Toda la landing, 11 secciones de scroll] No hay salto de contenido ni ancla visible para quien no quiere leer todo (solo existen los anchors internos #oferta que usa el sticky-CTA); nada distingue la navegación por teclado más allá del comportamiento default del navegador → agregar un enlace "ver plan y precios" visible además del sticky mobile, también para desktop/teclado.
5. [Frames de /mockups/*.png en AppPorDentro y en los dos puentes] No hay fallback visual si alguna de las 6 imágenes reales no carga (solo el alt nativo del navegador) → agregar un onError que muestre el placeholder honesto que el propio componente ya sabe renderizar cuando falta el src.
