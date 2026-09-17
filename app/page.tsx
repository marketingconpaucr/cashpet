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
        h1Marked="Una mascota que te [acento]frena[/acento] antes de gastar"
        subtitleMarked="El Freno de 5 Segundos: tu mascota reacciona [b]antes de que gastes de más[/b]."
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        socialProof={
          <span>
            Sin conectar tu banco · 7 días gratis
            <br />
            El mismo mecanismo detrás de apps con más de 1 millón de usuarios pagos
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
          { icon: Wallet, textoMarked: '¿Llegas al día 20 sin saber en qué se fue tu sueldo?' },
          { icon: ClipboardList, textoMarked: '¿Te da pereza anotar cada gasto en una hoja de cálculo?' },
          { icon: Frown, textoMarked: '¿Sientes culpa apenas abres la app de tu banco?' },
          { icon: ShoppingBag, textoMarked: '¿Compras por impulso y te arrepientes minutos después?' },
        ]}
      />

      {/* 3. AGITACIÓN */}
      <Agitacion
        frases={[
          'Cada gasto hormiga sin registrar sigue restando, aunque no lo veas ese mismo día.',
          'Esos gastos hormiga que no registras pueden sumar más de [acento]$1.000 al año[/acento] sin que lo notes.',
          'Otra hoja de cálculo no lo arregla: [b]más columnas no es más autocontrol[/b].',
        ]}
        contraste={{
          labelHoy: 'Hoy',
          hoy: 'Revisas tu cuenta con miedo y no sabes en qué se fue la quincena.',
          labelFuturo: 'En 6 meses, si nada cambia',
          futuro: 'El mismo susto cada quincena — con 6 meses menos de ahorro.',
        }}
      />

      {/* 4. SOLUCIÓN */}
      <Solucion
        tituloMarked="Tu plata bajo control [acento]antes del primer gasto[/acento]"
        mecanismo="el Freno de 5 Segundos"
        bigIdeaMarked="No te falta fuerza de voluntad: te falta [b]alguien que te avise a tiempo[/b]. El Freno actúa en el momento, no a fin de mes."
        pasos={[
          { titulo: 'Anota el gasto', detalle: 'Escribe o dicta lo que gastaste, en 5 segundos.' },
          { titulo: 'Tu mascota reacciona', detalle: 'Te felicita o te frena al instante, con humor.' },
          { titulo: 'Sube tu racha', detalle: 'Cada día sin pasarte del límite, tu mascota crece.' },
        ]}
        antesDespues={{
          labelAntes: 'Antes',
          antes: 'Gastos que se te escapan y descubres a fin de mes.',
          labelDespues: 'Después',
          despues: 'Cada gasto con una reacción al instante — y una racha que cuidar.',
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
        tituloMarked="Empieza gratis. Sigue por [acento]menos de $0.20 al día[/acento]"
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
            'Cancela cuando quieras',
            'Garantía de la Primera Racha: 15 días',
          ],
        }}
      />

      {/* 7. GARANTÍA */}
      <Garantia
        nombre="la Garantía de la Primera Racha"
        condicionMarked="Si en tus primeros 15 días el Freno de 5 Segundos no te ayuda a [b]sentir más control sobre tu plata[/b], te devolvemos todo. Sin preguntas."
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
        h2Marked="Imagina cerrar el mes [acento]sin sustos[/acento]"
        futurePacingMarked="Anotas un gasto, tu mascota reacciona, y por primera vez sientes que alguien más está cuidando tu plata contigo."
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        recap="Sin conectar tu banco · Cancela cuando quieras"
        psMarked="PS: CashPet convierte tus gastos hormiga en una racha que cuidas, gracias al Freno de 5 Segundos. Sin conectar tu banco, sin letra chica."
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
