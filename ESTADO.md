# ESTADO — CashPet
Última actualización: 2026-09-16 | Sesión actual: 1

⏸️ CHECKPOINT — Última acción completada: Sesión 2 CERRADA — usuario eligió Opción A, tour de la app (vista-previa-app.html) aprobado, FICHA-ARTE.md creada y aprobada / Siguiente acción exacta: mostrar el cierre de Sesión 2 al usuario y esperar su OK para arrancar Sesión 3 (página de ventas / landing)

## Qué es esta app (3 líneas máximo)
Tracker de gastos gamificado con una mascota de IA con personalidad: el usuario anota un gasto en segundos y la mascota reacciona (felicita o regaña con humor), genera rachas de ahorro y sube de nivel. Para adultos jóvenes en LATAM (22-35) que ganan bien pero sienten que el dinero "se les evapora". Monetización por suscripción ($4.99/mes o $39.99/año) vía Hotmart.

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
- FICHA-AVATAR.md: existe, estado BORRADOR — creada 2026-09-16, pendiente de aprobación explícita del usuario
- Resumen: avatar "Camila", 26 años, diseñadora freelance LATAM · dolor #1: "no sé en qué se me fue el sueldo" · deseo #1: "llegar a fin de mes con plata de sobra" · nivel de consciencia: alto (4/5) · sofisticación: media-alta
- Landing: no iniciada

## Estrategia de monetización (Sesión 1 — NO cambiar sin validar)
- Modelo: Onboarding-first con trial (Modelo 2 de 02C) — decidido por la matriz de nicho "Finanzas" (primera victoria = diagnóstico inicial, paywall tras el diagnóstico) con tie-breaker de frecuencia diaria resuelto vía gamificación de constancia (24), no vía modelo de cobro
- Justificación: el nicho finanzas pide confianza antes de pedir la tarjeta; el uso diario se retiene con rachas, no con paywall temprano. Coincide con lo ya definido en la investigación del usuario (trial de 7 días, diagnóstico + gasto de prueba como primera victoria)
- Diseño del paywall: aparece después de que el usuario registra su presupuesto + un gasto de prueba y recibe la primera reacción de la mascota (la "primera victoria" del punto 10 de la investigación)
- Trial: 7 días — justificado porque el aha es inmediato (minutos), no requiere acumulación de datos
- Pricing: $4.99/mes | $39.99/año (equivalente a $3.33/mes, mostrado como ahorro) — tomado del benchmark de la investigación del usuario
- Gate de unit economics (40) — PASA: costo de IA estimado ~$0.15/usuario/mes (Haiku 4.5, ~120 reacciones/mes de ~500 tokens entrada + 150 salida) = ~3% del precio de catálogo (regla: debe ser <20% — sobra margen). Venta directa: neto ~$3.94 tras fee Hotmart+impuestos, menos COGS (~$0.60 IA+infra+email) = margen ~$3.34 (~85%). Peor caso, venta por afiliado al 50%: neto ~$1.44, margen ~$0.84 (~58%) — sigue siendo positivo, aunque ese es el escenario a vigilar si la mayoría de ventas viene de afiliados

## Gamificación y retención (loop documentado en Sesión 4; momentos construidos en Sesión 5)
- Loop del hábito (Hooked): Gatillo [necesidad/impulso de gastar o hábito de revisar el día] → Acción [registrar el gasto en <5s] → Recompensa [reacción de la mascota + racha viva] → Inversión [la mascota sube de nivel / desbloquea personalidad]
- Mecánicas elegidas: racha diaria (streaks) · medallas/hitos · nivel de la mascota
- Primera victoria que celebra el onboarding (<60s): registrar presupuesto mensual + un gasto de prueba y recibir la primera reacción divertida/sarcástica de la mascota
- Notificaciones de re-enganche: pendiente de diseñar en Sesión 4-5 (tope ≤1-2/día)

## Secuencia maestra de construcción (NO saltar)
- Estado de la secuencia: aún no se construye nada — en Sesión 1 (validación/avatar/monetización/arquitectura)
- Ruta aprobada: `/` → `/onboarding` → `/paywall` → `/login` → `/app`
- Landing: pendiente — protagonista: la reacción de la mascota a un gasto — CTA primario: pendiente de definir en Sesión 3
- Onboarding: pendiente — primera decisión: ingresar presupuesto mensual aproximado
- Paywall: pendiente — oferta principal: $4.99/mes o $39.99/año con trial de 7 días
- Login/Auth: pendiente — motivo de pedir cuenta: guardar historial de gastos, rachas y suscripción
- App interna: pendiente — secciones (borrador, a confirmar en Sesión 5): Registro de gasto / Mascota+chat / Rachas y progreso
- Servicios externos: pendiente — GitHub/Supabase/IA/Vercel/Resend/dominio/Hotmart

## Puertas de etapa (aprobación antes de avanzar)
- Landing: no iniciada
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
- Sesión 1 — Validación (idea traída por el usuario, no re-validada) · FICHA-AVATAR.md en borrador (Camila) · FICHA-MODELO.md aprobada (app modelo: Cleo AI) · modelo de negocio elegido: onboarding primero, pago después ($4.99/$39.99, trial 7 días) · gate de unit economics: PASA (~3% de IA sobre precio, margen positivo incluso con afiliado al 50%) · auth y esquema de BD (`profiles`/`gastos` + RLS) diseñados — cerrada 2026-09-17
- Sesión 2 — Identidad visual: comparativa A/B/C basada en referencias del usuario (no en líderes) · mascota rediseñada más tierna a pedido del usuario · Opción A elegida ("Tu mascota, en grande") · tour de la app aprobado · FICHA-ARTE.md cerrada y aprobada — cerrada 2026-09-17

## Sesión en progreso 🔧
(ninguna — esperando OK del usuario para arrancar Sesión 3)

## Próximas sesiones 📋
- Sesión 3: página de ventas (landing) — 10 secciones canónicas, copy derivado de FICHA-AVATAR.md, estilo de FICHA-ARTE.md

## Decisiones de producto (fuera de la secuencia técnica)
- Mascota: se queda en SVG vectorial (gratis, liviano, ya tierna) para el MVP. El usuario preguntó por mascotas 3D renderizadas tipo "Fluffy"/"Uni" (imágenes fijas por estado, no vectorial) — se explicó el costo (ilustrador o generación con IA, gasto real) y quedó como mejora FUTURA, no ahora. No re-litigar esto salvo que el usuario lo pida.

## Problemas conocidos ⚠️
- [RESUELTO] `scripts/lib-conversion.mjs` (auditoría de conversión del propio SO) escaneaba `plantillas-codigo/` — la biblioteca de plantillas de referencia que trae el sistema — como si fuera la landing real del proyecto, bloqueando el cierre de sesión desde la instalación. Se agregó `plantillas-codigo` a `EXCLUDE_DIRS` (2026-09-17). Verificado con `bash .claude/hooks/pre-stop.sh` → exit 0.
- [RESUELTO] El check 14 (TEST DE DIVERGENCIA de la comparativa A/B/C) medía similitud de DOM sobre el frame COMPLETO de cada opción, incluyendo el panel `.meta` y el `.hero-landing` — que el propio kit-abc-v2 mantiene IDÉNTICOS a propósito en las 3 opciones (ficha comparable). Eso hacía que cualquier comparativa bien tematizada con el kit oficial diera falso positivo de ">80% similar". Se acotó la comparación al contenido real de `.pantalla` en `scripts/lib-conversion.mjs` (2026-09-17). También se quitó el bloque de comentarios "CÓMO USAR ESTE KIT" de `direcciones-abc.html` (era instrucción para el agente, no parte del entregable) porque contenía un emoji ⚠️ que el gate de "cero emojis" detectaba como si fuera UI visible.

## Pendientes del usuario (acciones que el usuario debe hacer)
- [ ] Confirmar el nombre definitivo de la app: CashPet (nombre de carpeta/archivo del usuario) vs Fintchi (nombre tentativo de su propia investigación) vs RegañadorFinanciero
- [ ] Más adelante: crear cuentas de Hotmart, Supabase, Vercel, Resend y comprar el dominio (se le avisará con guía paso a paso cuando llegue el momento)

## Notas para la próxima sesión
- El usuario pegó el RESUMEN FINAL — IDEA VALIDADA completo (CashPet.pdf): no se debe re-validar la idea ni proponer alternativas de nicho. Sí falta verificación propia de revenue de competidores (Cleo/Duolingo) para completar FICHA-MODELO con fuentes públicas.
- Ojo con el nombre: el PDF llama a la app "Fintchi" (tentativo) con "CashPet" como alternativa, pero el usuario nombró su carpeta y el archivo "CashPet" — se está usando CashPet como nombre de trabajo hasta que el usuario confirme.
