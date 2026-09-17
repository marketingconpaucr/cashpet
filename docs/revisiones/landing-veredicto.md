# VEREDICTO revisor-visual — landing
Fecha: 2026-09-17 00:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 34/40
Craft: 16/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) Burbuja "Yo te aviso antes." (puente costo real) rompe la voz sarcástica-altanera ya establecida en el resto de Gastón — reescribir con el mismo tono ("Yo aviso antes. Tú decides ignorarme."). 2) docs/copy/landing.md §3 Agitación cita "...más de $500 al año..." pero app/page.tsx:95 dice "...hasta que sumas el año completo" — actualizar el doc fuente para trazabilidad. 3) components/landing/tokens.css:52-55 conserva `--mascota-brote-1/2` y `--mascota-blanco`, resabio del blob-osito que Mascota.tsx ya no usa — eliminar. 4) Mascota.tsx: la cola (líneas 9-12) se dibuja ANTES que el círculo del cuerpo y queda tapada — invisible en las 5 capturas — reordenar o quitarla. 5) Bigotes del gato llegan a x=96-97 de un viewBox de 100 — margen muy justo, riesgo de recorte en otros tamaños.
