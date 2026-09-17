'use client';

// Landing de CashPet — compuesta desde el kit canónico (components/landing/).
// Copy 100% derivado de docs/copy/landing.md (marcado, trazado a FICHA-AVATAR.md).
// Tokens visuales: components/landing/tokens.css (tematizado desde FICHA-ARTE.md).

import { Wallet, ClipboardList, Frown, ShoppingBag } from 'lucide-react';
import { Mascota } from '@/components/Mascota';
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
  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
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
Como el mecanismo detrás de Cleo, con más de 1.1 millones de usuarios pagos
          </span>
        }
        visual={
          <div className="flex flex-col items-center gap-3 py-6">
            <Mascota size={120} />
            <div
              className="rounded-[var(--radius-card)] px-4 py-3 text-sm font-semibold shadow-[var(--shadow-2)]"
              style={{ background: 'var(--surface)', color: 'var(--text-primary)' }}
            >
              &ldquo;¿Otro café? Ya van 3 esta semana&rdquo;
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
          'Un café y un domicilio de más por semana ya son [acento]más de $500 al año[/acento] que se te escapan sin que lo notes.',
          'Otra hoja de cálculo no lo arregla: [b]más columnas no te dan más autocontrol[/b].',
        ]}
        contraste={{
          labelHoy: 'Hoy',
          hoy: 'Revisas tu cuenta con el corazón en la boca, sintiéndote una irresponsable.',
          labelFuturo: 'En 6 meses, si nada cambia',
          futuro: 'El mismo miedo, mes tras mes — hasta que decidas frenarlo hoy.',
        }}
      />

      {/* 4. SOLUCIÓN */}
      <Solucion
        tituloMarked="Alguien te detiene [acento]antes del error[/acento], no después"
        mecanismo="el Freno de 5 Segundos"
        bigIdeaMarked="No te falta fuerza de voluntad: te falta [b]alguien que te detenga a tiempo[/b]. El Freno actúa en el momento exacto en que ibas a arrepentirte."
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

      {/* 5. LA APP POR DENTRO — placeholders honestos (screenshots reales: Sesión 5) */}
      <AppPorDentro
        tituloMarked="Tu día, con [acento]mascota incluida[/acento]"
        frames={[
          { src: '/mockups/hoy.png', alt: 'Pantalla principal de CashPet con la mascota y la racha del día', label: 'Tu pantalla de cada día', nombrePantalla: 'Hoy' },
          { src: '/mockups/onboarding.png', alt: 'Pregunta del onboarding sobre el presupuesto diario', label: 'Así te pregunta al empezar', nombrePantalla: 'Onboarding' },
          { src: '/mockups/paywall.png', alt: 'Pantalla de planes anual y mensual', label: 'Elige tu plan en segundos', nombrePantalla: 'Paywall' },
          { src: '/mockups/mecanismo.png', alt: 'La mascota reaccionando a un gasto de café', label: 'Así reacciona tu mascota', nombrePantalla: 'Mecanismo' },
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
        condicionMarked="Si en tus primeros 15 días el Freno de 5 Segundos no te ayuda a [b]sentir más control sobre tu dinero[/b], te devolvemos todo. Sin preguntas."
        pisoLegal="Respaldada por la garantía de reembolso de Hotmart de 15 días, además de tus 7 días de prueba gratis"
      />

      {/* 8. FAQ — objeciones reales de FICHA-AVATAR.md */}
      <Faq
        items={[
          {
            pregunta: '¿CashPet se conecta a mi cuenta bancaria?',
            respuestaMarked:
              'No. [b]Nunca pedimos tus credenciales bancarias[/b]: anotas cada gasto tú mismo, en segundos, y tu mascota reacciona al instante.',
          },
          {
            pregunta: '¿Y si lo dejo de usar a los 3 días, como con otras apps?',
            respuestaMarked:
              'Por eso existe el Freno de 5 Segundos: no es una hoja de cálculo, es un juego con [b]rachas y una mascota que reacciona[/b] cada vez que gastas.',
          },
          {
            pregunta: '¿Por qué pagar si lo que quiero es ahorrar?',
            respuestaMarked:
              'Porque cuesta menos de $0.20 al día y te ayuda a [b]frenar los gastos hormiga que hoy no ves[/b] — para la mayoría, eso alcanza para pagar la suscripción sola.',
          },
          {
            pregunta: '¿La mascota me va a hacer sentir peor si gasto de más?',
            respuestaMarked:
              'No. Tu mascota tiene 5 emociones distintas — te acompaña con humor, [b]nunca con culpa[/b]. La idea es que vuelvas mañana, no que te sientas mal hoy.',
          },
          {
            pregunta: '¿Qué pasa si no me sirve?',
            respuestaMarked:
              'Nada de riesgo: 7 días gratis para probar, y si después de pagar sientes que no era para ti, [b]un correo y te devolvemos todo[/b].',
          },
        ]}
      />

      {/* 9. CTA FINAL */}
      <CtaFinal
        h2Marked="Deja de gastar en [acento]piloto automático[/acento]"
        futurePacingMarked="Anotas el gasto, tu mascota te frena, y por primera vez sientes que tienes el control — no tus impulsos."
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        recap="Sin conectar tu banco · Cancela cuando quieras"
        psMarked="PS: Cada gasto hormiga que no frenas hoy es un peso menos mañana. El Freno de 5 Segundos se interpone entre tú y la compra que ibas a lamentar. Sin conectar tu banco, sin letra chica."
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
