# ESTADO — CashPet
Última actualización: 2026-09-16 | Sesión actual: 1

⏸️ CHECKPOINT — Última acción completada: FICHA-MODELO.md creada y aprobada por evidencia (Cleo AI, 2 señales de revenue independientes) / Siguiente acción exacta: mostrar el plano de Cleo y el eje de diferenciación al usuario, luego seguir Sesión 1 con el gate de unit economics (40), arquitectura y BD

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

## Dirección de Arte (Sesión 2 — NO cambiar sin justificación)
- FICHA-ARTE.md: NO existe todavía (se hace en Sesión 2)
- ¿Hubo referencia visual del usuario?: NO, aún no preguntado
- Resumen: pendiente
- Personalidad: pendiente (a definir con el compilador de personalidad, sesión 2)
- REGISTRO ANTI-REPETICIÓN: pendiente

## Avatar y venta (Sesión 1 — NO cambiar sin validar)
- FICHA-AVATAR.md: existe, estado BORRADOR — creada 2026-09-16, pendiente de aprobación explícita del usuario
- Resumen: avatar "Camila", 26 años, diseñadora freelance LATAM · dolor #1: "no sé en qué se me fue el sueldo" · deseo #1: "llegar a fin de mes con plata de sobra" · nivel de consciencia: alto (4/5) · sofisticación: media-alta
- Landing: no iniciada

## Estrategia de monetización (Sesión 1 — NO cambiar sin validar)
- Modelo: Onboarding-first con trial (Modelo 2 de 02C) — decidido por la matriz de nicho "Finanzas" (primera victoria = diagnóstico inicial, paywall tras el diagnóstico) con tie-breaker de frecuencia diaria resuelto vía gamificación de constancia (24), no vía modelo de cobro
- Justificación: el nicho finanzas pide confianza antes de pedir la tarjeta; el uso diario se retiene con rachas, no con paywall temprano. Coincide con lo ya definido en la investigación del usuario (trial de 7 días, diagnóstico + gasto de prueba como primera victoria)
- Diseño del paywall: aparece después de que el usuario registra su presupuesto + un gasto de prueba y recibe la primera reacción de la mascota (la "primera victoria" del punto 10 de la investigación)
- Trial: 7 días — justificado porque el aha es inmediato (minutos), no requiere acumulación de datos
- Pricing: $4.99/mes | $39.99/año (equivalente a $3.33/mes, mostrado como ahorro) — tomado del benchmark de la investigación del usuario; falta pasar el gate de unit economics (40) para confirmar margen con el costo real de IA

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

## Sesiones completadas ✅
(ninguna cerrada todavía — Sesión 1 en curso)

## Sesión en progreso 🔧
- Sesión 1 — Validación, avatar, monetización y arquitectura. Hecho: idea validada (traída por el usuario, no se re-valida), FICHA-AVATAR.md en borrador, FICHA-MODELO.md aprobada (app modelo: Cleo AI). Falta: gate de unit economics (40), esquema de base de datos y método de auth

## Próximas sesiones 📋
- Sesión 1 (continuación): gate de unit economics (40) con el costo real de Claude Haiku 4.5, esquema de base de datos y método de auth
- Sesión 2: identidad visual (FICHA-ARTE.md) y sistema de diseño
- Sesión 3: página de ventas (landing)

## Problemas conocidos ⚠️
- [RESUELTO] `scripts/lib-conversion.mjs` (auditoría de conversión del propio SO) escaneaba `plantillas-codigo/` — la biblioteca de plantillas de referencia que trae el sistema — como si fuera la landing real del proyecto, bloqueando el cierre de sesión desde la instalación. Se agregó `plantillas-codigo` a `EXCLUDE_DIRS` (2026-09-17). Verificado con `bash .claude/hooks/pre-stop.sh` → exit 0.

## Pendientes del usuario (acciones que el usuario debe hacer)
- [ ] Confirmar el nombre definitivo de la app: CashPet (nombre de carpeta/archivo del usuario) vs Fintchi (nombre tentativo de su propia investigación) vs RegañadorFinanciero
- [ ] Más adelante: crear cuentas de Hotmart, Supabase, Vercel, Resend y comprar el dominio (se le avisará con guía paso a paso cuando llegue el momento)

## Notas para la próxima sesión
- El usuario pegó el RESUMEN FINAL — IDEA VALIDADA completo (CashPet.pdf): no se debe re-validar la idea ni proponer alternativas de nicho. Sí falta verificación propia de revenue de competidores (Cleo/Duolingo) para completar FICHA-MODELO con fuentes públicas.
- Ojo con el nombre: el PDF llama a la app "Fintchi" (tentativo) con "CashPet" como alternativa, pero el usuario nombró su carpeta y el archivo "CashPet" — se está usando CashPet como nombre de trabajo hasta que el usuario confirme.
