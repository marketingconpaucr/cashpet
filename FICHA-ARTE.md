# FICHA DE DIRECCIÓN DE ARTE — CashPet

## Referencia del usuario (CONTRATO — ver 16, protocolo obligatorio)
- ¿Hay imagen(es) de referencia del usuario?: SÍ → 5 capturas (apps "Party Animals"/mascotas 3D, "lila", "Habitz", "SaveSmart") + ajuste propio pidiendo que la mascota "dé ganas de cuidarla"
- Extracción (mirada con herramienta de imágenes):
  - Modo: claro · Fondo: #FDF1E7 (crema durazno) · Superficie: #FFFFFF · Texto 1º/2º: #3A2A1E / #8A7A6C
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
- Arquetipo: Bufón/Cuidador (mascota juguetona que también da ganas de cuidar) · Mundo del sujeto: mascota-criatura tipo "tamagotchi financiero" — orejitas de osito, mofletes, brote que crece con el ahorro (metáfora directa: tu plata crece, tu mascota crece)
- Dispositivo ownable: la mascota-blob con brote en la cabeza (crece de nivel visualmente, no solo con un número) · paleta violeta tomada de las capturas del usuario

## Personalidad compilada
- 3 adjetivos de personalidad: tierna, cálida, juguetona
- Compilación: spring suave (no rebote agresivo) · duración base ~220ms · exclamaciones máx 1/pantalla (la reacción de la mascota) · celebración de nivel: la mascota "crece" (brote más grande) · radio tendencial 20-24px

## Brand kit final (valores para globals.css/@theme)
- Fondo: #FDF1E7 · Superficie: #FFFFFF · Hundido: #F7F1E9 · Texto 1º/2º: #3A2A1E / #8A7A6C
- Acento: #7C5CFC (SOLO en: CTA principal, tabbar activa, insights, chips) · 2ª nota: verde brote #8CE0A0 (solo en el detalle de "crecimiento" de la mascota, nunca en UI general)
- Semánticos: éxito #7C5CFC (reutiliza el acento — app sin conexión bancaria, sin rojo de alarma a propósito) · error #E0574C · aviso #F5A623
- Display: Fredoka (pesos 500/600/700) · Body: Nunito (pesos 400/600/700/800) · Escala: display 42px / title 25px / body 14.5px / label 11.5px
- Radio: 20-24px (cards), 20px/píldora (botones) · Profundidad: hairline degradado + sombra tintada violeta en 2 capas · Espaciado base: escala 4·8·12·16·24·32·48·64
- Dispositivo ownable: mascota-blob con orejitas, mofletes y brote de "crecimiento" (propio, derivado de las capturas del usuario)
- Motion signature: easing suave (ease-out) · stagger ~60ms entre cards · firma: la mascota "respira"/parpadea sutil en estados idle (a implementar en código real, Sesión 5)

## Trazabilidad y vetos
- Ruta de diseño: RUTA 2 — referencia parcial del usuario (moodboard de 5 capturas), no propuesta desde cero
- Protocolo A/B/C: opción elegida A ("Tu mascota, en grande") · descartadas: B ("El arco de tu plata" — anillo arcoíris, lavanda) y C ("Tu compañera con carita" — timeline editorial, blanco) — ambas quedan documentadas como alternativas válidas si se quiere revisar más adelante · página comparativa: `direcciones-abc.html` (raíz del proyecto)
- Ajuste post-elección: la mascota se rediseñó a pedido del usuario ("que dé ganas de cuidarla") — de un blob liso a un personaje con orejitas, mofletes y brote — aplicado ANTES de fijar la ficha
- Tour de la app: `vista-previa-app.html` (raíz del proyecto) · vistas incluidas: pantalla principal (M0), onboarding (pregunta de presupuesto diario), paywall (anual recomendado + mensual), mecanismo (mascota reaccionando a un gasto) · aprobado por el usuario: SÍ — 2026-09-17 (eligió A directamente tras ver la comparativa)
- Paleta derivada de: referencia del usuario (capturas "lila"/"Habitz", violeta recurrente) — tomada tal cual, sin desafinar el hue
- Registro anti-repetición: paleta violeta #7C5CFC + par Fredoka/Nunito anotados en ESTADO.md → vetados para el próximo proyecto del SO
- Modo (claro/oscuro) DERIVADO por: las 5 capturas del usuario son predominantemente claras (4 de 5) y el usuario pidió explícitamente "más amigable a la vista" — claro gana

## Idioma UI: Español (voseo/tuteo neutro LATAM, ver FICHA-AVATAR.md) · Fecha de cierre de la ficha: 2026-09-17 · Aprobada por el usuario: SÍ
