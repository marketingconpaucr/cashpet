# Copy marcado — Onboarding de CashPet

> Derivado de `FICHA-AVATAR.md` (avatar: Camila) y `docs/sistema/02B-ONBOARDING-Y-PAYWALL.md`
> (5 trabajos del onboarding + banco de preguntas de FINANZAS). 5 preguntas — nicho "consumo
> personalizado/finanzas/hábitos" (02B): "empezar con 4-8 pasos de alto rendimiento".

## 0. Bienvenida
- Gastón se presenta, cero preguntas (peldaño 1 de la escalera: demostrar antes de pedir).
- `Hola, soy Gastón` / `Contesta unas preguntas rápidas y te muestro cómo te voy a frenar antes de la próxima compra que ibas a lamentar.`

## 1. País/moneda (identidad/contexto — nueva, a pedido del usuario 2026-09-17)
- `¿En qué país estás?` — 9 países LATAM con moneda propia + "Otro país" (escape hatch con campo de texto).
- Por qué: cada monto que la app muestre después debe estar en la moneda real del usuario, no en USD fijo — ver ESTADO.md → Decisiones técnicas.

## 2. Pregunta-ancla del dolor (eco DIRECTO del dolor #1 de FICHA-AVATAR)
- `¿Cuándo sientes que se te evapora el dinero?` — chips: quincena/fin de mes · fines de semana · gastos hormiga del día a día · compras por impulso en línea · "Ni idea — y eso es lo que quiero descubrir" (el avatar hablando, último chip siempre presente por ser pregunta sensible/abierta).
- Eco literal de FICHA-AVATAR: "Llega el 20 del mes y literalmente no sé en qué se me fue toda la plata."

## Reconocimiento 1 (tras pregunta sensible — fórmula de 50 §A5: nombrar patrón + quitar culpa + nombrar mecanismo)
- `No es falta de voluntad` — el cuerpo varía según la respuesta (2 variantes: si eligió "ni idea", refuerza que el problema es la falta de aviso a tiempo; si eligió una opción concreta, la elogia como ventaja antes de nombrar la causa real).

## 3. Categorías de gasto hormiga (segmentación funcional FINANZAS, multi-select)
- `¿En qué se te va más el dinero?` — café y antojos · comida a domicilio · compras en línea/redes · salidas y ocio de fin de semana · suscripciones que ya ni uso · transporte (Uber/taxi) · "Otra cosa".
- Fuente: categorías de "gasto hormiga" específicas del mecanismo (no el presupuesto completo del Excel del usuario — Renta/Servicios/etc. son categorías fijas, no impulsivas, quedan fuera de este onboarding).

## 4. Momento de riesgo (pregunta de anclaje contextual, obligatoria por 02B — ancla la hora de notificación)
- `¿En qué momento sueles gastar sin pensarlo?` — al despertar/mañana · a la hora del almuerzo · en la tarde/noche al salir · **de madrugada, cuando no puedes dormir** (agregada a pedido del usuario 2026-09-17, escena de compra nocturna por insomnio) · fines de semana en general.
- Fija la hora de la futura notificación "racha en riesgo" (24-GAMIFICACION.md).

## 5. Presupuesto diario (compromiso — A6, commitment device)
- `¿Cuánto quieres gastar como máximo al día?` — slider en la moneda del usuario (no chips fijos: los montos varían demasiado entre monedas). Feedback contextual según el rango elegido (ajustado/realista/generoso), nunca juzga.

## Activación real (trabajo 3 de 02B: HACER algo, no leer)
- `Anota tu primer gasto` — monto libre + categoría (reusa las de la pregunta 3). Al anotar, Gastón reacciona con una de sus 5 emociones según el monto vs. el presupuesto fijado (ver ESTADO.md → umbrales) — la primera prueba real del mecanismo, antes de pedir cuenta o pago.

## Reconocimiento final — ETIQUETADO POSITIVO (obligatorio, regla b de LA ESCALERA en 02B)
- `Ya diste el primer paso` — `Pocos definen su límite Y anotan un gasto antes de tener la app instalada. Tu Freno de 5 Segundos va a usar exactamente esa disciplina que ya mostraste.`

## Loading — "Construyendo tu plan" (patrón Noom, argumento de apertura del paywall)
- `Armando tu Freno de 5 Segundos…` con 3 líneas que usan las respuestas REALES: el límite diario en su moneda, sus categorías de riesgo, su momento de riesgo — nunca genérico ("Cargando…").
