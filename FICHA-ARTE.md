# FICHA DE DIRECCIÓN DE ARTE — CashPet

## Rediseño de superficies: blanco sobrio (2026-09-24 — reabierto a pedido EXPLÍCITO del usuario, no es "cosa juzgada" roto)
- El usuario pidió, ya con la Sesión 5 (app interna) en curso: "quiero que la aplicación tenga un
  estilo más elegante, con fondo blanco" — para TODA la app (no solo la pantalla en construcción).
  Eligió que yo propusiera el estilo (sin referencia visual propia). Primera propuesta (fondo
  #FAF9F6, superficie hundida #F1EEE8, texto más neutro): el usuario pidió un 2º ajuste — "más
  blanco aún, más elegante y sobrio... es quitar el color beige". Aprobado en su forma final tras
  ver capturas de landing, Inicio, onboarding y paywall.
- Qué cambió (en `components/landing/tokens.css`, archivo único importado en toda la app —
  cambia de una vez en landing/onboarding/paywall/entrar/app interna):
  - `--bg`: de #FDF1E7 (durazno cálido) → **#FFFFFF** (blanco puro, a pedido explícito — la regla
    general del SO de "nunca #FFF puro" se levanta aquí porque el usuario lo pidió con todas las
    letras; `--surface` queda también en #FFFFFF a propósito: la separación entre fondo y cards
    ahora la dan el Hairline con borde degradado y las sombras, no un salto de color)
  - `--surface-2` (hundido): de #F7F1E9 → **#F2F1EF** (gris neutro, sin tinte café/beige)
  - `--text-primary`: de #3A2A1E (café oscuro) → **#211E1C** (casi negro, neutro)
  - `--text-secondary`/`--text-tertiary`: de #7A6A5C (gris-café/beige) → **#6F6B67** (gris neutro)
  - Los mesh de profundidad radiales (`radial-gradient` del acento en los fondos de onboarding,
    paywall, entrar y el layout de la app interna) se atenuaron ~35-40% (ej. 10%/8% → 6%/5% en
    onboarding/paywall; 14%/12% → 8%/7% en entrar; 8%/6% → 5%/4% en la app interna): el mismo
    porcentaje de tinte violeta se veía más presente contra blanco puro que contra el durazno
    original, y competía con la lectura "sobria" que pidió el usuario — se mantiene el mesh (la
    profundidad de fondo sigue siendo obligatoria, 32-DEL-MVP-AL-PRODUCTO) pero mucho más discreto.
  - Verificado con cálculo de contraste real (no estimado): texto primario/secundario sobre el
    nuevo `--bg` blanco, y texto claro del CTA sobre `--accent` (#7154E5) — todos ≥4.5:1 (AA), el
    CTA mejoró de ~4.61:1 a ~5.11:1 al ser el fondo ahora blanco puro en vez de durazno.
- Qué NO cambió: el acento violeta (#7154E5), Gastón (color, diseño, las 5 emociones), tipografía
  (Fredoka/Nunito), radios (20-24px), ni la personalidad (sarcástica/altanera/juguetona) — el
  usuario fue explícito: "podemos mantener el violeta, es quitar el color beige".
- Aplicado globalmente de una sola vez (token único) — no requirió tocar cada pantalla por
  separado, salvo el ajuste de opacidad de los 4 mesh radiales (onboarding/paywall/entrar/app
  interna, cada uno hardcodeado en su propio archivo en vez de vivir en el token). Verificado
  visualmente (capturas a 375px) en landing, Inicio, onboarding, paywall y entrar — no se relanzó
  el revisor-visual pantalla por pantalla para este cambio (es un ajuste de paleta de superficies
  ya verificado con matemática de contraste + aprobación directa del usuario con capturas reales,
  no un cambio estructural o de contenido que necesite el gate doble de nuevo).

## Cambio de mascota (2026-09-17 — reabierto a pedido EXPLÍCITO del usuario, no es "cosa juzgada" roto)
- La mascota deja de ser un blob-osito sin nombre y pasa a ser **Gastón, el Gato**: un gato
  rechoncho violeta. El sarcasmo es su idioma — reacciona a los gastos con humor altanero — pero
  la CARA es tierna y amigable, no juzgona (ver ajuste de look más abajo): personaje que se ve
  adorable y habla con filo, no que se ve regañón.
- Por qué lo pidió el usuario: "el sarcasmo es el idioma oficial de los gatos — sus regaños por
  malas decisiones financieras se sentirían 100% orgánicos". Encaja mejor con la objeción #3 de
  FICHA-AVATAR.md ("me da miedo que me regañe") resuelta con humor, no con culpa — ahora ese humor
  tiene una fuente más creíble (un gato con actitud, no un osito tierno).
- Diseño base (mismo principio de siempre: cambian ojos/boca, nunca el diseño base): cuerpo
  circular rechoncho, orejas triangulares, mofletes/cachetes gorditos, bigotes, cola — violeta
  (el mismo acento de marca, decisión del usuario: "mantiene mi marca" sobre un color de gato
  realista).
- ⚠️ AJUSTE DE LOOK (2026-09-17, mismo día, 2ª iteración): la primera versión de Gastón tenía ojos
  entrecerrados en almendra ("sleepy judging cat" de memes) y una sonrisa asimétrica de
  superioridad. El usuario vio el resultado renderizado y dijo "está horrible el gato, me imagino
  algo más amigable y lindo", mandando 2 referencias (un gato de ojos ENORMES y redondos, y un
  gato minimalista de ojos cerrados/felices sentado con un corazón en el pecho). Eligió una
  MEZCLA: proporciones simples tipo el 2º gato + ojos grandes y redondos tipo el 1º. Y confirmó
  que Gastón se ve tierno pero sigue hablando con sarcasmo (el copy de las burbujas no cambió por
  esto). Ojos por defecto ahora: dos círculos grandes blancos con pupila negra y brillo, boca
  simple y contenta (sin comisura levantada). Ver `docs/revisiones/estados-mascota.html` para las
  5 emociones ya actualizadas a este look.
- Mecanismo de "crecimiento" (reemplaza el brote-que-crece del diseño anterior, que no aplicaba a
  un gato): Gastón nace gatito/bebé y va creciendo físicamente con la racha, y ADEMÁS gana
  accesorios (referencia del usuario: un widget tipo "mascota de grupo" con barra de progreso,
  atuendos desbloqueables y medallas de racha por días — 3/10/30/100/200). Para CashPet, los
  accesorios de Gastón deben reforzar su sarcasmo/estatus (moñito, monóculo, coronita — no disfraces
  de otros animales al azar como en la referencia, que no encajan con "se cree superior").
  ⚠️ DECISIÓN DE ALCANCE: la etapa gatito→adulto y el selector de accesorios son una FUNCIÓN de la
  app interna (gamificación, 24-GAMIFICACION.md) — se construyen en Sesión 5, no en la landing.
  Por ahora la landing/mockups usan la versión "adulta" única de Gastón; no se construye ningún
  selector de atuendos todavía.
- Qué NO cambió: paleta (#7C5CFC vigente para app/onboarding/paywall; la landing usa su propio
  ajuste de contraste #7154E5, ver nota técnica abajo), tipografía (Fredoka/Nunito), radios,
  sombras, ni la lógica de 5 emociones basada en el Excel del usuario (solo se re-dibujó para un
  gato y se renombraron 2 de las 5, ver abajo).

## Referencia del usuario (CONTRATO — ver 16, protocolo obligatorio)
- ¿Hay imagen(es) de referencia del usuario?: SÍ → 5 capturas (apps "Party Animals"/mascotas 3D, "lila", "Habitz", "SaveSmart") + ajuste propio pidiendo que la mascota "dé ganas de cuidarla"
- Extracción (mirada con herramienta de imágenes):
  - Modo: claro · Fondo: #FDF1E7 (crema durazno) · Superficie: #FFFFFF · Texto 1º/2º: #3A2A1E / #7A6A5C
  - Acento(s): #7C5CFC (violeta) — en CTA principal, chips de ícono, insight de racha, tabbar activa
  - Display: geométrica muy redondeada → Fredoka · Body: humanista redondeada → Nunito
  - Radio: cards 24px / botones 20px (casi píldora) · Espaciado: aireado
  - Sombras: sutil, tintada de violeta (nunca negra)
  - Bordes: hairline degradado sutil en la card héroe, no bordes duros
  - Textura/gradiente: fondo plano cálido (durazno) + hairline degradado en cards clave
  - Layout: hero-dato (mascota + racha) + cards apiladas
  - Detalle firma a replicar: la mascota como blob con orejitas, mofletes y brote — protagonista de la pantalla principal
- Prohibiciones anti-IA que la referencia LEVANTA: ninguna (paleta clara + 1 acento cumple accesibilidad)

## Identidad derivada
- Referencia-mandato de las 5 capturas del usuario (no aplica Tabla de Líderes de nicho para el LOOK — esa tabla, con Cleo/Duolingo/Nubank, sigue vigente solo para el MECANISMO de negocio en FICHA-MODELO.md)
- Combinación tipográfica: Fredoka (display) + Nunito (body) — ambas geométricas redondeadas, family friendly, coherente con el mood de las capturas
- Arquetipo: Bufón (el sarcasmo como humor, no la ternura) · Mundo del sujeto: gato de internet que se cree superior y juzga a su dueño — Gastón, el Gato, un gato rechoncho con cara amigable y ojos grandes
- Dispositivo ownable: Gastón, el Gato — rechoncho, violeta, ojos grandes y redondos, cola y bigotes · crece de gatito a adulto con la racha + gana accesorios de sass (Sesión 5, ver "Cambio de mascota" arriba) · paleta violeta tomada de las capturas originales del usuario, conservada a pedido explícito

## Personalidad compilada
- 3 adjetivos de personalidad: sarcástica, altanera, juguetona (antes: tierna, cálida, juguetona — cambiado junto con la mascota, 2026-09-17). Gobiernan la VOZ/copy (las burbujas de Gastón, el tono de las notificaciones futuras); el LOOK del personaje se suavizó después (ver "Ajuste de look" arriba) a pedido del usuario — cara amigable de ojos grandes, no juzgona. Un personaje puede verse tierno y hablar con filo; eso es a propósito, no una contradicción.
- Compilación: spring suave (no rebote agresivo) · duración base ~220ms · exclamaciones máx 1/pantalla (la reacción de Gastón) · celebración de nivel: Gastón "crece" (Sesión 5) · radio tendencial 20-24px

## Sistema de emociones de Gastón (ver docs/revisiones/estados-mascota.html)
> Origen: la plantilla Excel propia del usuario ("Mi_Presupuesto.xlsx") ya tenía un sistema de
> mensajes con emoción según el gasto (comentarios condicionales por categoría y por mes). Se
> adopta esa MISMA lógica de umbrales, traducida a 5 caras de Gastón — no una mascota única.
> 2 de las 5 se renombraron el 2026-09-17 para sonar a gato sarcástico, no a mascota tierna.
- 🎉 Celebrando — gasto total < 70% del ingreso, o quedó muy por debajo del presupuesto de una categoría (equivale a "Woohoo, gastando menos del 70%" / "Bien, quedaste X% abajo" del Excel) — Gastón ronronea y duerme sobre el "saldo en verde"
- 😊 Feliz (default) — dentro de presupuesto con margen razonable — ojos grandes y redondos, sonrisa simple y contenta
- 😐 Neutral — gastó justo lo presupuestado (equivale a "😎 Gastaste justo lo presupuestado")
- 🙄 Desconfiada (antes "Preocupada") — cerca del límite (70-100% del ingreso) o se pasó un poco del presupuesto de una categoría (equivale a "⚠️ Cuidado, estás cerca de gastar más de lo que ganas" / "Cuidado, te pasaste X%") — side-eye, un ojo más cerrado que el otro
- 😒 Decepcionada (antes "Triste") — gastó más de lo que ganó ese mes (equivale a "Ya fue... gastaste más de lo que ganaste") — Gastón NO llora (un gato no llora, juzga): párpados caídos, boca fruncida, sin lágrimas
- Regla de ahorro (afecta el diálogo, no la cara): sin ahorros → Gastón lo menciona con sarcasmo, no con culpa ("¿y tus ahorros para este mes? Ah, cierto."); con buen ahorro → usa la cara Celebrando
- Estas 5 caras son variaciones del MISMO personaje (mismas orejas/mofletes/bigotes/cola) — cambian ojos, boca y cejas, nunca el diseño base

## Brand kit final (valores para globals.css/@theme)
- Fondo: #FFFFFF (rediseño blanco sobrio, 2026-09-24 — ver sección al inicio del archivo) · Superficie: #FFFFFF · Hundido: #F2F1EF · Texto 1º/2º: #211E1C / #6F6B67
- Acento: #7C5CFC (SOLO en: CTA principal, tabbar activa, insights, chips; también el pelaje de Gastón)
- Semánticos: éxito #7C5CFC (reutiliza el acento — app sin conexión bancaria, sin rojo de alarma a propósito) · error #E0574C · aviso #F5A623
- Display: Fredoka (pesos 500/600/700) · Body: Nunito (pesos 400/600/700/800) · Escala: display 42px / title 25px / body 14.5px / label 11.5px
- Radio: 20-24px (cards), 20px/píldora (botones) · Profundidad: hairline degradado + sombra tintada violeta en 2 capas · Espaciado base: escala 4·8·12·16·24·32·48·64
- Dispositivo ownable: Gastón, el Gato — rechoncho, violeta, orejas triangulares, ojos grandes y redondos, bigotes y cola
- Motion signature: easing suave (ease-out) · stagger ~60ms entre cards · firma: Gastón "respira"/parpadea sutil en estados idle (a implementar en código real, Sesión 5)

## Nota técnica (no reabre la ficha — ajuste de accesibilidad, no de identidad)
- El acento (`--accent` en `components/landing/tokens.css`) se oscureció de #7C5CFC a #7154E5
  (~9%) para que el texto crema del botón CTA pase contraste AA 4.5:1 (un primer ajuste a
  #7758F2/~4% no alcanzó: el revisor-visual midió ~4.2-4.3:1 con el texto real de --bg, más
  claro que blanco puro — se recalculó con el color de texto exacto en vez de asumir blanco).
  Sigue siendo "el mismo violeta" a efectos de identidad. **Corrección 2026-09-17:** `tokens.css`
  es un ÚNICO archivo importado una vez en `app/globals.css` — no hay una copia separada por
  ruta — así que este ajuste NO es exclusivo de la landing: `--accent` vale #7154E5 en TODA la
  app (landing, onboarding, paywall), verificado con cálculo de contraste real (#FDF1E7 sobre
  #7154E5 = 4.61:1, pasa AA). La frase anterior ("la app/onboarding pueden seguir usando
  #7C5CFC") era incorrecta y causó un defecto falso en la 5ª revisión del onboarding (el
  revisor midió contra el hex documentado aquí, no contra el CSS real) — no hace falta ningún
  cambio de código, el color ya es el correcto en las tres pantallas.

## Trazabilidad y vetos
- Ruta de diseño: RUTA 2 — referencia parcial del usuario (moodboard de 5 capturas), no propuesta desde cero
- Protocolo A/B/C: opción elegida A ("Tu mascota, en grande") · descartadas: B ("El arco de tu plata" — anillo arcoíris, lavanda) y C ("Tu compañera con carita" — timeline editorial, blanco) — ambas quedan documentadas como alternativas válidas si se quiere revisar más adelante · página comparativa: `direcciones-abc.html` (raíz del proyecto)
- Ajuste post-elección (Sesión 2): la mascota se rediseñó a pedido del usuario ("que dé ganas de cuidarla") — de un blob liso a un personaje con orejitas, mofletes y brote — aplicado ANTES de fijar la ficha
- 2º ajuste post-elección (2026-09-17, Sesión 3, ya con la ficha cerrada): la mascota se re-diseñó de nuevo, esta vez a pedido explícito del usuario para reabrir la ficha — de un blob-osito sin nombre a Gastón, el Gato (ver "Cambio de mascota" al inicio del archivo)
- Tour de la app: `vista-previa-app.html` (raíz del proyecto) · vistas incluidas: pantalla principal (M0), onboarding (pregunta de presupuesto diario), paywall (anual recomendado + mensual), mecanismo (mascota reaccionando a un gasto) · aprobado por el usuario: SÍ — 2026-09-17 (eligió A directamente tras ver la comparativa)
- Paleta derivada de: referencia del usuario (capturas "lila"/"Habitz", violeta recurrente) — tomada tal cual, sin desafinar el hue
- Registro anti-repetición: paleta violeta #7C5CFC + par Fredoka/Nunito anotados en ESTADO.md → vetados para el próximo proyecto del SO
- Modo (claro/oscuro) DERIVADO por: las 5 capturas del usuario son predominantemente claras (4 de 5) y el usuario pidió explícitamente "más amigable a la vista" — claro gana

## Idioma UI: Español (tuteo neutro LATAM, nunca voseo — ver FICHA-AVATAR.md) · Fecha de cierre de la ficha: 2026-09-17 · Aprobada por el usuario: SÍ
