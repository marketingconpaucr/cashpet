# VEREDICTO revisor-visual — Inicio
Fecha: 2026-09-24 00:00
Screenshot: docs/revisiones/inicio-1-normal.png
Usabilidad: 28/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Formulario "Anotar gasto" — parseo de monto, page.tsx línea 118-119 `monto.replace(/[^\d]/g,'')` + `parseInt`] corrupción silenciosa de dinero real con montos decimales: "12.50" se limpia a "1250" (se interpreta como separador de miles, no como centavos) — correcto para colones sin decimales, pero la MISMA función ahora también procesa la moneda secundaria (USD, línea 128-145), la moneda en la que el usuario real SÍ escribe centavos ("$12.50", "$49.99"). No hay mensaje de error: el monto guardado queda ~100x inflado sin ninguna señal. El campo "Tipo de cambio" si maneja decimales bien (línea 131, `parseFloat` con `.`/`,`) — la asimetría confirma que es un descuido, no una decisión. Fix: separar la parte entera antes de limpiar (`monto.split(/[.,]/)[0].replace(/[^\d]/g,'')`) o redondear con `Math.round(parseFloat(...))`, y agregar un caso de prueba con "12.50".
2. [Card "Llevas hoy", pantalla Inicio, screenshot principal] el dato héroe ahora excluye los gastos "Fijo" (modelo de 2 presupuestos) sin ninguna explicación en esta pantalla: "Despensa/Comida · 08:15 · Fijo · ₡3 500" está en la lista pero no movió el total de arriba, y nada en la card ("Llevas hoy ₡10 200 de ₡25 000") aclara que es solo la bolsa libre. Un usuario cualquiera nota la discrepancia sin buscarla (suma a ojo 3500+6000+4200=13700 ≠ 10200). Fix: subtítulo de una línea bajo "Llevas hoy" (ej. "de tus gastos libres, sin lo fijo del mes") o ícono (i) con tooltip.
3. [FilaGasto, components/app/ui.tsx línea 204-208] la segunda línea de cada fila ahora puede concatenar hasta 3 piezas ("10:56 · Libre · $50") sin `truncate` ni protección de overflow — a diferencia del nombre de categoría (línea 203), que sí lo tiene. No capturado en ningún screenshot con `montoOriginal` presente; con una categoría larga ("Tarjeta de Crédito") + monto original de varios dígitos el layout no está verificado. Fix: aplicar `truncate` a esa línea también y generar una captura de prueba con ambos casos combinados.
4. [Selector de moneda secundaria + campo "Tipo de cambio", page.tsx líneas 339-378] todo este bloque —el más nuevo de la pantalla— nunca se vio renderizado: ninguno de los 7 screenshots lo tiene activo. El código luce razonable (orden lógico: moneda → monto → tipo de cambio → categoría, dentro del `max-h-[85dvh]` del sheet), pero el craft visual (espaciado entre el toggle segmentado y el input de monto, si el sheet sigue cabiendo sin scroll extra en 375px) queda sin verificar. Fix: capturar `inicio-2b-moneda-secundaria.png` con `monedaSecundaria` activada antes de dar el feature por cerrado.
5. [Toggle de moneda, page.tsx línea 353] cada botón muestra símbolo + código ISO ("₡ CRC" / "$ USD") — el único lugar de la app que combina ambos; el resto del sistema (montos, placeholders) usa solo el símbolo vía `simboloMoneda()`. Inconsistencia de vocabulario visual menor (heurística 4), no confunde pero no se gana su lugar. Fix: dejar solo el símbolo, o cambiar el código ISO por el nombre coloquial ("Colones"/"Dólares").

## Nota sobre el patrón de 12 rondas (pedido explícito del solicitante)
Los dos defectos de la 11ª pasada —falta de categoría por defecto (H7) y fila editable sin señal
visual (H4/H6)— están CORREGIDOS y VERIFICADOS contra el código de esta ronda: `abrirFormulario()`
preselecciona `datos.gastosHoy[0]?.categoria` (línea 71-77) y `FilaGasto` renderiza el ícono de lápiz
junto al monto (ui.tsx línea 213). Ninguno de los dos reaparece en las 7 capturas. Ese trabajo quedó
bien cerrado y no hace falta repetirlo.
El craft se mantiene establo en 16/20 (4ª ronda seguida ≥16) — las dos features nuevas no degradaron
la jerarquía, identidad ni movimiento visibles en el screenshot principal.
Pero el gate de USABILIDAD (≥36/40) sigue sin cruzarse, y esta vez el motivo NO es deuda acumulada de
rondas anteriores: es la introducción de DOS features reales (modelo de 2 presupuestos + moneda
secundaria) que trajeron un bug de integridad de datos nuevo (#1, el más grave detectado en las 12
rondas — peor que el de separador de miles de la 10ª, porque ese SÍ tenía cobertura para el caso real
de uso; este corrompe justo el caso de uso central de la moneda secundaria: dólares con centavos) y un
hueco de comprensión nuevo (#2, el modelo de 2 presupuestos necesita una migaja de contexto que hoy no
existe en esta pantalla). Ambos son accionables en una función/una línea de JSX, no un rediseño — no
corresponde aceptar el estado actual: la app no debe guardar montos en dólares 100 veces más grandes
de lo real sin avisar. #3, #4 y #5 son de menor severidad (riesgo de layout no verificado y una
inconsistencia de etiqueta) y no bloquean por sí solos, pero conviene resolverlos en la misma pasada
ya que tocan el mismo bloque de código.
Recomendación: una 13ª ronda que corrija #1 (parseo) y agregue el subtítulo de #2 tiene trayectoria
realista de cruzar el gate de usabilidad — son los dos únicos defectos con impacto de producto real
de esta pasada; el resto es pulido de bajo riesgo.
