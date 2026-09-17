# VEREDICTO revisor-visual — landing
Fecha: 2026-09-17 00:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 36/40
Craft: 18/20
Copy (si vende): 20/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos:
1. [Bridge "así se ve en tu teléfono" — mecanismo-impulso.png] La cara usada para la burbuja sarcástica ("Impresionante autocontrol el tuyo" tras 2 domicilios en la semana) es la cara Feliz por defecto (ojos grandes abiertos, sonrisa simple) — sin ninguna pista facial de sarcasmo, el chiste depende 100% del texto. Fix: usar ahí una variante con un ojo semientornado o ceja levantada (como la cara "Desconfiada" ya existente) reservando la cara Feliz plena para momentos genuinamente positivos.
2. [Hero — burbuja "¿Otro café? Qué autocontrol el tuyo"] Mismo patrón en la primera impresión de la marca: cara 100% amigable sin filo visual acompañando el comentario sarcástico. No rompe nada, pero diluye levemente el gancho de "sarcasmo como idioma" que la ficha define como personalidad central. Fix: mismo ajuste que el defecto 1, o aceptar conscientemente que el contraste cara-tierna/voz-filosa es el chiste (si es así, dejarlo documentado como decisión, no como default accidental).
3. [components/Mascota.tsx, líneas 34-39] Los ojos nuevos (r=12.5, centro y=50) se solapan geométricamente por ~2px con el borde superior de los mofletes (cy=70, r=9.5) en el rango x 21.5-34.5 — no genera artefacto visible en las 5 capturas revisadas porque los ojos se dibujan después y son opacos, pero es un margen ajustado: cualquier reducción futura del radio de los mofletes o aumento del de los ojos sí lo mostraría. Fix: separar cy de los mofletes a 72-73 o reducir levemente su radio para dejar margen real, no solo por orden de capas.
4. [docs/revisiones/estados-mascota.html vs Mascota.tsx] El archivo de referencia de estados NO importa el componente real: duplica el SVG a mano (colores hex sueltos en vez de var(--accent)/var(--mascota-*)). Si mañana cambia un token de color en tokens.css, este archivo de referencia queda desincronizado sin que nada lo avise. Fix: generar las 5 caras desde el mismo componente con props de "emoción" en vez de mantener un SVG paralelo copiado.
