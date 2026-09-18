# VEREDICTO revisor-visual — entrar
Fecha: 2026-09-17 00:00
Screenshot: docs/revisiones/entrar-1-inicial.png (+ entrar-2-error.png, entrar-4-enviado.png)
Usabilidad: 33/40
Craft: 17/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [las 3 pantallas: inicial/error/enviado] Contenido anclado arriba deja ~40-45% del viewport vacío abajo en las tres pantallas — sigue leyéndose como pantalla sin terminar aunque ya no esté partido de forma dispareja → llenar esa zona con valor real (ilustración de Gastón más presente, textura de fondo más visible) o recentrar verticalmente con menos padding superior. 2) [input de correo, tras un error] El error NO se limpia cuando el usuario empieza a corregir el valor — `onChange` (línea 98 de app/entrar/page.tsx) solo hace `setEmail`, nunca `setError(null)`, así que el borde rojo y el mensaje quedan pegados hasta el próximo submit → limpiar `error` en el mismo `onChange`. 3) [CTA en estado "enviando"] El mock dura 700ms (línea 47-50), demasiado breve para que un usuario real perciba conscientemente el spinner/opacity antes de saltar a "Revisa tu correo" → subir a ~900ms-1.2s o garantizar un mínimo de feedback visible cuando se conecte el backend real. 4) [pantalla "Revisa tu correo"] No hay ninguna pista de "revisa spam/promociones" si el correo no llega — el único camino es reenviar a ciegas → agregar una línea pequeña bajo el countdown. 5) [input de correo] El label vive solo en el placeholder y desaparece al escribir, sin ningún indicio visual persistente de qué campo es → agregar un label fijo o flotante de 12px sobre el input.
