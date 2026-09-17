# VEREDICTO revisor-visual — landing
Fecha: 2026-09-17 00:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 36/40
Craft: 18/20
Copy (si vende): 20/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: 1. [docs/copy/landing.md, entrada "Puente visual... dato-héroe del costo"] queda una segunda mención de la burbuja vieja "Yo te aviso antes." (la corregida "Yo aviso antes. Tú decides ignorarme." solo se actualizó en la otra entrada de línea 36 que describe el mismo puente) → unificar ambas entradas en una sola y dejar la frase vigente. 2. [Mascota.tsx, renderizado a 72-120px] Gastón es geometría plana de color sólido sin sombreado interno; a tamaño chico se lee más a ícono que a personaje ilustrado → un degradé sutil o sombra interna en cuerpo/mofletes elevaría el acabado sin tocar el diseño base. 3. [heurística 3, toda la landing] no hay ninguna acción irreversible que probar control/deshacer — aceptable para una landing, pero si se agrega algo interactivo con estado (ej. toggle anual/mensual) falta previsto un patrón de undo/cambio visible. 4. [heurística 7, header/nav] el único atajo de eficiencia es el ancla "Ver plan y precios" en desktop; no hay penalización pero tampoco margen extra de flexibilidad para el usuario experto.
