# VEREDICTO revisor-visual — Inicio
Fecha: 2026-09-24 00:00
Screenshot: docs/revisiones/inicio-1-normal.png
Usabilidad: 28/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Bottom-sheet "Anotar gasto", modo moneda secundaria] Sin preview en vivo del monto convertido mientras se escribe monto+tipo de cambio → un dígito mal tecleado en cualquiera de los 2 campos (el mismo tipo de bug real ya corregido esta ronda) pasa silencioso hasta después de guardar → fix: mostrar debajo de los campos un texto pequeño "≈ ₡26 495" que se recalcule en vivo.
2. [Campo "Tipo de cambio", inicio-2b-moneda-secundaria.png] Al estar precargado con `ultimoTipoCambio` ("530"), el placeholder que lo explica (`Tipo de cambio (₡ por $1)`) desaparece para siempre tras el primer uso — el usuario ve un número suelto sin ninguna etiqueta visible → fix: label persistente arriba/al lado del input, no dependiente del placeholder.
3. [Toggle "₡ Colones" / "$ Dólares", inicio-2b] El texto de la opción no seleccionada (text-tertiary #6F6B67 sobre surface-2 #F2F1EF) mide ~3.9:1, por debajo de AA 4.5:1 para texto normal → fix: usar text-secondary en el estado no-seleccionado.

Nota de proceso (13ª ronda): los 5 defectos reportados en la 12ª pasada están correctamente
corregidos y verificados en código + captura (parseFloat de moneda secundaria, "Llevas hoy · libre",
truncate en FilaGasto, captura de inicio-2b nueva, nombres coloquiales en el toggle). Esta ronda
encontró 2 defectos nuevos, ambos en el mismo sub-flujo (moneda secundaria) que por primera vez
tiene captura — no eran invisibles antes por descuido, sino porque nunca se había visto renderizado.
Son accionables en 1 ronda más (ambos son agregar texto/label, no rearquitectura). Dicho esto, el
patrón de 13 rondas (22→29→27→29→31→27→29→33→35→28→28→28→28 en usabilidad, nunca sobre 35, craft
estable en 16-17 las últimas 4) muestra que cada corrección puntual destapa un defecto nuevo de
magnitud comparable en la misma zona de la pantalla (el formulario de moneda secundaria). Recomendación:
una ronda más centrada SOLO en ese sub-flujo (preview en vivo + label persistente + contraste del
toggle) tiene buena probabilidad de cerrar la brecha; si tras esa ronda sigue sin cruzar 36/40, es
más razonable aceptar el estado actual de este sub-flujo secundario (moneda secundaria es una función
opcional, no el ritual diario primario) que seguir iterando defecto por defecto.
