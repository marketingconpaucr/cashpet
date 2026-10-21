# Copy marcado — Onboarding de CashPet

> Derivado de `FICHA-AVATAR.md` (avatar: Camila) y `docs/sistema/02B-ONBOARDING-Y-PAYWALL.md`
> (5 trabajos del onboarding + banco de preguntas de FINANZAS). 5 preguntas — nicho "consumo
> personalizado/finanzas/hábitos" (02B): "empezar con 4-8 pasos de alto rendimiento".

## 0. Bienvenida
- Gastón se presenta, cero preguntas (peldaño 1 de la escalera: demostrar antes de pedir).
- `Hola, soy Gastón` / `Contesta unas preguntas rápidas y te muestro cómo te voy a decir si vas bien o te estás pasando, apenas anotes un gasto.`
- ⚠️ RENOMBRADO 2026-09-24: la frase anterior ("te voy a frenar antes de la próxima compra que
  ibas a lamentar") implicaba una intervención pre-compra que la app no hace — ver nota de
  renombrado del mecanismo en `docs/copy/landing.md`.

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

## 5. Presupuesto mensual — lo fijo (compromiso — A6, commitment device)
- `¿Cuánto gastas al mes en lo fijo — renta, recibos, súper?` — slider en la moneda del usuario. Feedback contextual (ajustado/realista/amplio), nunca juzga.
- ⚠️ AGREGADO 2026-09-24 (a pedido del usuario): antes había un único paso de "presupuesto
  diario". Se dividió en dos porque el usuario aclaró que hay dos tipos de gasto con lógica
  distinta — lo fijo/planeado (este paso) y lo libre/impulso (el siguiente) — ver ESTADO.md →
  Decisiones técnicas → "Dos presupuestos".

## 6. Presupuesto libre — el día a día (compromiso — A6, commitment device)
- `¿Cuánto quieres tener libre al día para gastos del día a día?` — slider en la moneda del usuario (no chips fijos: los montos varían demasiado entre monedas). Feedback contextual según el rango elegido (ajustado/realista/generoso), nunca juzga.
  - **Actualización 2026-10-21 (presupuesto SEMANAL):** el slider sigue siendo "al día" (como piensa el usuario) pero el feedback siempre muestra el equivalente a la SEMANA (× 7, la semana empieza el lunes). El tope sale de lo que de verdad queda — (ingreso − gastos fijos) ÷ días del mes en curso, redondeado hacia abajo — SIN piso simbólico: con ₡350.000 de ingreso y ₡300.000 de fijos el tope es ₡1.600 al día (≈ ₡11.200 a la semana), no ₡5.000. Si no queda nada (fijos ≥ ingreso) se dice tal cual y el tope es 0. La reacción del primer gasto se mide contra el tope SEMANAL.

## Activación real (trabajo 3 de 02B: HACER algo, no leer)
- `Anota tu primer gasto` — monto libre + categoría (reusa las de la pregunta 3, todas de tipo "libre"). Al anotar, Gastón reacciona con una de sus 5 emociones según el monto vs. el presupuesto LIBRE fijado (ver ESTADO.md → umbrales) — la primera prueba real del mecanismo, antes de pedir cuenta o pago.

## Reconocimiento final — ETIQUETADO POSITIVO (obligatorio, regla b de LA ESCALERA en 02B)
- `Ya diste el primer paso` — `Pocos definen su límite Y anotan un gasto antes de tener la app instalada. El Chequeo de Gastón va a usar exactamente esa disciplina que ya mostraste.`

## Loading — "Construyendo tu plan" (patrón Noom, argumento de apertura del paywall)
- `Armando tu Chequeo de Gastón…` con 4 líneas que usan las respuestas REALES: el presupuesto fijo y el libre en su moneda, sus categorías de riesgo, su momento de riesgo — nunca genérico ("Cargando…").
