'use client';

// Landing de CashPet — compuesta desde el kit canónico (components/landing/).
// Copy 100% derivado de docs/copy/landing.md (marcado, trazado a FICHA-AVATAR.md).
// Tokens visuales: components/landing/tokens.css (tematizado desde FICHA-ARTE.md).

import { useState } from 'react';
import { motion } from 'motion/react';
import { Wallet, ClipboardList, Frown, ShoppingBag, Flame } from 'lucide-react';
import { Mascota } from '@/components/Mascota';
import { CountUp, IconChip, SectionShell, useReveal, VIEWPORT_ONCE } from '@/components/landing/ui';
import { Hero } from '@/components/landing/Hero';
import { Problema } from '@/components/landing/Problema';
import { Agitacion } from '@/components/landing/Agitacion';
import { Solucion } from '@/components/landing/Solucion';
import { AppPorDentro } from '@/components/landing/AppPorDentro';
import { Oferta } from '@/components/landing/Oferta';
import { Garantia } from '@/components/landing/Garantia';
import { Faq } from '@/components/landing/Faq';
import { CtaFinal } from '@/components/landing/CtaFinal';
import { FooterLegal } from '@/components/landing/FooterLegal';
import { StickyCtaMobile } from '@/components/landing/ui';

// Modelo 2 (onboarding-first, decidido en ESTADO.md — 02C): el CTA lleva a
// /onboarding, nunca al checkout desde el hero.
const CTA_HREF = '/onboarding';
const CTA_LABEL = 'Quiero mi mascota financiera';

export default function LandingCashPet() {
  const { contenedor, item } = useReveal();
  const [mecanismoImgFallo, setMecanismoImgFallo] = useState(false);

  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      {/* Ancla a la oferta visible en desktop/teclado — en mobile ya cubre esto StickyCtaMobile */}
      <div className="sticky top-0 z-30 hidden justify-end border-b border-[color-mix(in_oklab,var(--text-tertiary)_20%,transparent)] bg-[var(--surface)] px-6 py-2 md:flex">
        <a href="#oferta" className="text-sm font-semibold text-[var(--accent)] hover:underline">
          Ver plan y precios
        </a>
      </div>

      {/* 1. HERO */}
      <Hero
        appName="CashPet"
        loginHref="/entrar"
        h1Marked="La mascota que te [acento]quita la tarjeta[/acento] de las manos"
        subtitleMarked="El Freno de 5 Segundos actúa [b]antes de la compra que vas a lamentar.[/b]"
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        socialProof={
          <span>
            Sin conectar tu banco · 7 días gratis
            <br />
            Como el mecanismo detrás de Cleo, con más de 1.1 millones de usuarios pagos{' '}
            <span className="text-[var(--text-tertiary)]">(dato público, Sacra, jul-2025)</span>
          </span>
        }
        visual={
          <div className="relative flex flex-col items-center gap-3 px-6 py-10">
            <Mascota size={120} />
            <div
              className="rounded-[var(--radius-card)] px-4 py-3 text-sm font-semibold shadow-[var(--shadow-2)]"
              style={{ background: 'var(--surface)', color: 'var(--text-primary)' }}
            >
              &ldquo;¿Otro café? Qué autocontrol el tuyo&rdquo;
            </div>

            {/* Card flotante: capa de profundidad — muestra el mecanismo de racha, no es un dato de uso real */}
            <div className="absolute right-2 top-20 flex items-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_20%,transparent)] bg-[var(--surface)] px-4 py-3 shadow-[var(--shadow-2)] rotate-[4deg] sm:right-8">
              <IconChip icon={Flame} />
              <div className="text-left">
                <p className="text-base font-bold leading-none text-[var(--text-primary)]">14 días</p>
                <p className="mt-1 text-xs text-[var(--text-tertiary)]">de racha</p>
              </div>
            </div>
          </div>
        }
      />

      {/* 2. PROBLEMA */}
      <Problema
        titulo="¿Te suena?"
        preguntas={[
          { icon: Frown, textoMarked: '¿Sientes un microinfarto cada vez que abres la app de tu banco?' },
          { icon: Wallet, textoMarked: '¿Llegas al día 20 sin saber en qué se te evaporó el sueldo?' },
          { icon: ClipboardList, textoMarked: 'Ya probaste Excel o YNAB, ¿y los abandonaste en 3 días?' },
          { icon: ShoppingBag, textoMarked: '¿Compras por impulso y te arrepientes minutos después?' },
        ]}
      />

      {/* 3. AGITACIÓN */}
      <Agitacion
        frases={[
          'No es que no sepas ahorrar: es que nadie te avisa hasta que [b]ya gastaste[/b].',
          'Un café y un domicilio de más por semana se sienten inofensivos — hasta que sumas [acento]el año completo[/acento].',
        ]}
        contraste={{
          labelHoy: 'Hoy',
          hoy: 'Revisas tu cuenta con el corazón en la boca, sintiéndote una irresponsable.',
          labelFuturo: 'En 6 meses, si nada cambia',
          futuro: 'El mismo miedo, mes tras mes — hasta que decidas frenarlo hoy.',
        }}
      />

      {/* Puente visual entre Agitación y Solución — el dato héroe del costo real (FICHA-AVATAR.md),
          conteo animado (baseline de DESIGN-CORE), luego la mascota como alivio. Fondo hundido
          propio para no fundirse ni con Agitación (elevada) ni con Solución (base). */}
      <SectionShell elevacion="base" compacta className="bg-[var(--surface-2)]" ariaLabel="El costo real de no darte cuenta">
        <motion.div
          variants={contenedor}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="mx-auto flex max-w-md flex-col items-center gap-2 text-center"
        >
          <motion.p variants={item} className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
            Lo que ya te está costando no darte cuenta
          </motion.p>
          <motion.p variants={item} className="mt-1 text-[48px] font-bold leading-none text-[var(--accent)] [font-family:var(--font-display)]">
            <CountUp to={1800} prefix="+$" />
          </motion.p>
          <motion.p variants={item} className="text-sm text-[var(--text-secondary)]">
            al año en gastos hormiga — hasta $2.400 si no los frenas
          </motion.p>
          <motion.div variants={item} className="mt-6 flex flex-col items-center gap-3">
            <Mascota size={72} />
            <p
              className="rounded-[var(--radius-card)] px-4 py-2 text-sm font-semibold"
              style={{ background: 'var(--surface)', color: 'var(--accent)' }}
            >
              &ldquo;Yo aviso antes. Tú decides ignorarme.&rdquo;
            </p>
          </motion.div>
        </motion.div>
      </SectionShell>

      {/* 4. SOLUCIÓN */}
      <Solucion
        tituloMarked="Alguien te detiene [acento]antes del error[/acento], no después"
        mecanismo="el Freno de 5 Segundos"
        bigIdeaMarked="No te falta fuerza de voluntad: te falta [b]alguien que te detenga a tiempo[/b]."
        pasos={[
          { titulo: 'Anota el gasto', detalle: 'Escribe o dicta lo que gastaste, en 5 segundos.' },
          { titulo: 'Tu mascota te frena', detalle: 'Te dice la verdad con humor, antes de que sigas gastando.' },
          { titulo: 'Sube tu racha', detalle: 'Cada día sin pasarte del límite, tu mascota crece.' },
        ]}
        antesDespues={{
          labelAntes: 'Antes',
          antes: 'Descubres el daño a fin de mes, cuando ya no hay nada que hacer.',
          labelDespues: 'Después',
          despues: 'Tu mascota te frena en el momento — antes de que la tarjeta salga de tu cartera.',
        }}
      />

      {/* Puente visual entre Solución y el carrusel — prueba de que el mecanismo es real, con una
          escena DISTINTA a la del carrusel (el usuario notó que se repetía la misma captura) y a
          la del hero. Fondo hundido propio para no fundirse con Solución (base). */}
      <SectionShell elevacion="base" compacta className="bg-[var(--surface-2)]" ariaLabel="Prueba del mecanismo en acción">
        <motion.div
          variants={contenedor}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="flex flex-col items-center gap-3"
        >
          <motion.div
            variants={item}
            className="relative aspect-[9/19.5] w-48 overflow-hidden rounded-[30px] border-[5px] shadow-[var(--shadow-2)]"
            style={{ borderColor: 'color-mix(in oklab, var(--text-primary) 90%, var(--accent))' }}
          >
            {!mecanismoImgFallo ? (
              <img
                src="/mockups/mecanismo-impulso.png"
                alt="La mascota de CashPet reaccionando a una compra en línea"
                width={192}
                height={417}
                loading="lazy"
                className="h-full w-full object-cover"
                onError={() => setMecanismoImgFallo(true)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center border-2 border-dashed border-[color-mix(in_oklab,var(--text-tertiary)_40%,transparent)] bg-[var(--surface-2)] px-4">
                <span className="text-center text-sm font-medium text-[var(--text-secondary)]">Mecanismo</span>
              </div>
            )}
          </motion.div>
          <motion.p variants={item} className="max-w-[28ch] text-center text-sm font-medium text-[var(--text-secondary)]">
            Así se ve en tu teléfono, en el momento exacto del gasto.
          </motion.p>
        </motion.div>
      </SectionShell>

      {/* 5. LA APP POR DENTRO — placeholders honestos (screenshots reales: Sesión 5) */}
      <AppPorDentro
        tituloMarked="Tu día, con [acento]mascota incluida[/acento]"
        frames={[
          { src: '/mockups/hoy.png', alt: 'Pantalla principal de CashPet con la mascota y la racha del día', label: 'Tu pantalla de cada día', nombrePantalla: 'Hoy' },
          { src: '/mockups/onboarding.png', alt: 'Pregunta del onboarding sobre el presupuesto diario', label: 'Así te pregunta al empezar', nombrePantalla: 'Onboarding' },
          { src: '/mockups/paywall.png', alt: 'Pantalla de planes anual y mensual', label: 'Elige tu plan en segundos', nombrePantalla: 'Paywall' },
          { src: '/mockups/mecanismo.png', alt: 'La mascota reaccionando a un domicilio de más', label: 'Así reacciona tu mascota', nombrePantalla: 'Mecanismo' },
        ]}
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
      />

      {/* 6. OFERTA — anual primero, trial 7 días (02C), precio confirmado 2026-09-17 */}
      <Oferta
        tituloMarked="Por menos de [acento]un café al día[/acento]"
        trialDias={7}
        anual={{
          nombre: 'Anual',
          badge: 'MÁS POPULAR',
          precioMes: '$5.83',
          totalAnual: 'Se cobra $69.99/año',
          ahorro: '35% de descuento',
          descomposicionDia: 'menos de $0.20 al día',
          ctaLabel: 'Empezar mis 7 días gratis',
          ctaHref: CTA_HREF,
          features: [
            'Reacciones ilimitadas de tu mascota',
            'Historial completo de tus rachas',
            'Niveles y crecimiento de tu mascota',
            'Soporte prioritario por email',
            'Garantía de la Primera Racha: 15 días',
          ],
        }}
        mensual={{
          nombre: 'Mensual',
          precioMes: '$8.99',
          ctaLabel: 'Elegir mensual',
          ctaHref: CTA_HREF,
          features: [
            'Reacciones ilimitadas de tu mascota',
            'Historial completo de tus rachas',
            'Niveles y crecimiento de tu mascota',
            'Cancela cuando quieras',
          ],
        }}
      />

      {/* 7. GARANTÍA */}
      <Garantia
        nombre="la Garantía de la Primera Racha"
        condicionMarked="Si en tus primeros 15 días de pago el Freno de 5 Segundos no te ayuda a [b]sentir más control sobre tu dinero[/b], te devolvemos todo. Sin preguntas."
        pisoLegal="Respaldada por la garantía de reembolso de Hotmart: 15 días desde tu primer cobro, después de tus 7 días de prueba gratis"
      />

      {/* 8. FAQ — objeciones reales de FICHA-AVATAR.md */}
      <Faq
        items={[
          {
            pregunta: '¿CashPet se conecta a mi cuenta bancaria?',
            respuestaMarked: 'No. [b]Nunca pedimos tus credenciales bancarias[/b]: anotas cada gasto tú mismo, en segundos.',
          },
          {
            pregunta: '¿Y si lo dejo de usar a los 3 días?',
            respuestaMarked: 'No es una hoja de cálculo: es un juego con [b]rachas y una mascota que reacciona[/b] cada vez que gastas.',
          },
          {
            pregunta: '¿Por qué pagar si quiero ahorrar?',
            respuestaMarked: 'Cuesta menos de $0.20 al día y [b]frena los gastos hormiga que hoy no ves[/b] — se paga solo.',
          },
          {
            pregunta: '¿Me va a hacer sentir peor si gasto de más?',
            respuestaMarked: 'No. Tu mascota tiene 5 emociones — te acompaña con humor, [b]nunca con culpa[/b].',
          },
          {
            pregunta: '¿Qué pasa si no me sirve?',
            respuestaMarked: '7 días gratis, y si pagas y no te convence: [b]un correo y te devolvemos todo[/b].',
          },
        ]}
      />

      {/* 9. CTA FINAL */}
      <CtaFinal
        h2Marked="Deja de gastar en [acento]piloto automático[/acento]"
        futurePacingMarked="Anotas el gasto, tu mascota te frena, y por primera vez tienes el control — no tus impulsos."
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        recap="Sin conectar tu banco · Cancela cuando quieras"
        psMarked="PS: El Freno de 5 Segundos se interpone entre tú y la compra que ibas a lamentar. Sin conectar tu banco, sin letra chica."
      />

      {/* 10. FOOTER LEGAL — enlaces con stub real (contenido completo: Sesión 6/47) */}
      <FooterLegal
        appName="CashPet"
        soporteEmail="soporte@cashpet.app"
        enlaces={[
          { label: 'Privacidad', href: '/privacidad' },
          { label: 'Términos y Condiciones', href: '/terminos' },
          { label: 'Reembolsos', href: '/reembolsos' },
          { label: 'Aviso de IA', href: '/aviso-ia' },
        ]}
      />

      {/* Sticky CTA mobile (T2) — observa #hero, #oferta y #cta-final */}
      <StickyCtaMobile labelComercial={CTA_LABEL} href={CTA_HREF} />
    </div>
  );
}
