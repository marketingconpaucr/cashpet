# ESTADO — CashPet
Última actualización: 2026-09-16 | Sesión actual: 1

⏸️ CHECKPOINT — Última acción completada: Sesión 3 CERRADA — landing real construida en Next.js (app/page.tsx) desde el kit canónico, FICHA-MERCADO.md creada (plazos de garantía verificados contra Hotmart), auditoría de conversión en 0 críticos / Siguiente acción exacta: mostrar la landing corriendo al usuario y esperar su OK para arrancar Sesión 4 (onboarding, paywall y login)

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
- FICHA-ARTE.md: existe y APROBADA — cerrada 2026-09-17
- Resumen: fondo #FDF1E7 (crema durazno) · superficie #FFFFFF · acento #7C5CFC (violeta) · 2ª nota #8CE0A0 (verde brote, solo en la mascota) · Display "Fredoka" · Body "Nunito" · radio 20-24px
- Personalidad: tierna · cálida · juguetona
- Mascota (dispositivo ownable): blob violeta con orejitas de osito, mofletes rosados, ojos grandes con brillo y un brote verde que "crece" con el nivel — vectorial (SVG), no 3D renderizado (decisión de costo, ver Decisiones de producto)
- Ruta de diseño: RUTA 2 (referencia parcial del usuario — 5 capturas: mascotas 3D, "lila", "Habitz", "SaveSmart") — NO se usó la Tabla de Líderes Cleo/Duolingo/Nubank para el look (esa tabla sigue vigente solo para el mecanismo de negocio en FICHA-MODELO.md)
- Comparativa: `direcciones-abc.html` (A elegida · B "arco arcoíris lavanda" y C "carita editorial blanca" descartadas, documentadas ahí) · Tour aprobado: `vista-previa-app.html`
- REGISTRO ANTI-REPETICIÓN: paleta violeta #7C5CFC + par Fredoka/Nunito quedan vetados para el próximo proyecto del SO

## Avatar y venta (Sesión 1 — NO cambiar sin validar)
- FICHA-AVATAR.md: existe y APROBADA por el usuario — 2026-09-17. Cosa juzgada — no reabrir sin pedirlo el usuario
- Resumen: avatar "Camila", 26 años, diseñadora freelance LATAM · dolor #1: "no sé en qué se me fue el sueldo" · deseo #1: "llegar a fin de mes con plata de sobra" · nivel de consciencia: alto (4/5) · sofisticación: media-alta
- FICHA-MERCADO.md: existe — precio anclado al plan medio de Cleo ($8.99), garantía de Hotmart verificada (15 días, secuencial a los 7 de prueba) — ver archivo para lo que falta (price parity, checkout real, conversión esperable: todo NO ENCONTRADO hasta tener cuenta de Hotmart y tráfico real)
- Big Idea + mecanismo bautizado: "el Freno de 5 Segundos" (ver `docs/copy/landing.md`) — aparece en Hero, Solución y Oferta
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
- Estado de la secuencia: Landing lista tras Sesión 3. Sesión 4 sigue con el resto: onboarding, paywall y login
- Ruta aprobada: `/` → `/onboarding` → `/paywall` → `/login` → `/app`
- Landing: CONSTRUIDA — protagonista: la mascota reaccionando a un gasto (mecanismo "el Freno de 5 Segundos") — CTA primario: "Quiero mi mascota financiera" → `/onboarding`
- Onboarding: pendiente (ruta `/onboarding` existe como stub) — primera decisión: ingresar presupuesto diario/mensual aproximado
- Paywall: pendiente — oferta principal: $8.99/mes o $69.99/año con trial de 7 días
- Login/Auth: pendiente — motivo de pedir cuenta: guardar historial de gastos, rachas y suscripción
- App interna: pendiente — secciones (borrador, a confirmar en Sesión 5): Registro de gasto / Mascota+chat / Rachas y progreso
- Servicios externos: pendiente — GitHub/Supabase/IA/Vercel/Resend/dominio/Hotmart

## Puertas de etapa (aprobación antes de avanzar)
- Landing: construida, esperando OK del usuario para pasar a Onboarding
- Onboarding: no iniciada
- Paywall: no iniciada
- Login/Auth: no iniciada
- App interna: no iniciada
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
  - `profiles` (id = auth.users.id · presupuesto_mensual numeric · mascota_personalidad text · mascota_nivel int default 1 · racha_actual int default 0 · racha_mas_larga int default 0 · ultima_actividad date · plan text check in ('trial','activo','cancelado','vencido') · trial_termina timestamptz · created_at/updated_at)
  - `gastos` (id uuid · user_id references profiles(id) on delete cascade · monto numeric(10,2) check(monto>0) · categoria text · descripcion text · reaccion_ia text · gastado_en date default current_date · created_at timestamptz default now())
  - Índices: `gastos(user_id, gastado_en desc)` para el historial · `gastos(user_id)` ya cubierto por el compuesto
  - RLS: todas las tablas con policy `user_id = auth.uid()` (select/insert/update/delete) — un usuario nunca ve gastos de otro
  - Durante el onboarding (sin cuenta), presupuesto + el gasto de prueba viven en el navegador (localStorage) y se migran a `profiles`/`gastos` recién al crear la cuenta — no se toca la base de datos hasta que hay usuario real

## Sesiones completadas ✅
- Sesión 1 — Validación (idea traída por el usuario, no re-validada) · FICHA-AVATAR.md en borrador (Camila) · FICHA-MODELO.md aprobada (app modelo: Cleo AI) · modelo de negocio elegido: onboarding primero, pago después (precio ajustado luego a $8.99/$69.99, ver Estrategia de monetización) · gate de unit economics: PASA · auth y esquema de BD (`profiles`/`gastos` + RLS) diseñados — cerrada 2026-09-17
- Sesión 2 — Identidad visual: comparativa A/B/C basada en referencias del usuario (no en líderes) · mascota rediseñada más tierna a pedido del usuario · Opción A elegida ("Tu mascota, en grande") · tour de la app aprobado · FICHA-ARTE.md cerrada y aprobada — cerrada 2026-09-17
- Sesión 3 — Página de ventas: scaffold real de Next.js 16 + React 19 + Tailwind v4 + Motion + lucide-react instalado · kit canónico de landing copiado y tematizado con FICHA-ARTE · Big Idea + mecanismo "el Freno de 5 Segundos" bautizados · copy completo en `docs/copy/landing.md` derivado de FICHA-AVATAR.md · FICHA-MERCADO.md creada (plazos de garantía Hotmart verificados: 15 días, secuenciales a los 7 de prueba) · landing corriendo en `npm run dev`, verificada a 375px, auditoría de conversión en 0 críticos — cerrada 2026-09-17

## Sesión en progreso 🔧
(ninguna — esperando OK del usuario para arrancar Sesión 4)

## Próximas sesiones 📋
- Sesión 4: onboarding, paywall y login/auth — el resto del camino de venta hasta la app interna

## Decisiones de producto (fuera de la secuencia técnica)
- Mascota: se queda en SVG vectorial (gratis, liviano, ya tierna) para el MVP. El usuario preguntó por mascotas 3D renderizadas tipo "Fluffy"/"Uni" (imágenes fijas por estado, no vectorial) — se explicó el costo (ilustrador o generación con IA, gasto real) y quedó como mejora FUTURA, no ahora. No re-litigar esto salvo que el usuario lo pida.
- El usuario compartió su plantilla Excel personal ("Mi_Presupuesto.xlsx") pidiendo traer su esencia a CashPet. Se extrajo:
  1. CATEGORÍAS REALES adoptadas como default de la app: Renta/Vivienda, Despensa/Comida, Servicios, Transporte, Salud, Mascotas, Suscripciones, Tarjeta de Crédito, Ahorros, Hobbies/Ocio (reemplazan los ejemplos genéricos usados en los mockups)
  2. SISTEMA DE EMOCIONES de la mascota (decisión tomada, ver FICHA-ARTE.md y `docs/revisiones/estados-mascota.html`): 5 caras (Celebrando/Feliz/Neutral/Preocupada/Triste) con los MISMOS umbrales que ya usaba el Excel del usuario en sus comentarios condicionales (ej. "gastaste más de lo que ganaste" → Triste; "quedaste X% abajo del presupuesto" → Celebrando/Feliz). Esto entra en el MVP porque refuerza el mecanismo ya planeado (mascota reacciona), no es scope nuevo.
  3. PRESUPUESTOS POR CATEGORÍA (con comparación presupuesto vs. gasto real por categoría, como en el Excel) — se decide DEJAR PARA FASE 2 (post-lanzamiento): el MVP ya tiene presupuesto diario/mensual simple; agregar presupuesto POR categoría con su propia UI de configuración es fricción extra en el onboarding que la investigación original pidió evitar ("NO construir: gráficos financieros complejos"). Se revisa esto apenas la Fase 1 esté validada con usuarios reales.
  4. NO se adopta: "metas financieras del mes" tipo checklist ni "reflexiones anuales" del Excel — son features de una herramienta de planificación anual, no del hábito diario que vende CashPet. Quedan anotadas acá por si se quieren evaluar más adelante, no se descartan para siempre.

## Problemas conocidos ⚠️
- [RESUELTO] `scripts/lib-conversion.mjs` (auditoría de conversión del propio SO) escaneaba `plantillas-codigo/` — la biblioteca de plantillas de referencia que trae el sistema — como si fuera la landing real del proyecto, bloqueando el cierre de sesión desde la instalación. Se agregó `plantillas-codigo` a `EXCLUDE_DIRS` (2026-09-17). Verificado con `bash .claude/hooks/pre-stop.sh` → exit 0.
- [RESUELTO] El check 14 (TEST DE DIVERGENCIA de la comparativa A/B/C) medía similitud de DOM sobre el frame COMPLETO de cada opción, incluyendo el panel `.meta` y el `.hero-landing` — que el propio kit-abc-v2 mantiene IDÉNTICOS a propósito en las 3 opciones (ficha comparable). Eso hacía que cualquier comparativa bien tematizada con el kit oficial diera falso positivo de ">80% similar". Se acotó la comparación al contenido real de `.pantalla` en `scripts/lib-conversion.mjs` (2026-09-17). También se quitó el bloque de comentarios "CÓMO USAR ESTE KIT" de `direcciones-abc.html` (era instrucción para el agente, no parte del entregable) porque contenía un emoji ⚠️ que el gate de "cero emojis" detectaba como si fuera UI visible.
- [RESUELTO — Sesión 3] Cuatro bugs más en `scripts/lib-conversion.mjs`, todos con el mismo patrón (el escáner trata código/comentarios como si fueran copy o UI visible), encontrados al construir la landing real con el kit canónico oficial del SO — es decir, afectan a CUALQUIER proyecto que use el kit tal cual, no solo a CashPet:
  1. Voseo: `animate` está en el diccionario voseante ("¡animate!") pero colisiona con la prop `animate={{...}}` de Motion, que el propio SO manda usar. Se agregó una guarda: si el match viene seguido de `={` o `:` (sintaxis de código), se descarta.
  2. Emojis: el check escaneaba línea por línea con una regex de inicio de línea que no detectaba comentarios de bloque `/* ... */` sin `*` de continuación (como en `ui.tsx`, que literalmente documenta "nunca el ✓ del sistema" dentro del comentario). Reescrito para detectar comentarios por posición de caracter, no por prefijo de línea.
  3. Hairlines degradé: el check solo buscaba la técnica `padding-box`/`border-box` en archivos `.css` o un componente llamado `GradientBorder` — pero el `<Hairline>` del kit la implementa inline en `.tsx` con ese mismo nombre distinto. Se agregó el escaneo de `.tsx`.
  4. Profundidad de fondo: el check exigía `background` y `radial-gradient(` en la MISMA línea, pero el propio `Hero.tsx` del kit los separa en dos líneas (formato Prettier). Se cambió a una ventana de 4 líneas.
  5. Presupuesto de copy: la regex de "literal largo" no distinguía comillas/backticks dentro de comentarios o código de comillas de copy real, y a veces "tragaba" bloques enteros de código como si fueran un párrafo (por un apóstrofe suelto). Se agregaron tres guardas: no está dentro de un comentario, contiene palabras de prosa en español reales, y no contiene sintaxis de código (`{`, `}`, `=>`, `${`).
  Los 5 fixes están en `scripts/lib-conversion.mjs`, verificados corriendo `bash scripts/audit-conversion.sh` antes y después (bajó de 13 a 0 críticos falsos, sin perder ninguna detección real — se probó con contenido real de la landing).

- [EN CURSO] Landing en iteración con el revisor-visual: 5 pasadas NO LISTA (28→29→28→31→30/40 usabilidad, 12→15→14→14→14/20 craft, copy 19/20 desde la 4ª). Rondas 1-3 (defectos del revisor): mascota en el hero, capturas reales en el carrusel, garantía junto al CTA, prueba social atribuida a Cleo AI, cálculo mostrado en vez de cifra suelta. Feedback directo del usuario en medio (todo resuelto): "no me convence de comprar" → copy más visceral (microinfarto, irresponsable, "te quita la tarjeta de las manos"); "menos texto, más visual" → recorte de copy + mascota como puente entre Agitación y Solución; ejemplo de otra app "menos plano" → card flotante de racha en el hero; "no siento NECESITO y se ve plana" → dato-héroe con la cifra real de FICHA-AVATAR ($1.800-2.400/año, antes un $500 inventado) + captura real del mecanismo; "se repite el café" → 3 escenas distintas (café/domicilio/compra en línea, la última con la cara "Preocupada" del sistema de 5 emociones, a pedido del usuario en 1ª persona: "esta sí me preocupa"). Rondas 4-5 del revisor (10 defectos técnicos, todos corregidos): patrón SectionShell+useReveal+CountUp animado en los bloques nuevos, fondos alternados (`--surface-2`), frames de teléfono unificados (`rounded-[30px] border-[5px]`, igual al carrusel), stub `/entrar`, contraste del CTA recalculado con el color de texto real (`--accent` #7C5CFC→#7154E5, ~9%), ancla "Ver plan y precios" visible en desktop, fallback `onError` en las imágenes reales. Se relanzó una 6ª pasada, resultado pendiente.

## Pendientes del usuario (acciones que el usuario debe hacer)
- [ ] Confirmar el nombre definitivo de la app: CashPet (nombre de carpeta/archivo del usuario) vs Fintchi (nombre tentativo de su propia investigación) vs RegañadorFinanciero
- [ ] Más adelante: crear cuentas de Hotmart, Supabase, Vercel, Resend y comprar el dominio (se le avisará con guía paso a paso cuando llegue el momento). El footer de la landing usa `soporte@cashpet.app` como email de ejemplo — se actualiza al dominio real cuando se compre

## Notas para la próxima sesión
- El usuario pegó el RESUMEN FINAL — IDEA VALIDADA completo (CashPet.pdf): no se debe re-validar la idea ni proponer alternativas de nicho. Sí falta verificación propia de revenue de competidores (Cleo/Duolingo) para completar FICHA-MODELO con fuentes públicas.
- Ojo con el nombre: el PDF llama a la app "Fintchi" (tentativo) con "CashPet" como alternativa, pero el usuario nombró su carpeta y el archivo "CashPet" — se está usando CashPet como nombre de trabajo hasta que el usuario confirme.
