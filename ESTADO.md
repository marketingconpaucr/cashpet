# ESTADO — CashPet
Última actualización: 2026-10-01 | Sesión actual: 6

⏸️ CHECKPOINT 2026-10-01 (13) — **[BUG REAL — CORREGIDO]** El usuario reportó el caso límite exacto
que había prometido probar: ingreso = gastos fijos (₡600.000 = ₡600.000, ni un colón de sobra). El
fix anterior (checkpoint 7, `deficitMensual > 0`) dejaba fuera el caso de IGUALDAD exacta —
`deficitMensual === 0` seguía cayendo en el mensaje tranquilo de "casi igualan". Corregido en
`feedbackPresupuestoLibre`/`deficitMensualTexto` (`app/onboarding/page.tsx`): ahora `>= 0`, con un
mensaje distinto para el caso exacto ("usan exactamente todo tu ingreso") vs. el de exceso ("ya
superan tu ingreso por X"). Verificado de punta a punta con el mismo caso del usuario (Renta
₡350.000 + Comida ₡250.000 = ₡600.000, ingreso ₡600.000 escrito a mano) — el mensaje nuevo aparece
correcto; el caso de exceso real (ya probado en checkpoint 7) no se tocó y sigue intacto.

⏸️ CHECKPOINT 2026-10-01 (12) — **[NO ERA BUG — FALSO POSITIVO, 2ª vez]** Mismo patrón del
checkpoint 8: el usuario reportó el botón "Continuar" del paso categorías invisible, con captura
de pantalla con relación de aspecto distinta a 375×812. Reproducido el mismo caso EXACTO (mismas
3 categorías) en Playwright a 375×812 real → el botón se ve perfecto. Confirmado con el usuario:
seguía viendo la app desde la pestaña de vista previa de Claude (no su celular), que recorta el
contenido `fixed` cuando la ventana física es más chica que el viewport emulado — mismo defecto
de herramienta ya documentado, no de la app. Se le sugirió abrir `http://localhost:3000` en una
pestaña normal de su navegador en vez de la vista previa de Claude. Ningún código tocado.

⏸️ CHECKPOINT 2026-10-01 (11) — Vercel conectado. El usuario ya tenía cuenta (plan Hobby, bajo el
scope de equipo `marketing-con-pau`); importó el repo `marketingconpaucr/cashpet` desde el
dashboard (autorizando la GitHub App de Vercel él mismo). Primer deploy: `READY`, dominio
`cashpet.vercel.app`, SHA de producción = `d9ee459e...` (coincide con el último push) — verificado
con `get_project` del MCP de Vercel. Nota: el MCP de Vercel de este entorno NO tiene permiso sobre
el scope de equipo del usuario (`list_projects`/`list_teams` con `teamId` dan 403 "Not authorized");
`get_project`/`create_project_env` con el nombre del proyecto sí funcionan — usar esa vía mientras
no se re-autorice el scope. Variables de entorno de Supabase cargadas en Vercel → Production
(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` como planas,
`SUPABASE_SECRET_KEY` como `sensitive`) — leídas directo de `.env.local` sin mostrarlas en el
chat. Como se agregaron DESPUÉS del primer deploy, no están activas hasta el próximo deployment
(regla de `62`: cambiar una env exige redeploy) — no es problema aún porque ninguna pantalla en
producción toca Supabase todavía. Pendiente real: Preview sigue compartiendo las mismas claves de
Production por ahora (un solo proyecto Supabase) — separar cuando haya presupuesto/urgencia, ver
P3 de `62-PUBLICACION-SEGURA-Y-CONTINUA.md`.

⏸️ CHECKPOINT 2026-10-01 (10) — Conectado el MCP de Supabase (acceso directo al proyecto
`faehxespgpwdmlhgiegn`, confirmado que es el mismo proyecto cuyas claves están en `.env.local`).
Aplicadas las 2 migraciones (`0001_init`, `0002_revoke_trigger_fn_execute`) directo en la base
real — ya NO hace falta que el usuario pegue SQL a mano en el dashboard. Tablas `profiles` y
`gastos` creadas, RLS activo en ambas (verificado con `list_tables`). El advisor de seguridad de
Supabase encontró algo real que la migración original no cubría: las funciones `handle_new_user`
y `set_updated_at` (pensadas solo para dispararse como trigger) quedaban invocables directo desde
internet vía `/rest/v1/rpc/...` por los roles `anon`/`authenticated` — corregido revocando
`execute` de esas funciones para esos roles; el advisor de seguridad ahora da 0 alertas. GitHub
conectado y PUSHEADO: remote `origin` → `github.com/marketingconpaucr/cashpet`. Sin GitHub CLI ni
SSH configurados en esta máquina, así que se instaló `gh` (Homebrew) y se autenticó por el flujo
de dispositivo (código de un solo uso en github.com/login/device, aprobado por el usuario en su
navegador — cero tokens pegados en el chat). SHA local y remoto coinciden (`d9ee459e...`). Falta:
Vercel (el usuario no tiene cuenta todavía — siguiente paso natural de la secuencia de `62`).

⏸️ CHECKPOINT 2026-10-01 (9) — Arrancó en serio la Sesión 6. El usuario ya tenía cuenta de GitHub
y Supabase (sin Vercel todavía) y creó el proyecto Supabase "cashpet" (región sa-east-1). Pegó
sus 3 claves en el chat (URL, anon/publishable, service_role) — se avisó que la service_role
quedó expuesta en el historial del chat y se le pidió regenerarla; el usuario decidió posponerlo
("seguimos con el resto primero", ver Problemas conocidos). Claves guardadas en `.env.local`
(gitignored, verificado) + `.env.example` creado (sin valores reales, commiteado). De paso se
encontró y corrigió una vulnerabilidad crítica real (RCE) en Next.js 16.3.5 → parcheado a 16.3.8
(`npm audit`: 0 vulnerabilidades). Esquema de BD (ya diseñado desde Sesión 1) escrito como
migración real en `supabase/migrations/0001_init.sql` — profiles + gastos, RLS con
`(select auth.uid())`, índice compuesto, trigger `handle_new_user` (crea el profile al
registrarse) y trigger `updated_at`, siguiendo las reglas de `25-BASE-DE-DATOS.md` (search_path
vacío + tablas calificadas en las funciones security definer, para evitar escalada de
privilegios). Supabase CLI instalado (`npm i -D supabase`) pero el login automático por
navegador no funciona en este entorno (no-TTY) — se optó por que el usuario corra la migración
directo en el SQL Editor del dashboard de Supabase, sin necesitar un token de acceso personal.
Pendiente: (1) el usuario corra `supabase/migrations/0001_init.sql` en su dashboard y confirme,
(2) nombre del repo de GitHub (owner/repo) para conectarlo — todavía no lo dio, (3) decidir si
regenera la clave service_role expuesta.

⏸️ CHECKPOINT 2026-09-30 (8) — **[NO ERA BUG — FALSO POSITIVO]** 4º reporte de "se perdieron los
botones" (paso gastos fijos). Investigando con el usuario se descubrió que está probando la app
desde la pestaña de vista previa integrada de Claude Code (no un celular real) — y esa ventana
física puede ser más chica que el viewport de celular que se le pide, cortando contenido
`position: fixed` legítimo. Se reprodujo el corte exacto en esa misma ventana y se confirmó: el
código ya está verificado varias veces con navegador real a 375px y el botón se ve bien — no se
tocó código. Pendiente: el usuario decida si prueba por `localhost:3000` en una pestaña normal,
o espera el despliegue real (Sesión 6) para probar en su celular. Sigue sin resolver cuáles
cuentas externas (GitHub/Supabase/Vercel) ya tiene — bloqueante para avanzar Sesión 6 en serio.

⏸️ CHECKPOINT 2026-09-25 (7) — **[BUG REAL — CORREGIDO]** El usuario probó el caso extremo
(ingreso ₡100.000, gastos fijos ₡200.000 — los fijos duplican el ingreso) y el paso de
presupuesto libre igual ofrecía "₡5.000 libres por día" con el mismo mensaje tranquilizador
de "tus gastos fijos casi igualan tu ingreso" que se usa para un déficit chico. `lib` no
distinguía "casi igualan" (ingreso apenas alcanza) de "ya superan por mucho" (déficit real).
Corregido en `feedbackPresupuestoLibre` (`app/onboarding/page.tsx`): cuando `totalGastosFijos >
ingresoMensual`, el mensaje ahora dice explícitamente cuánto superan los fijos al ingreso ("ya
superan tu ingreso por ₡100.000 al mes — no te queda nada libre de verdad... lo real es reducir
algún gasto fijo") en vez de sonar igual de calmado que el caso chico. El mínimo simbólico
(₡5.000, piso del país) se sigue dejando para que la app funcione — no hay forma honesta de
dar un presupuesto libre real cuando no existe. Verificado reproduciendo el caso exacto del
usuario en el navegador.

⏸️ CHECKPOINT 2026-09-25 (6) — A pedido del usuario: el paso "¿Cuánto ganas al mes?" del
onboarding ya no obliga a quedarse dentro del rango del slider (₡600.000-₡4.000.000 en Costa
Rica, etc.) — "hay personas que ganan menos de 600 mil colones". Se agregó una opción "Escribir
el monto exacto" (tocando el número grande también entra en modo edición) en `SliderCompromiso`
(`components/onboarding/ui.tsx`, nuevo prop `permitirEscribir`, activado SOLO en el paso
"ingreso" — el paso "presupuestoLibre" NO lo tiene a propósito, su tope es un cálculo real que
no debe poder inflarse a mano). El slider sigue ahí para el caso común; el valor escrito puede
caer fuera de sus extremos visuales sin problema. Verificado de punta a punta: escribí ₡450.000
(bajo el mínimo regional) y el paso siguiente (presupuesto libre) calculó bien el tope real
usando ese valor, no el mínimo del slider.

⏸️ CHECKPOINT 2026-09-25 (5) — **[BUG REAL — CAUSA RAÍZ ENCONTRADA, 3er intento]** El usuario
reportó otra vez el botón "Continuar" perdido en categorías, después de que los dos intentos
anteriores (mt-auto→sticky, luego sticky+min-h-dvh arreglado) no lo resolvieran en su celular
real. Causa raíz real: **Safari/WebKit tiene bugs de vieja data con `position: sticky` dentro
de contenedores `flex`**, y además el `motion.div` que anima la entrada de cada paso
(`TransicionPaso`) deja un `transform` aplicado incluso en reposo — eso convierte a CUALQUIER
ancestro en el "contenedor" de un `position: fixed` hijo en vez del viewport real. Ninguno de
los dos arreglos anteriores tocaba esto.

**Fix definitivo:** los 3 botones "fijos" del onboarding/Inicio (`PantallaPregunta.ctaFijo` en
`components/onboarding/ui.tsx`, el pie de "gastos fijos" y el pie de "Anotar gasto" de Inicio)
ahora se renderizan con `createPortal(..., document.body)` — un portal de React que saca el
botón COMPLETAMENTE de la cadena de ancestros animados/flex, montándolo directo como hijo de
`<body>` con `position: fixed` relativo al viewport real, sin ambigüedad posible. El botón de
Inicio ya no depende de `<button type="submit">` (quedaría fuera del `<form>` al portarse) —
ahora llama a `anotarGasto()` directo en su `onClick`. Verificado de punta a punta con
Playwright: los 3 botones quedan visibles y funcionan (categorías → avanza, gastos fijos →
avanza, Inicio → guarda el gasto en localStorage correctamente).

De paso, otro bug real encontrado por el usuario en el mismo mensaje: el paso "Anota tu primer
gasto" (activación) solo mostraba 4 de las 6 categorías posibles (`.slice(0, 4)` sin ninguna
forma de ver las otras 2) — corregido para mostrar las 6.

Pendiente: confirmar con el usuario que esta vez sí quedó resuelto en su celular real.

⏸️ CHECKPOINT 2026-09-25 (4) — **[BUG REAL — CORREGIDO]** El usuario reportó, en su celular
real: la pantalla de Inicio "quedó mal el tamaño, y no hay como pasar de ahí, se perdió el
menú" (el botón "Anotar gasto" se veía cortado y el menú de abajo Inicio/Progreso/Perfil
no aparecía). Causa: TODAS las pantallas de la app (Inicio/Progreso/Perfil vía
`app/(interna)/layout.tsx` + `template.tsx`, y onboarding/paywall/entrar) tenían `min-h-dvh`
puesto DOS VECES anidado (a veces tres: layout exterior + template + el contenedor de la
página) — el de afuera ya garantiza la altura mínima; el de adentro, anidado en un hijo
`flex-1`, es una redundancia real que en navegadores móviles (la barra de direcciones que
aparece/desaparece recalcula `dvh` de forma inconsistente entre navegadores) puede sumar
altura de más y empujar el contenido de abajo (como el menú) fuera del alcance. Se quitó el
`min-h-dvh` redundante de los contenedores internos en los 5 archivos (dejando solo `flex-1`,
que ya reparte el espacio correctamente); el contenedor MÁS EXTERNO de cada pantalla conserva
su `min-h-dvh` — es el único que debe tenerlo. Verificado sin regresión: todas las pantallas
(con contenido corto o largo) siguen llenando exactamente la altura de la ventana, sin hueco
ni recorte.

Pendiente: el usuario todavía no confirmó si esto resolvió lo que veía en su celular — pedirle
que lo pruebe de nuevo.

⏸️ CHECKPOINT 2026-09-25 (3) — **[BUG REAL — CORREGIDO, 2º intento]** Con la categoría ya
arreglada, el usuario seguía sin ver el botón de confirmar en "Anotar gasto" en su celular
real. El primer intento de arreglo (checkpoint anterior) separaba el sheet en dos zonas
anidadas (contenido con su propio scroll + pie `shrink-0` fuera de esa zona), apoyado en que
el sheet tuviera `max-h-[85dvh]` — pero en un celular real, con el teclado abierto, `85dvh`
no siempre se recalcula bien (comportamiento real de varios navegadores móviles), dejando el
pie fuera de la altura visible de todas formas. Corregido con el mismo patrón ya probado en
el onboarding: el sheet ES el único contenedor con scroll, y el pie usa `sticky bottom-0`
DENTRO de ese scroll — no depende de que el navegador recalcule el viewport al abrir el
teclado. Verificado con Playwright a una altura de viewport de 400px (simulando un teclado
que tapa más de la mitad de la pantalla): el botón queda visible sin scrollear, y el flujo
completo (elegir categoría, monto, Anotar) guarda el gasto correctamente.

⏸️ CHECKPOINT 2026-09-25 (2) — **[BUG REAL — CORREGIDO]** El usuario reportó quedarse
atascado al abrir "Anotar gasto" justo después de terminar el onboarding: en vez de la
grilla normal de categorías, veía un campo de texto con "Café y antojos" ya escrito, sin
salida clara. Causa raíz: el gasto de activación del onboarding usa SU PROPIA lista de
categorías de diagnóstico (`OPCIONES_CATEGORIA` en `app/onboarding/page.tsx`, ej. "Café y
antojos"), distinta de las categorías reales de la app (`CATEGORIAS` en `lib/datosApp.ts`,
ej. "Despensa/Comida"). `abrirFormulario()` en Inicio confiaba en la última categoría usada
SIN verificar que perteneciera a la lista real — como nunca coincide para el primer gasto
de un usuario nuevo, el formulario se abría siempre en modo "categoría personalizada" para
TODO usuario nuevo, justo en su primera interacción real con la app. Corregido: solo se
precarga la categoría anterior si es una de las reales; si no, arranca en blanco con la
grilla normal. Verificado reproduciendo el caso exacto (onboarding con "Café y antojos" →
abrir Inicio → Anotar gasto) en el navegador — ahora muestra la grilla, no el campo de texto.

⏸️ CHECKPOINT 2026-09-25 — Sesión 6 arrancó, pero antes de tocar servicios externos el usuario
pidió una función grande: **historial de días pasados + estadísticas por período**. TERMINADA
y verificada (tsc+build+navegador, con Playwright para cross-check de un bug de animación).
No commiteada aún.

- **Historial real, no solo "hoy"**: cada `Gasto` ahora guarda su `fecha` (antes solo existía
  "hoy", sin fecha). `DatosApp.gastosHoy` se renombró a `gastos` (TODO el historial); Inicio
  sigue mostrando solo el día de hoy con el nuevo helper `gastosDeHoy()`.
- **Progreso — nueva sección "Tu historial"**: filtros Mes/Trimestre/Año + flechas para navegar
  a períodos anteriores (regla 13 de UX: toda vista temporal necesita fechas reales + navegación),
  con el total gastado y el desglose por categoría de ese período. La tarjeta "Presupuesto fijo
  del mes" de arriba ahora es sobre el MES CALENDARIO REAL (antes sumaba mal "todo lo guardado"
  como si fuera "el mes").
- Demo sembrado con ~3 meses de historial de ejemplo (`lib/datosApp.ts` → `sembrarDatos()`, solo
  en el caso límite sin onboarding real detrás — un usuario real nuevo NUNCA recibe historial
  inventado, solo su gasto de activación de hoy).
- **[BUG REAL] Símbolo ₡ roto como "Ø"** en el nuevo total del período — mismo bug de la fuente
  Fredoka (sin glifo de colón) ya documentado y evitado en otro lado del código; se me pasó en el
  componente nuevo. Corregido.
- **[BUG REAL — defensivo] `cargarDatosApp()` no validaba la forma de los datos guardados**: un
  `cashpet_app` con la forma VIEJA (`gastosHoy` en vez de `gastos`, de antes de este cambio)
  tumbaba toda la pantalla con una excepción sin capturar. Encontrado probando con Playwright
  (localStorage con datos de pruebas anteriores a hoy). Ahora valida `Array.isArray(...gastos)`
  antes de confiar en lo guardado; si no coincide, resiembra en vez de romperse — protege contra
  cualquier futuro cambio de forma, no solo este.
- Nota de entorno (no es un bug de código, no se tocó nada): en el panel de navegador de Claude
  el número animado de Inicio se quedó pegado en $0 pese a que el dato interno llegaba correcto
  (confirmado inspeccionando React) — es un problema del `IntersectionObserver` de ESE panel en
  particular; con Playwright (motor de navegador real) el mismo código animó y mostró el número
  correcto sin tocar nada. Si el usuario ve algo similar en un dispositivo real, sí investigar.

Siguiente paso: el usuario todavía no respondió qué cuentas externas ya tiene (GitHub/Supabase/
Vercel) — retomar esa pregunta antes de guiarlo paso a paso.

⚠️ Patrón a vigilar (heredado de la sesión anterior): puede haber otros lugares con el mismo
anti-patrón de CTA al final de contenido largo sin `sticky`/`fixed` real — revisar si el
usuario reporta algo similar en paywall/login/Progreso/Perfil. Probado y sin problemas en la
ronda de pruebas de la Sesión 5, pero no está descartado al 100%.

⏸️ CHECKPOINT 2026-09-24 (post-cierre de Sesión 5) — TODO el pulido pedido tras probar la app está TERMINADO y verificado (tsc+build+navegador). No commiteado aún.
- **Onboarding** (`app/onboarding/page.tsx`): los 3 cambios pedidos, hechos: (1) categoría "Suscripciones que ya ni uso"→"Suscripciones"; (2) presupuesto MENSUAL fijo: de slider único a "ingreso mensual" + gastos fijos itemizados (nombre+monto, lista+suma); (3) presupuesto LIBRE diario con tope REALISTA = (ingreso-gastos fijos)/30. Bug real encontrado y corregido: el slider caía al mínimo del país por un render intermedio donde `libreDiarioMax` mezclaba el ingreso VIEJO con el país NUEVO antes de que el reset de moneda terminara — `Math.min` dejaba el valor pegado abajo para siempre. Fix: helper `elegirPais()` que setea país+presupuestoLibre+ingresoMensual+gastosFijos en el MISMO batch de React. Verificado con el valor normal y con el caso límite `huboAjusteRealista`.
- **Landing** (`app/page.tsx` + `docs/copy/landing.md`): 5/5 fixes de copy hechos (subtítulo repetido, "corazón en la boca"→"ansiedad", "un café al día"→"lo que cuesta un café", garantía 15→7 días, alt text de mockups actualizado).
- **[EXCEPCIÓN DOCUMENTADA — GARANTÍA 2026-09-24]** El usuario pidió garantía=7 días (igual a la prueba, "14 días en total") en vez de 15. Se le avisó dos veces (Hotmart permite 7/15/21/30 configurables; empatar garantía=prueba no añade cobertura real) y confirmó su decisión a sabiendas. Se aparta a propósito de la REGLA DURA de `18-VENTA-HOTMART.md` (garantía > prueba) — decisión de negocio del usuario. Actualizado en `FICHA-MERCADO.md` §4, `app/page.tsx` y `docs/copy/landing.md` §6-7.
- **Mockups regenerados** (`public/mockups/*.png`, los 5): capturas REALES a 375×812 con Playwright del estado actual (rediseño blanco + onboarding nuevo + garantía 7 días) — ya no son mockups a mano, son screenshots del código real, para que nunca vuelvan a quedar desincronizados. hoy.png = Inicio en "feliz" (racha 12, nivel 3); mecanismo.png = "desconfiada" (gasto de más); mecanismo-impulso.png = "decepcionada"; onboarding.png = el paso presupuestoLibre (con el fix ya aplicado); paywall.png = pantalla de precios.
- **[BUG REAL CORREGIDO — PAYWALL]** `app/paywall/page.tsx` leía un campo `presupuestoDiario` que ya no existe desde el modelo de 2 presupuestos (Sesión 5) — el recap mostraba "₡NaN" en "Tu límite diario". Renombrado a `presupuestoLibreDiario` (el campo real que guarda el onboarding). Encontrado al regenerar el mockup del paywall, no reportado por el usuario. También se corrigió ahí el mensaje confuso "Se acabó el 20 del mes... por menos de $0.30 al día" (mismo defecto que el usuario señaló en la landing, presente también en el paywall) por "Por menos de lo que cuesta un café, sabes al instante si vas bien con tu dinero", y "Garantía de 15 días"→"7 días".
- **[FIX — MONEDA DE LAS CAPTURAS]** El usuario notó que los 5 mockups recién regenerados mostraban colones (usé Costa Rica de datos de ejemplo) mientras la página de ventas vende en dólares — inconsistente. Se regeneraron los 5 de nuevo con Ecuador (moneda USD) como país de ejemplo del onboarding, y con montos en dólares para los estados de Inicio/mecanismo. Todo el funnel visual ahora es consistente en $.
- **[CAMBIO DE PRODUCTO — COLOR DEL PRESUPUESTO EN INICIO 2026-09-24]** A pedido explícito del usuario viendo la pantalla real: la tarjeta de "Llevas hoy · libre" en Inicio ahora es VERDE con la etiqueta "Presupuesto disponible" cuando el gasto de hoy está dentro del límite, y ROJA con "Presupuesto excedido" cuando se pasó — antes usaba el acento violeta neutro para ambos casos (decisión de FICHA-ARTE.md que reutilizaba `--accent` como color de éxito, ahora reabierta a propósito). Se agregó el token `--success: #227a4c` a `components/landing/tokens.css` (verde forestal cálido, contraste 5.3:1 sobre `--bg`, no reusa ningún color ya asignado a otro estado) y se actualizó `BarraPresupuestoDia` en `components/app/ui.tsx` (único lugar donde se usa este componente). El número mostrado sigue siendo lo GASTADO hoy (no lo disponible) — si el usuario quiere que el número también cambie a "cuánto te queda", avisar que es un cambio distinto y preguntar antes de hacerlo.

Siguiente acción exacta: no queda pendiente nada de este pulido. Preguntarle al usuario si arranca Sesión 6 (servicios externos) o quiere revisar/commitear primero.

## Qué es esta app (3 líneas máximo)
Tracker de gastos gamificado con una mascota de IA con personalidad: el usuario anota un gasto en segundos y la mascota reacciona (felicita o regaña con humor), genera rachas de ahorro y sube de nivel. Para adultos jóvenes en LATAM (22-35) que ganan bien pero sienten que el dinero "se les evapora". Monetización por suscripción ($8.99/mes o $69.99/año) vía Hotmart.

## Promesa central
"Ayudo a jóvenes profesionales que gastan por impulso a llegar a fin de mes con dinero de sobra, sin anotar cada centavo en Excel ni usar apps para contadores, mediante una mascota de IA que te frena antes de gastar."

## Reporte de validación (Sesión 1)
- Veredicto: Viable con ajustes (80/100 en la investigación propia del usuario) — recortar el alcance a un tracker de gastos gamificado, sin cursos largos ni consultoría de inversión
- Apps de referencia: YNAB (queja: complejo y caro, ~$100/año) · Wallet/Mobills (queja: aburridos, exigen disciplina) · Cleo (queja: solo inglés/EE.UU., pero prueba que "IA con actitud" factura — 4M+ usuarios)
- Lo que los usuarios odian de la competencia (nuestra oportunidad): "difícil de configurar", "aburrida a largo plazo", "parece Excel", "me siento culpable al ver mis números"
- Brecha LATAM confirmada: sí — verificado con fuentes públicas propias: Cleo AI (el modelo elegido, ver FICHA-MODELO.md) factura $280M ARR (jul-2025, fuente Sacra) solo en inglés/EE.UU.-UK, sin presencia en español/LATAM
- Precio de referencia del mercado: $5-$15/mes (benchmark de la investigación del usuario)

## Dirección de Arte (Sesión 2 — CERRADA, cosa juzgada — no reabrir sin pedirlo el usuario)
- FICHA-ARTE.md: existe y APROBADA — cerrada 2026-09-17 · mascota reabierta y actualizada el mismo día a pedido explícito del usuario (ver abajo), el resto de la ficha sigue cerrado
- Resumen: fondo #FFFFFF puro (rediseño "blanco sobrio" 2026-09-24, ver sección al inicio de FICHA-ARTE.md — antes #FDF1E7 crema durazno) · superficie #FFFFFF · hundido #F2F1EF · acento #7154E5 (violeta) · Display "Fredoka" · Body "Nunito" · radio 20-24px
- Personalidad: sarcástica · altanera · juguetona (antes: tierna · cálida · juguetona — cambiado junto con la mascota)
- Mascota (dispositivo ownable): **Gastón, el Gato** — gato rechoncho violeta, ojos GRANDES y redondos (cara amigable, ajustado 2026-09-17 tras ver el primer render con ojos entrecerrados — "está horrible, me imagino algo más amigable y lindo"), orejas triangulares, mofletes, bigotes y cola — vectorial (SVG), no 3D renderizado (decisión de costo, ver Decisiones de producto). Reemplaza al blob-osito sin nombre del diseño original. Habla con sarcasmo (copy de las burbujas), pero se VE tierno — personaje adorable con filo, no juzgón. Crecimiento gatito→adulto + accesorios de sass: decidido, se CONSTRUYE en Sesión 5 (app interna) — no en la landing
- Ruta de diseño: RUTA 2 (referencia parcial del usuario — 5 capturas: mascotas 3D, "lila", "Habitz", "SaveSmart") — NO se usó la Tabla de Líderes Cleo/Duolingo/Nubank para el look (esa tabla sigue vigente solo para el mecanismo de negocio en FICHA-MODELO.md)
- Comparativa: `direcciones-abc.html` (A elegida · B "arco arcoíris lavanda" y C "carita editorial blanca" descartadas, documentadas ahí) · Tour aprobado: `vista-previa-app.html`
- REGISTRO ANTI-REPETICIÓN: paleta violeta #7C5CFC + par Fredoka/Nunito quedan vetados para el próximo proyecto del SO

## Avatar y venta (Sesión 1 — NO cambiar sin validar)
- FICHA-AVATAR.md: existe y APROBADA por el usuario — 2026-09-17. Cosa juzgada — no reabrir sin pedirlo el usuario
- Resumen: avatar "Camila", 26 años, diseñadora freelance LATAM · dolor #1: "no sé en qué se me fue el sueldo" · deseo #1: "llegar a fin de mes con plata de sobra" · nivel de consciencia: alto (4/5) · sofisticación: media-alta
- FICHA-MERCADO.md: existe — precio anclado al plan medio de Cleo ($8.99), garantía de Hotmart verificada (15 días, secuencial a los 7 de prueba) — ver archivo para lo que falta (price parity, checkout real, conversión esperable: todo NO ENCONTRADO hasta tener cuenta de Hotmart y tráfico real)
- Big Idea + mecanismo bautizado: "El Chequeo de Gastón" (renombrado 2026-09-24 desde "el Freno de 5 Segundos" — a pedido del usuario, ver `docs/copy/landing.md` nota de renombrado) — aparece en Hero, Solución y Oferta
- Landing: CONSTRUIDA (Sesión 3) — `app/page.tsx`, Next.js real, 10 secciones canónicas, copy en `docs/copy/landing.md`, corre en `npm run dev` (puerto 3000). Screenshots reales del carrusel "La app por dentro": pendientes (placeholders honestos hasta Sesión 5)

## Estrategia de monetización (Sesión 1 — NO cambiar sin validar)
- Modelo: Onboarding-first con trial (Modelo 2 de 02C) — decidido por la matriz de nicho "Finanzas" (primera victoria = diagnóstico inicial, paywall tras el diagnóstico) con tie-breaker de frecuencia diaria resuelto vía gamificación de constancia (24), no vía modelo de cobro
- Justificación: el nicho finanzas pide confianza antes de pedir la tarjeta; el uso diario se retiene con rachas, no con paywall temprano. Coincide con lo ya definido en la investigación del usuario (trial de 7 días, diagnóstico + gasto de prueba como primera victoria)
- Diseño del paywall: aparece después de que el usuario registra su presupuesto + un gasto de prueba y recibe la primera reacción de la mascota (la "primera victoria" del punto 10 de la investigación)
- Trial: 7 días — justificado porque el aha es inmediato (minutos), no requiere acumulación de datos
- Pricing: $8.99/mes | $69.99/año (equivalente a $5.83/mes, ahorro de 35%) — subido desde $4.99/$39.99 a pedido del usuario (2026-09-17), justificado contra el plan medio de Cleo AI ($8.99, ver FICHA-MODELO.md) y validado con el gate de unit economics
- Gate de unit economics (40) — PASA con margen aún mejor que antes: costo de IA sigue ~$0.15/usuario/mes = ~1.7% del precio de catálogo (regla: debe ser <20%). Venta directa: neto ~$6.89 tras fee Hotmart+impuestos, menos COGS (~$0.60 IA+infra+email) = margen ~$6.29 (~91%). Peor caso, venta por afiliado al 50%: neto ~$2.40, margen ~$1.80 (~75%) — mucho más sano que con el precio anterior

## Gamificación y retención (loop documentado en Sesión 4; momentos construidos en Sesión 5)
- Loop del hábito (Hooked): Gatillo [necesidad/impulso de gastar o hábito de revisar el día] → Acción [registrar el gasto en <5s] → Recompensa [reacción de la mascota + racha viva] → Inversión [la mascota sube de nivel / desbloquea personalidad]
- Mecánicas elegidas: racha diaria (streaks) · medallas/hitos · nivel de la mascota
- Primera victoria que celebra el onboarding (<60s): registrar presupuesto mensual + un gasto de prueba y recibir la primera reacción divertida/sarcástica de la mascota
- Notificaciones de re-enganche: SÍ, decidido (24-GAMIFICACION.md) — push web opt-in, máximo 1 al día, disparada a la hora en la que el usuario suele usar la app (no una hora fija para todos), con prioridad "racha en riesgo" (avisa antes de perderla, no después). Copy siempre específico y accionable ("Te quedan 2 horas para no perder tu racha de 12 días" — nunca "te extrañamos"). Se construye en Sesión 5 junto con la app interna (necesita el service worker + el historial de actividad del usuario, que todavía no existen)

## Secuencia maestra de construcción (NO saltar)
- Estado de la secuencia: Landing lista tras Sesión 3. Onboarding, paywall y login CONSTRUIDOS y aprobados en Sesión 4. App interna (Inicio+Progreso+Perfil) CONSTRUIDA y aprobada en Sesión 5 — las 4 pantallas del funnel de venta MÁS la app interna están completas. Sigue: servicios externos (Sesión 6)
- Ruta aprobada: `/` → `/onboarding` → `/paywall` → `/entrar` → `/inicio` (+ `/progreso`, `/perfil`)
- Landing: CONSTRUIDA — protagonista: la mascota reaccionando a un gasto (mecanismo "El Chequeo de Gastón", renombrado 2026-09-24) — CTA primario: "Quiero mi mascota financiera" → `/onboarding`
- Onboarding: CONSTRUIDO (`app/onboarding/page.tsx`, ver docs/copy/onboarding.md) — país/moneda, dolor-ancla, categorías, momento del día, presupuesto MENSUAL fijo + presupuesto LIBRE diario (2 pasos desde 2026-09-24) + activación real (anota un gasto, Gastón reacciona en vivo con sus 5 emociones) + 2 reconocimientos + loading — probado de punta a punta, capturas en `docs/revisiones/onboarding-*.png`. Aprobado por revisión directa del usuario tras 8 pasadas del revisor-visual sin alcanzar el gate (ver Problemas conocidos)
- Paywall: CONSTRUIDO (`app/paywall/page.tsx`, secuencia recap → timeline → precio) — oferta: $8.99/mes o $69.99/año con trial de 7 días, garantía 15 días. Aprobado por revisión directa del usuario tras 5 pasadas del revisor-visual sin alcanzar el gate (ver Problemas conocidos)
- Login/Auth: CONSTRUIDO (`app/entrar/page.tsx`, magic link por email) — motivo de pedir cuenta: guardar historial de gastos, rachas y suscripción. Aprobado por revisión directa del usuario tras 7 pasadas del revisor-visual sin alcanzar el gate doble (ver Problemas conocidos)
- App interna: CONSTRUIDA — Inicio (`/inicio`, ritual diario: presupuesto libre del día + moneda secundaria opcional), Progreso (`/progreso`, racha+nivel+presupuesto fijo del mes+ahorro), Perfil (`/perfil`, plan+2 presupuestos+moneda secundaria+cerrar sesión). Inicio aprobado por revisión directa del usuario tras 14 pasadas del revisor-visual sin alcanzar el gate (ver Problemas conocidos) — récord del proyecto; Progreso y Perfil construidos como pantallas secundarias (sin revisor obligatorio)
- Servicios externos: pendiente — GitHub/Supabase/IA/Vercel/Resend/dominio/Hotmart

## Puertas de etapa (aprobación antes de avanzar)
- Landing: LISTA (veredicto del revisor-visual, 36/40 · 18/20 · copy 20/20)
- Onboarding: CONSTRUIDO, aprobado por revisión directa del usuario (8 pasadas del revisor-visual sin alcanzar el gate, ver Problemas conocidos)
- Paywall: CONSTRUIDO, aprobado por revisión directa del usuario (5 pasadas del revisor-visual sin alcanzar el gate, ver Problemas conocidos)
- Login/Auth: CONSTRUIDO, aprobado por revisión directa del usuario (7 pasadas del revisor-visual sin alcanzar el gate, ver Problemas conocidos)
- App interna: CONSTRUIDA — Inicio aprobado por revisión directa del usuario (14 pasadas del revisor-visual, craft cruzó el gate y se sostuvo 6 rondas, usabilidad se estabilizó en 30/40 — ver Problemas conocidos); Progreso y Perfil construidos (pantallas secundarias, sin revisor obligatorio)
- Servicios externos: bloqueados
- Certificado /100: no aplica todavía

## Decisiones técnicas (NO re-discutir sin pedirlo el usuario)
- Framework: Next.js (App Router) — decidido el 2026-09-16. Motivo: la landing necesita SEO/indexación y la app necesita un BFF para no exponer la clave de IA en el navegador (regla de decisión de 12-FLUJO-AGENTICO.md)
- Stack: Next.js + Supabase (BD/Auth) + Hotmart (cobro) + Resend (emails) + Vercel (hosting)
- Features del MVP (orden de prioridad): 1) registro de gasto en máx. 3 clics (o nota de voz), 2) mascota IA con personalidad fija que reacciona a cada gasto, 3) sistema de rachas/streaks por respetar el presupuesto
- Explícitamente NO construir en el MVP: conexión automática con bancos, cursos en video, gráficos financieros complejos o predicciones de inversión (regla de la investigación del usuario, punto 11)
- Modelo de IA: Claude Haiku 4.5 (`claude-haiku-4-5`) para las reacciones de la mascota — texto corto, personalidad definida por prompt, barato y rápido (~$1/$5 por millón de tokens); síncrono, sin necesidad de streaming largo por ser respuestas breves
- Auth: magic link/OTP por email (passwordless), sin contraseñas — default del SO para venta por Hotmart. El usuario prueba todo el onboarding SIN cuenta (anónimo); la cuenta nace recién en el login post-compra (o al terminar el trial). Sesión larga (30-90 días). Passkeys se ofrecen más adelante, después de la primera victoria, no en el primer login
- Esquema de base de datos (diseño, Sesión 1 — se crea en Supabase real en Sesión 6):
  - `profiles` (id = auth.users.id · presupuesto_mensual numeric (fijo: renta, servicios, súper, suscripciones, tarjeta, salud, mascotas, ahorros) · presupuesto_libre_diario numeric (impulso: el resto de las categorías, ver "Dos presupuestos" abajo) · **moneda text default 'USD' (código ISO 4217, ej. 'CRC', 'MXN', 'COP')** · moneda_secundaria text nullable (ej. 'USD', ver "Moneda secundaria" abajo) · ultimo_tipo_cambio numeric nullable · mascota_personalidad text · mascota_nivel int default 1 · racha_actual int default 0 · racha_mas_larga int default 0 · ultima_actividad date · plan text check in ('trial','activo','cancelado','vencido') · trial_termina timestamptz · created_at/updated_at)
  - `gastos` (id uuid · user_id references profiles(id) on delete cascade · monto numeric(10,2) check(monto>0) — siempre en la moneda principal del usuario · categoria text · descripcion text · reaccion_ia text · monto_original numeric nullable · moneda_original text nullable · tipo_cambio numeric nullable (los 3 solo si el gasto se anotó en la moneda secundaria) · gastado_en date default current_date · created_at timestamptz default now())
  - Índices: `gastos(user_id, gastado_en desc)` para el historial · `gastos(user_id)` ya cubierto por el compuesto
  - RLS: todas las tablas con policy `user_id = auth.uid()` (select/insert/update/delete) — un usuario nunca ve gastos de otro
  - Durante el onboarding (sin cuenta), presupuesto + el gasto de prueba viven en el navegador (localStorage) y se migran a `profiles`/`gastos` recién al crear la cuenta — no se toca la base de datos hasta que hay usuario real
  - **Decisión de moneda DENTRO de la app (2026-09-17, el usuario preguntó: "todo lo estamos haciendo en dólares, pero en CR son colones"):** `gastos.monto` es siempre en la moneda PRINCIPAL del usuario — cada usuario ve y anota en su propia moneda (dato privado, RLS por usuario, nunca se comparan montos entre usuarios). Se agrega la columna `moneda` a `profiles`, elegida en el onboarding (pregunta 1: "¿en qué país estás?", 9 países + "Otro país"), y TODO monto se formatea con `Intl.NumberFormat(locale, { style: 'currency', currency: moneda })` usando el LOCALE específico del país (`es-CR`, `es-MX`...), nunca el genérico `'es'` — bug real verificado: `Intl` con locale `'es'` a secas pierde el símbolo (muestra "CRC" en vez de "₡") y agrupa mal los miles de 4 cifras ("5000" en vez de "5.000"); con `es-CR` da "₡5.000" correcto (ver `39-INTERNACIONALIZACION.md`). Esto es DISTINTO del precio de suscripción (que sí se cobra en USD vía Hotmart — Hotmart ya convierte a la moneda local del comprador en su propio checkout, fuente: [Central de Ayuda Hotmart](https://help.hotmart.com/es/article/213026287/-como-es-el-proceso-de-compra-internacional-), 2026-09-17).
  - **Moneda secundaria (2026-09-24, a pedido explícito del usuario: ingresa en dólares, vive en Costa Rica, paga cosas en dólares Y en colones):** SIN tabla de tipos de cambio ni API externa — conversión MANUAL a propósito, porque "el tipo de cambio es muy variable" según banco y día (el usuario lo rechazó explícitamente cuando se le ofreció automatizarlo). El usuario activa una moneda secundaria en Perfil (hoy solo USD — no hay selector de múltiples monedas secundarias, sería sobre-ingeniería para un caso de uso que en LATAM casi siempre es "mi otra moneda es el dólar"). Al anotar un gasto en la moneda secundaria, escribe el tipo de cambio del momento (precargado con el último usado, `ultimoTipoCambio`, pero siempre editable) y el sistema convierte y guarda el monto YA CONVERTIDO en `gastos.monto` (para que los presupuestos sigan siendo de una sola moneda, sin duplicar todo el sistema) + el monto/moneda/tasa originales para trazabilidad en el historial (`etiquetaMontoOriginal()` en `lib/datosApp.ts`).
  - Reacción de Gastón en la activación del onboarding (demo, sin cuenta): compara el gasto de prueba contra el presupuesto LIBRE diario fijado — ≤50% Celebrando · ≤100% Feliz · ≤150% Desconfiada · >150% Decepcionada. Esta misma lógica de umbrales (adaptada del Excel del usuario, ver FICHA-ARTE.md) se reutiliza en la app real (Sesión 5) contra el gasto LIBRE acumulado del día (`lib/datosApp.ts` → `calcularEmocion`) — nunca contra lo fijo del mes, ver "Dos presupuestos" abajo.
  - **Dos presupuestos, no uno (2026-09-24, a pedido explícito del usuario tras ver la app construida):** el usuario aclaró que el registro de gastos ocurre DESPUÉS de gastar (la app ya funcionaba así; era el copy de venta el que decía "te frena antes de comprar", falso — corregido, ver Avatar y venta arriba), y que hacen falta DOS presupuestos con lógica distinta: MENSUAL para lo fijo/planeado (renta, servicios, súper, suscripciones, tarjeta, salud, mascotas, ahorros) y LIBRE/diario para lo de impulso (todo lo demás — transporte, ocio, compras, regalos, familia, y cualquier categoría personalizada). Cada categoría se clasifica sola vía `tipoPresupuesto()` en `lib/datosApp.ts` — el usuario nunca elige "fijo o libre" al anotar. El dato héroe de Inicio (el ritual diario) es SOLO sobre lo libre; lo fijo se resume en Progreso. Implementado y verificado end-to-end en el navegador (onboarding con 2 pasos de presupuesto → Inicio/Progreso/Perfil leyendo ambos campos correctamente).

## Sesiones completadas ✅
- Sesión 1 — Validación (idea traída por el usuario, no re-validada) · FICHA-AVATAR.md en borrador (Camila) · FICHA-MODELO.md aprobada (app modelo: Cleo AI) · modelo de negocio elegido: onboarding primero, pago después (precio ajustado luego a $8.99/$69.99, ver Estrategia de monetización) · gate de unit economics: PASA · auth y esquema de BD (`profiles`/`gastos` + RLS) diseñados — cerrada 2026-09-17
- Sesión 2 — Identidad visual: comparativa A/B/C basada en referencias del usuario (no en líderes) · mascota rediseñada más tierna a pedido del usuario · Opción A elegida ("Tu mascota, en grande") · tour de la app aprobado · FICHA-ARTE.md cerrada y aprobada — cerrada 2026-09-17
- Sesión 3 — Página de ventas: scaffold real de Next.js 16 + React 19 + Tailwind v4 + Motion + lucide-react instalado · kit canónico de landing copiado y tematizado con FICHA-ARTE · Big Idea + mecanismo "el Freno de 5 Segundos" (renombrado luego a "El Chequeo de Gastón") bautizados · copy completo en `docs/copy/landing.md` derivado de FICHA-AVATAR.md · FICHA-MERCADO.md creada (plazos de garantía Hotmart verificados: 15 días, secuenciales a los 7 de prueba) · landing corriendo en `npm run dev`, verificada a 375px, auditoría de conversión en 0 críticos — cerrada 2026-09-17
- Sesión 4 — Funnel de venta completo: onboarding (`app/onboarding/page.tsx`, 5 preguntas + activación real + reconocimientos + loading), paywall (`app/paywall/page.tsx`, secuencia recap→timeline→precio) y login (`app/entrar/page.tsx`, magic link) construidos y probados de punta a punta. Las 3 pantallas fueron aprobadas por revisión directa del usuario tras series de 5-8 pasadas del revisor-visual cada una sin alcanzar el gate doble (rendimientos decrecientes documentados en Problemas conocidos) — cerrada 2026-09-18
- Sesión 5 — App interna completa: Inicio (`/inicio`, ritual diario), Progreso (`/progreso`) y Perfil (`/perfil`) construidos sobre `lib/datosApp.ts` (mock en localStorage). Durante la sesión, 3 pedidos grandes del usuario tras ver la app construida: (1) rediseño de superficies a blanco sobrio en toda la app; (2) modelo de 2 presupuestos (mensual fijo + libre diario) reemplazando el presupuesto único original, con el mecanismo de venta renombrado de "el Freno de 5 Segundos" a "El Chequeo de Gastón" para reflejar que la mascota reacciona DESPUÉS del gasto, no antes; (3) moneda secundaria con conversión manual (caso de uso real: ingresos en USD, gastos en USD y CRC). Inicio pasó por 14 rondas de revisor-visual (récord del proyecto) — craft cruzó el gate y se sostuvo 6 rondas, usabilidad se estabilizó en 30/40; aprobado por revisión directa del usuario siguiendo la recomendación explícita del propio revisor automático — cerrada 2026-09-24

## Sesión en progreso 🔧
- Sesión 6 — servicios externos, recién arrancada: GitHub/Supabase/IA real/Vercel/Resend/dominio/Hotmart. Nombre de la app confirmado por el usuario 2026-09-25: **CashPet**. Nota: el esquema de BD ya anticipa `moneda_secundaria`/`ultimo_tipo_cambio` en `profiles` y `monto_original`/`moneda_original`/`tipo_cambio` en `gastos` (ver Decisiones técnicas). Próximo paso: preguntarle al usuario qué cuentas externas ya tiene creadas antes de guiarlo.

## Próximas sesiones 📋
- (ninguna después de la 6 — el resto del roadmap depende de cómo avance servicios externos)

## Decisiones de producto (fuera de la secuencia técnica)
- Mascota: se queda en SVG vectorial (gratis, liviano) para el MVP. El usuario preguntó por mascotas 3D renderizadas tipo "Fluffy"/"Uni" (imágenes fijas por estado, no vectorial) — se explicó el costo (ilustrador o generación con IA, gasto real) y quedó como mejora FUTURA, no ahora. No re-litigar esto salvo que el usuario lo pida.
- El usuario compartió su plantilla Excel personal ("Mi_Presupuesto.xlsx") pidiendo traer su esencia a CashPet. Se extrajo:
  1. CATEGORÍAS REALES adoptadas como default de la app: Renta/Vivienda, Despensa/Comida, Servicios, Transporte, Salud, Mascotas, Suscripciones, Tarjeta de Crédito, Ahorros, Hobbies/Ocio (reemplazan los ejemplos genéricos usados en los mockups)
  2. SISTEMA DE EMOCIONES de Gastón (decisión tomada, ver FICHA-ARTE.md y `docs/revisiones/estados-mascota.html`): 5 caras (Celebrando/Feliz/Neutral/Desconfiada/Decepcionada — renombradas de Preocupada/Triste el 2026-09-17 junto con el cambio de mascota) con los MISMOS umbrales que ya usaba el Excel del usuario en sus comentarios condicionales (ej. "gastaste más de lo que ganaste" → Decepcionada; "quedaste X% abajo del presupuesto" → Celebrando/Feliz). Esto entra en el MVP porque refuerza el mecanismo ya planeado (mascota reacciona), no es scope nuevo.
  3. PRESUPUESTOS POR CATEGORÍA (con comparación presupuesto vs. gasto real por categoría, como en el Excel) — se decide DEJAR PARA FASE 2 (post-lanzamiento): el MVP ya tiene presupuesto diario/mensual simple; agregar presupuesto POR categoría con su propia UI de configuración es fricción extra en el onboarding que la investigación original pidió evitar ("NO construir: gráficos financieros complejos"). Se revisa esto apenas la Fase 1 esté validada con usuarios reales.
  4. NO se adopta: "metas financieras del mes" tipo checklist ni "reflexiones anuales" del Excel — son features de una herramienta de planificación anual, no del hábito diario que vende CashPet. Quedan anotadas acá por si se quieren evaluar más adelante, no se descartan para siempre.

## Problemas conocidos ⚠️
- [SECRETO EXPUESTO EN CHAT — PENDIENTE DE ROTAR 2026-10-01] El usuario pegó sus 3 claves de
  Supabase directo en el chat, incluyendo la `service_role` (secreta — equivale a saltarse RLS
  por completo). Se le avisó de inmediato que quedó comprometida en el historial y se le pidió
  regenerarla desde el dashboard de Supabase (Project Settings → API Keys → Regenerate). El
  usuario respondió "seguimos con el resto primero" — decisión suya de posponerlo, no un olvido.
  Mientras no se regenere, tratar esa clave como potencialmente filtrada: no usarla para nada
  fuera de `.env.local` local, y recordar la rotación antes de publicar a producción (bloqueante
  real para P3/P7 de `62-PUBLICACION-SEGURA-Y-CONTINUA.md`).
- [EXCEPCIÓN DOCUMENTADA — GARANTÍA 2026-09-24] `FICHA-MERCADO.md` declara Prueba elegida: 7 días y Garantía elegida: 7 días (iguales) — la REGLA DURA de `18-VENTA-HOTMART.md` pide garantía > prueba, así que esto la incumple a propósito. Antes tenía Garantía: 15 días (verificado contra Hotmart), pero el usuario pidió expresamente bajarlo a 7 ("son 7 días gratis y 7 de garantía, en total 14 días"). Se le avisó DOS veces que Hotmart permite 7/15/21/30 días configurables (15 no es un mínimo fijo) y que empatar garantía=prueba deja a la garantía sin cobertura real adicional (quien se arrepiente ya pudo cancelar gratis en la prueba, sin pagar nada) — el usuario confirmó su decisión entendiendo la superposición. Es una decisión de negocio del usuario, no un descuido. Actualizado en `FICHA-MERCADO.md` §4, `app/page.tsx`, `app/paywall/page.tsx` y `docs/copy/landing.md` §6-7. No se re-litiga salvo que el usuario lo pida (`/precios`).
- [VEREDICTO CADUCADO — LANDING 2026-09-24] El veredicto de landing (LISTA, 36/40 · 18/20 · 20/20, 2026-09-17) quedó desactualizado por ediciones reales de copy hechas hoy a pedido del usuario tras ver la app: subtítulo del hero (dejó de repetir el H1), "el corazón en la boca"→"ansiedad" (modismo de otra generación), "por menos de un café al día"→"por menos de lo que cuesta un café" (quitaba la implicación de hábito diario de comprar café), garantía 15→7 días, y el alt text de los mockups del carrusel. Los 5 screenshots de `public/mockups/` también se regeneraron completos (capturas reales 375×812 del código actual, ya no dibujos a mano) tras notar el usuario que estaban en colones cuando la venta es en dólares. Cada cambio se verificó visualmente en el navegador (Playwright + browser pane) y el usuario vio y aprobó los resultados en el chat, pero NO se re-lanzó el subagente revisor-visual formal — son ediciones de texto puntuales sobre una pantalla ya aprobada, no un rediseño estructural, mismo criterio que ya se usó para onboarding/paywall/login/Inicio en este proyecto (ver entradas de abajo). Re-lanzar el revisor si el usuario pide una re-certificación formal.
- [ACEPTADO POR EL USUARIO 2026-09-24] Veredicto de inicio (app interna, pantalla principal): 14 pasadas del revisor-visual — RÉCORD del proyecto (onboarding=8, login=7, paywall=5) — NINGUNA dio LISTA. Trayectoria: usabilidad 22→29→27→29→31→27→29→33→35→28→28→28→28→30 /40 · craft 11→15→15→14→14→12→13→17→17→16→16→16→16→16 /20 — el craft cruzó el gate (≥16/20) en la 8ª ronda y se sostuvo estable 6 rondas seguidas; la usabilidad nunca alcanzó 36/40 (techo real: 35, luego se estabilizó en 28-30). A lo largo de las 14 rondas se corrigieron decenas de defectos reales, incluyendo 2 bugs de dinero genuinos: (1) el parseo de montos no manejaba separadores de miles y truncaba el valor silenciosamente (ronda 10); (2) el monto en la moneda secundaria (USD) se parseaba sin decimales, "$12.50" se guardaba como 1250, ~100x inflado (ronda 12) — ambos corregidos y verificados. También se construyó un bottom-sheet real (reemplazando un formulario que dejaba medio viewport vacío), preselección de categoría, señales de editar/eliminar, accesibilidad del modal (`role="dialog"`, `inert` en el fondo — con un bug real en el propio `inert` corregido en la ronda 9), y todo el sub-flujo de moneda secundaria (toggle, tipo de cambio manual, preview en vivo, trazabilidad). La 14ª pasada fue explícita y terminante: los 10 criterios de usabilidad puntúan un "3" parejo — cruzar el gate ya no es cuestión de corregir el próximo defecto puntual, exigiría una inversión estructural (errores inline por campo, backend real, jerarquía tipográfica de 3 niveles reales) — y recomendó aceptar el estado actual como "production-viable" en vez de seguir iterando. Se le mostraron al usuario las capturas y, tras revisarlas, respondió explícitamente "Se ve bien, aceptamos y avanzamos" — decisión de producto suya, siguiendo la recomendación del propio revisor. Defectos finos de la 14ª pasada quedan pendientes de valor bajo/opcional (no bloqueantes): el mensaje de error se renderiza en un slot fijo lejos del campo inválido en vez de pegado a él; el texto de preview "≈ ₡26 495" usa el tratamiento más apagado del sistema tipográfico; el toggle de moneda no está agrupado en un `role="radiogroup"`; el toast de "Gasto eliminado" no indica tiempo restante; `--text-secondary`/`--text-tertiary` son el mismo hex desde el rediseño blanco (2 niveles reales de texto, no 3). Se revisan si el usuario los pide o en un pulido futuro.
- [CIERRE DE ETAPA 2026-09-24] Con Inicio aprobado, la app interna completa (Inicio+Progreso+Perfil) queda cerrada para Sesión 5 — construida y probada de punta a punta, incluyendo 3 pedidos grandes del usuario que llegaron DESPUÉS de la construcción inicial (rediseño blanco, modelo de 2 presupuestos, moneda secundaria) y que se integraron sin romper lo ya aprobado. Sesión 6 (servicios externos) puede arrancar.
- [ACEPTADO POR EL USUARIO 2026-09-18] Veredicto de entrar (login): 7 pasadas del revisor-visual, NINGUNA dio LISTA. Trayectoria: usabilidad 28→33→33→29→36→36→36 /40 (pasa el gate desde la 5ª ronda, sostenida) · craft 14→16→17→15→14→14→14 /20 (nunca se asentó sobre ≥16, osciló y volvió a bajar). Rondas 1-6 corrigieron defectos reales: token `--error`, guardia de doble-tap, flecha atrás, `role="alert"`, whileTap, señal de "procesando", stagger de entrada, mock más lento, pista de spam, label persistente, vacío corregido de raíz con `justify-center`, `aria-describedby`, Gastón en vez de ícono genérico, confirmación de reenvío, chevrón con fondo circular, Hairline con sombra dando profundidad real, `CtaButton` con prop `submit` (button real) + `noValidate`, tamaños de texto unificados. La 7ª ronda encontró que el ajuste de tamaño del botón (fix de la 6ª) rompía la consistencia de `CtaButton` con onboarding/paywall — señal de rendimientos decrecientes: cada fix de craft destapaba un defecto nuevo sin que el puntaje subiera. Ante el estancamiento (mismo patrón que onboarding y paywall), se le mostraron al usuario las 3 capturas del flujo y, tras revisarlas, respondió explícitamente "Se ve bien, avancemos" — decisión de producto suya. Defectos finos de la 7ª pasada quedan pendientes de valor bajo/opcional (no bloqueantes): el círculo de "volver" sigue aislado sin relación con el resto de la composición, vacío moderado bajo "¿Correo equivocado? Cambiarlo" en el estado "enviado", el título "Entra a tu plan" en 28px no calza con ninguno de los 2 tamaños que FICHA-ARTE.md declara para su escala (25/42), y "Reenviar"/"Cambiarlo" no se distinguen lo suficiente en peso visual. Se revisan si el usuario los pide o en un pulido futuro.
- [CIERRE DE ETAPA 2026-09-18] Con login aprobado, las 4 pantallas del funnel de venta (landing, onboarding, paywall, login) quedan completas para Sesión 4 — todas construidas y probadas, ninguna con veredicto LISTA formal salvo landing (única que sí alcanzó el gate doble tras su propia serie de rondas); onboarding/paywall/login fueron aprobadas por revisión directa del usuario tras rendimientos decrecientes del revisor automático. Sesión 5 (app interna) puede arrancar.
- [ACEPTADO POR EL USUARIO 2026-09-17] Veredicto de paywall: 5 pasadas del revisor-visual, NINGUNA dio LISTA. Trayectoria: usabilidad 27→30→31→30→30 /40 · craft 13→14→15→15→15 /20 · copy 14→17→17→17→17 /20 — nunca alcanzó el gate (≥36/40 y ≥16/20). Rondas 1-4 corrigieron defectos reales (bug de teclado en CtaButton compartido por toda la app, reframe de precio, vacío muerto, header con flecha/progreso, "Restaurar compra" eliminado por deshonesto, Gastón en las 3 pantallas, stagger, whileTap, estado de carga del CTA, agitación del dolor real, recap completo con sus 6 respuestas). El techo real desde la 3ª pasada es estructural, no de diseño: el revisor exige manejo de errores de pago (tarjeta rechazada, timeout) que sería deshonesto fabricar antes de que Hotmart esté conectado (Sesión 6) — construirlo ahora significaría simular un sistema de cobro que no existe. Ante el estancamiento (mismo patrón que el onboarding), se le mostraron al usuario las 4 capturas de la secuencia y, tras revisarlas, respondió explícitamente "Se ve bien, avancemos" — decisión de producto suya. Defectos finos de la 5ª pasada quedan pendientes de valor bajo/opcional (no bloqueantes): agrandar Gastón en la pantalla de precio a ≥80px, agregar confirmación al toggle de aviso por correo (o quitarlo si no está conectado a nada), agrupar las 6 filas del recap en 2 bloques visuales, y sumar una micro-prueba visual del mecanismo junto al value stack. Se revisan si el usuario los pide o en un pulido futuro.
- [RESUELTO] `scripts/lib-conversion.mjs` (auditoría de conversión del propio SO) escaneaba `plantillas-codigo/` — la biblioteca de plantillas de referencia que trae el sistema — como si fuera la landing real del proyecto, bloqueando el cierre de sesión desde la instalación. Se agregó `plantillas-codigo` a `EXCLUDE_DIRS` (2026-09-17). Verificado con `bash .claude/hooks/pre-stop.sh` → exit 0.
- [RESUELTO] El check 14 (TEST DE DIVERGENCIA de la comparativa A/B/C) medía similitud de DOM sobre el frame COMPLETO de cada opción, incluyendo el panel `.meta` y el `.hero-landing` — que el propio kit-abc-v2 mantiene IDÉNTICOS a propósito en las 3 opciones (ficha comparable). Eso hacía que cualquier comparativa bien tematizada con el kit oficial diera falso positivo de ">80% similar". Se acotó la comparación al contenido real de `.pantalla` en `scripts/lib-conversion.mjs` (2026-09-17). También se quitó el bloque de comentarios "CÓMO USAR ESTE KIT" de `direcciones-abc.html` (era instrucción para el agente, no parte del entregable) porque contenía un emoji ⚠️ que el gate de "cero emojis" detectaba como si fuera UI visible.
- [RESUELTO — Sesión 3] Cuatro bugs más en `scripts/lib-conversion.mjs`, todos con el mismo patrón (el escáner trata código/comentarios como si fueran copy o UI visible), encontrados al construir la landing real con el kit canónico oficial del SO — es decir, afectan a CUALQUIER proyecto que use el kit tal cual, no solo a CashPet:
  1. Voseo: `animate` está en el diccionario voseante ("¡animate!") pero colisiona con la prop `animate={{...}}` de Motion, que el propio SO manda usar. Se agregó una guarda: si el match viene seguido de `={` o `:` (sintaxis de código), se descarta.
  2. Emojis: el check escaneaba línea por línea con una regex de inicio de línea que no detectaba comentarios de bloque `/* ... */` sin `*` de continuación (como en `ui.tsx`, que literalmente documenta "nunca el ✓ del sistema" dentro del comentario). Reescrito para detectar comentarios por posición de caracter, no por prefijo de línea.
  3. Hairlines degradé: el check solo buscaba la técnica `padding-box`/`border-box` en archivos `.css` o un componente llamado `GradientBorder` — pero el `<Hairline>` del kit la implementa inline en `.tsx` con ese mismo nombre distinto. Se agregó el escaneo de `.tsx`.
  4. Profundidad de fondo: el check exigía `background` y `radial-gradient(` en la MISMA línea, pero el propio `Hero.tsx` del kit los separa en dos líneas (formato Prettier). Se cambió a una ventana de 4 líneas.
  5. Presupuesto de copy: la regex de "literal largo" no distinguía comillas/backticks dentro de comentarios o código de comillas de copy real, y a veces "tragaba" bloques enteros de código como si fueran un párrafo (por un apóstrofe suelto). Se agregaron tres guardas: no está dentro de un comentario, contiene palabras de prosa en español reales, y no contiene sintaxis de código (`{`, `}`, `=>`, `${`).
  Los 5 fixes están en `scripts/lib-conversion.mjs`, verificados corriendo `bash scripts/audit-conversion.sh` antes y después (bajó de 13 a 0 críticos falsos, sin perder ninguna detección real — se probó con contenido real de la landing).

- [RESUELTO 2026-09-17] Veredicto de landing: LISTA tras 7 pasadas del revisor-visual (36/40 usabilidad · 17/20 craft · 20/20 copy). Camino: rondas 1-3 corrigieron defectos propios del revisor (mascota en el hero, capturas reales, garantía junto al CTA, prueba social atribuida a Cleo, cálculo mostrado); en paralelo, 5 rondas de feedback directo del usuario (más punch de venta, menos texto más visual, capas/profundidad, dato-héroe con la cifra real de FICHA-AVATAR en vez de un número inventado, más variedad de escenas en vez de repetir "café") empujaron la mayoría del trabajo; rondas 4-7 cerraron 13 defectos técnicos más finos (patrón de animación del kit, fondos alternados, frames unificados, ruta `/entrar`, contraste AA del CTA en dos fondos distintos, ancla de precios en desktop, fallback de imágenes). Pulido opcional anotado por la 7ª pasada, NO bloqueante: timeline visual para la secuencia 7+15 días de la garantía, aligerar el CTA mensual de la Oferta, agregar focus-visible custom en los interactivos del kit, y considerar fusionar los 2 puentes intermedios si se vuelve a tocar la landing (scroll total denso).
- [RESUELTO 2026-09-17] El usuario pidió cambiar la mascota DESPUÉS de que la landing ya estaba LISTA: "Gastón, el Gato" — rechoncho, violeta, sarcástico. Se rediseñó `components/Mascota.tsx` (único componente reusado en toda la app), se re-dibujaron las 5 caras de emoción en `docs/revisiones/estados-mascota.html` (2 renombradas: Preocupada→Desconfiada, Triste→Decepcionada), se regeneraron las 5 capturas de `public/mockups/` desde `vista-previa-app.html`, y se afiló el tono de las 2 frases donde "habla" la mascota en la landing. El usuario decidió: violeta (mantiene la marca) para el pelaje, y crecimiento gatito→adulto + accesorios de sass como mecánica futura (Sesión 5, no ahora). El veredicto quedó CADUCADO por el cambio y se re-lanzó el revisor-visual 2 veces más (8ª pasada: 34/40, encontró voz inconsistente + cola invisible + tokens muertos + bigotes al borde, todo corregido; 9ª pasada: **LISTA**, 36/40 · 18/20 · 20/20).
- [RESUELTO 2026-09-17] El usuario vio a Gastón (1ª versión, ojos entrecerrados en almendra) ya renderizado y dijo "está horrible el gato, me imagino algo más amigable y lindo", mandando 2 capturas de referencia (Pinterest: un gato de ojos ENORMES tipo Patti Kearns, y un gato minimalista de ojos cerrados/felices con un corazón en el pecho). Preguntado, eligió una MEZCLA (proporciones simples + ojos grandes redondos) y confirmó que el look se suaviza pero el copy sigue sarcástico. Se rediseñaron los ojos/boca en `components/Mascota.tsx`, las 5 caras de `docs/revisiones/estados-mascota.html`, las 4 vistas de `vista-previa-app.html` y se regeneraron las 5 capturas de `public/mockups/`. El veredicto volvió a quedar CADUCADO, se re-lanzó (10ª pasada): **LISTA**, 36/40 · 18/20 · 20/20. La 10ª pasada anotó 4 defectos NO bloqueantes: (1-2) 2 burbujas sarcásticas (hero "café" y carrusel "domicilio") usan la cara Feliz plena sin ninguna pista facial de sarcasmo — se evaluó darles la cara "Desconfiada" como a la 3ª escena, pero se decidió NO hacerlo: el usuario pidió explícitamente que Gastón "se vea tierno" en general y el contraste cara-dulce/voz-filosa es intencional, no un defecto — no se re-litiga sin que el usuario lo pida; (3) margen ajustado entre ojos y mofletes (invisible en las capturas, pero frágil ante el próximo retoque) → corregido moviendo los mofletes 2px hacia abajo en `Mascota.tsx`, `vista-previa-app.html` y `estados-mascota.html` — cambio geométrico sin efecto visual, no requiere re-revisión; (4) `estados-mascota.html` duplica el SVG a mano en vez de reusar el componente con una prop de emoción → queda como mejora de arquitectura futura, no urgente (es un archivo de referencia/documentación, no código de producto).
- [RESUELTO 2026-09-17] El usuario preguntó por la moneda ("todo en dólares, pero en CR son colones") — primero se aclaró el precio de suscripción de la landing (Hotmart ya convierte a la moneda local del comprador en su propio checkout, verificado con fuente), y de paso se le agregó "USD" a los precios de la Oferta y el FAQ para que "$" no se confunda con un peso/colón local (cambio de texto puro, sin tocar layout — verificado a 375px, no requiere re-revisión del veredicto de landing). Después el usuario aclaró que se refería a DENTRO DE LA APP (el registro de gastos): esa es la decisión real, documentada arriba en "Decisiones técnicas" — cada usuario anota y ve sus montos en su propia moneda (columna `moneda` en `profiles`, pregunta en el onboarding, formateo con `Intl` en toda la app) — no hace falta convertir entre monedas porque los datos son privados por usuario.
- [ACEPTADO POR EL USUARIO 2026-09-17] Veredicto de onboarding: 8 pasadas del revisor-visual, NINGUNA dio LISTA. Trayectoria: usabilidad 24→25→29→31→32→29→29→28 /40 · craft 11→13→15→14→15→15→13→14 /20 · copy 15→18→16→16→16→15→15→15 /20 — nunca alcanzó el gate (≥36/40 y ≥16/20). Rondas 1-7 corrigieron decenas de defectos reales (vacíos muertos, validaciones sin feedback, ícono genérico, loading sin blueprint, escape hatches, buscador+fade de país, fondo plano, formularios sin Enter, bug de reacción no limpiada al retroceder, mascota con idle de respiración, acento en los 11 títulos, superficies unificadas, símbolo real de moneda — detalle en ediciones previas de este archivo). Rondas 6-8 se estancaron en el mismo rango puliendo detalles cada vez más finos (escala tipográfica exacta vs. ficha, anclaje de CTA entre pantallas, un tick de desincronización en el loading, `<label>` en inputs, país con scroll). Ante el estancamiento, se le mostraron al usuario 6 capturas reales del recorrido completo (docs/revisiones/onboarding-01/03/05/08/09/10) y, tras revisarlas directamente, respondió explícitamente "Se ve bien, sigamos al siguiente paso" — decisión de producto suya, no un bypass técnico. Los defectos finos de la 8ª pasada quedan pendientes de valor bajo/opcional (no bloqueantes): unificar escala tipográfica a los 4 peldaños exactos de FICHA-ARTE en `ui.tsx`, unificar el anclaje del CTA (mt-auto vs justify-center) en todas las pantallas, ajustar el timing del anillo de `PantallaLoading` para que no llegue a 100% antes que el último check, agrupar la lista de país por región o acotarla a los países más frecuentes, y agregar `<label>` (visible o sr-only) a los 3 inputs de texto libre restantes. Se revisan si el usuario los pide o en un futuro pulido general, no bloquean avanzar al paywall.
- [EN CURSO] Veredicto de landing CADUCADO otra vez: al crear `app/onboarding/page.tsx` y el stub `app/paywall/page.tsx` (archivos nuevos, no tocan `app/page.tsx` ni sus componentes), el gate de frescura los detecta como ".tsx más nuevo que el veredicto" aunque no afectan la landing. Se re-lanza el revisor-visual de landing solo si el usuario pide re-confirmarla; si no, queda documentado que el contenido de la landing no cambió desde su 10ª pasada (LISTA, 36/40 · 18/20 · 20/20).

## Pendientes del usuario (acciones que el usuario debe hacer)
- [x] Confirmar el nombre definitivo de la app — RESUELTO 2026-09-25: **CashPet**
- [ ] Crear cuentas de GitHub, Supabase, Vercel, Resend y Hotmart, y comprar el dominio — EN CURSO, Sesión 6. El footer de la landing usa `soporte@cashpet.app` como email de ejemplo — se actualiza al dominio real cuando se compre

## Notas para la próxima sesión
- El usuario pegó el RESUMEN FINAL — IDEA VALIDADA completo (CashPet.pdf): no se debe re-validar la idea ni proponer alternativas de nicho. Sí falta verificación propia de revenue de competidores (Cleo/Duolingo) para completar FICHA-MODELO con fuentes públicas.
- Ojo con el nombre: el PDF llama a la app "Fintchi" (tentativo) con "CashPet" como alternativa, pero el usuario nombró su carpeta y el archivo "CashPet" — se está usando CashPet como nombre de trabajo hasta que el usuario confirme.
