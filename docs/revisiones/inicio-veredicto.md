# VEREDICTO revisor-visual — Inicio
Fecha: 2026-09-24 00:00
Screenshot: docs/revisiones/inicio-1-normal.png
Usabilidad: 28/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Hoja "Anotar gasto" — selector de categoría, page.tsx línea 61 `setCategoria(null)`] cero valor por defecto: cada vez que se abre el formulario hay que volver a tocar una categoría desde cero, aunque sea la MISMA de la mitad de los gastos del día (esta pantalla es el ritual diario, se usa 3-5 veces/día) — heurística 7, señalado en la 10ª ronda y otra vez sin tocar → preseleccionar (sin bloquear el cambio con un toque) la categoría del último gasto anotado.
2. [Fila de gasto en "Hoy", components/app/ui.tsx líneas 184-199] toda la fila es tappable para editar (`onEditar`) pero no lo comunica: solo el ícono de basura a la derecha sugiere interacción, nada indica que tocar el nombre/monto abre edición — un usuario nuevo no descubre que puede corregir un dígito sin borrar y recrear → agregar un signo visual sutil (chevron-right 14px o ícono de lápiz) al final de la fila, junto al monto.
3. [Input "Monto (₡)", page.tsx línea 283-292] no formatea separador de miles mientras se escribe (se ve "20000" en texto plano) aunque el resto de la pantalla —barra, filas, límite— sí agrupa con `Intl.NumberFormat` ("₡20 000") → inconsistencia de formato entre el único campo editable y todo lo demás (heurística 4) → aplicar el mismo formateo en `onChange` para mostrar el monto ya agrupado mientras se escribe.
4. [Grilla de categorías por defecto, inicio-2-formulario.png / page.tsx línea 296] la primera decisión que ve el usuario son 5 chips (4 frecuentes + "Otra"), en el borde superior del gate de carga cognitiva (≤4-5) — issue heredado de rondas previas, de bajo valor y nunca priorizado → si se quiere margen real, sacar "Otra" de la grilla a un enlace de texto aparte y dejar 4 chips netos.
5. [Toast "Gasto eliminado", page.tsx líneas 212-234] el `role="status" aria-live="polite"` ya está bien puesto (fix verificado de esta ronda), pero la ventana de deshacer de 4s no tiene ninguna señal visual de cuenta regresiva — un usuario distraído pierde el "Deshacer" sin darse cuenta de cuánto tiempo le quedaba → agregar una barra de progreso angosta debajo del texto que se vacíe en los 4s.

## Nota sobre el patrón de 11 rondas (pedido explícito del solicitante)
El bug de esta ronda (parseo de montos con separador de miles, corrupción silenciosa de dinero real)
está CORREGIDO y VERIFICADO contra el código: `monto.replace(/[^\d]/g, '')` + `parseInt(..., 10)` cubre
tanto "25.000" como "25,000" sin ambigüedad, consistente con que todas las monedas de la app usan
`maximumFractionDigits: 0`. Es, sin duda, el hallazgo más grave de las 11 pasadas y su corrección es
sólida — no hay reincidencia visible en el código ni en los 7 screenshots de flujo revisados. El
`aria-live` del toast y los `min-h-11` de los 3 enlaces (líneas 328 y 349) también están confirmados
en el código, no solo prometidos.
Dicho esto, el gate de USABILIDAD (≥36/40) sigue sin cruzarse, y no por falta de pulido general —el
craft lleva 3 rondas ≥16/20 y esta pantalla es visualmente sólida— sino porque quedan al menos DOS
defectos reales con impacto de producto, no cosméticos: (1) la ausencia de un valor por defecto de
categoría penaliza directamente el LOOP DIARIO que esta pantalla existe para servir (se paga varias
veces al día, no una vez); (2) la fila de gasto editable sin ningún signo visual es un problema de
descubribilidad genuino, no un capricho de revisor — un usuario que nunca lee changelogs no tiene
forma de saber que puede corregir un error de dígito sin borrar y recrear. Los defectos #3, #4 y #5
sí son de menor valor y con retornos decrecientes: son pulido fino (formato en vivo del input,
5 vs. 4 chips, barra de progreso del undo) que un ojo entrenado nota pero que no cambia el
comportamiento de un usuario real de forma medible.
Recomendación honesta: NO corresponde aceptar el estado actual como "listo" todavía — quedan #1 y #2
como accionables con valor real y esfuerzo bajo (ambos son cambios de una función/un ícono, no
rediseños). Pero SÍ corresponde reconocer que la pantalla ya no tiene bugs de integridad de datos ni
huecos de accesibilidad duros: de aquí en adelante el trabajo que falta es específico y acotado
(2 fixes reales, no una nueva ronda de exploración), y una 12ª pasada que resuelva #1 y #2 tiene
trayectoria realista de cruzar el gate de usabilidad sin tocar más nada del craft.
