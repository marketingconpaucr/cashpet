// Mascota de CashPet — Gastón, el Gato (FICHA-ARTE.md): rechoncho, violeta, ojos
// grandes y redondos, tierno de cara — habla con sarcasmo (ver copy), pero se VE
// amigable (el usuario rechazó la primera versión de ojos entrecerrados: "está
// horrible, me imagino algo más amigable y lindo" — referencia mixta: proporciones
// simples tipo gato sentado + ojos enormes tipo gato de ojos grandes). Un solo
// componente reusado en toda la app para que sea siempre la MISMA cara base
// (16/FICHA-ARTE: "cambian ojos, boca y cejas, nunca el diseño base") — las 5
// emociones (docs/revisiones/estados-mascota.html) cambian SOLO ojos/boca/cejas.
export type EmocionMascota = 'celebrando' | 'feliz' | 'neutral' | 'desconfiada' | 'decepcionada';

function CaraCelebrando() {
  return (
    <>
      <path d="M28 50q8-10 16 0" stroke="var(--mascota-linea)" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M56 50q8-10 16 0" stroke="var(--mascota-linea)" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M36 64q14 14 28 0" stroke="var(--mascota-linea)" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <circle cx="14" cy="20" r="2" fill="var(--mascota-brillo)" />
      <circle cx="86" cy="20" r="2" fill="var(--mascota-brillo)" />
      <circle cx="50" cy="94" r="2" fill="var(--mascota-brillo)" />
    </>
  );
}

function CaraFeliz() {
  return (
    <>
      <circle cx="34" cy="50" r="12.5" fill="var(--mascota-blanco)" />
      <circle cx="66" cy="50" r="12.5" fill="var(--mascota-blanco)" />
      <circle cx="34" cy="52.5" r="6.5" fill="var(--mascota-linea)" />
      <circle cx="66" cy="52.5" r="6.5" fill="var(--mascota-linea)" />
      <circle cx="30.5" cy="47.5" r="2.2" fill="var(--mascota-blanco)" />
      <circle cx="62.5" cy="47.5" r="2.2" fill="var(--mascota-blanco)" />
      <path d="M46.5 64.5q3.5-3.5 7 0-3.5 4-7 0Z" fill="var(--mascota-moflete)" />
      <path d="M44 69q6 5 12 0" stroke="var(--mascota-linea)" strokeWidth="2.4" strokeLinecap="round" fill="none" />
    </>
  );
}

function CaraNeutral() {
  return (
    <>
      <circle cx="34" cy="50" r="12.5" fill="var(--mascota-blanco)" />
      <circle cx="66" cy="50" r="12.5" fill="var(--mascota-blanco)" />
      <circle cx="34" cy="52.5" r="6.5" fill="var(--mascota-linea)" />
      <circle cx="66" cy="52.5" r="6.5" fill="var(--mascota-linea)" />
      <path d="M46.5 64.5q3.5-3.5 7 0-3.5 4-7 0Z" fill="var(--mascota-moflete)" />
      <path d="M42 69 58 69" stroke="var(--mascota-linea)" strokeWidth="3" strokeLinecap="round" fill="none" />
    </>
  );
}

function CaraDesconfiada() {
  return (
    <>
      <circle cx="34" cy="50" r="12.5" fill="var(--mascota-blanco)" />
      <circle cx="34" cy="52.5" r="6.5" fill="var(--mascota-linea)" />
      <circle cx="30.5" cy="47.5" r="2.2" fill="var(--mascota-blanco)" />
      <ellipse cx="66" cy="52" rx="9" ry="6" fill="var(--mascota-blanco)" />
      <circle cx="66" cy="53.5" r="5" fill="var(--mascota-linea)" />
      <path d="M58 41 74 39" stroke="var(--mascota-linea)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M46.5 64.5q3.5-3.5 7 0-3.5 4-7 0Z" fill="var(--mascota-moflete)" />
      <path d="M45 70q7-3 14 0" stroke="var(--mascota-linea)" strokeWidth="2.4" strokeLinecap="round" fill="none" />
    </>
  );
}

function CaraDecepcionada() {
  return (
    <>
      <circle cx="34" cy="52" r="11" fill="var(--mascota-blanco)" />
      <circle cx="66" cy="52" r="11" fill="var(--mascota-blanco)" />
      <circle cx="34" cy="55" r="5.5" fill="var(--mascota-linea)" />
      <circle cx="66" cy="55" r="5.5" fill="var(--mascota-linea)" />
      {/* párpado caído: nada de lágrimas, un gato decepcionado no llora, juzga */}
      <path d="M22 47q12-7 24 0Z" fill="var(--accent)" />
      <path d="M54 47q12-7 24 0Z" fill="var(--accent)" />
      <path d="M46.5 66.5q3.5-3.5 7 0-3.5 4-7 0Z" fill="var(--mascota-moflete)" />
      <path d="M40 74q10-6 20 0" stroke="var(--mascota-linea)" strokeWidth="3.2" strokeLinecap="round" fill="none" />
    </>
  );
}

const CARAS: Record<EmocionMascota, () => React.JSX.Element> = {
  celebrando: CaraCelebrando,
  feliz: CaraFeliz,
  neutral: CaraNeutral,
  desconfiada: CaraDesconfiada,
  decepcionada: CaraDecepcionada,
};

export function Mascota({ size = 100, emocion = 'feliz' }: { size?: number; emocion?: EmocionMascota }) {
  const Cara = CARAS[emocion];
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="Gastón, tu mascota financiera">
      {/* Orejas puntiagudas de gato */}
      <path d="M15 30 29 3 41 28Z" fill="var(--accent)" />
      <path d="M85 30 71 3 59 28Z" fill="var(--accent)" />
      <path d="M21 26 29 11 35 25Z" fill="color-mix(in oklab, var(--accent) 55%, white)" />
      <path d="M79 26 71 11 65 25Z" fill="color-mix(in oklab, var(--accent) 55%, white)" />
      {/* Cuerpo/cabeza rechoncho */}
      <circle cx="50" cy="58" r="40" fill="var(--accent)" />
      {/* Cola, dibujada DESPUÉS del cuerpo para que se note */}
      <path d="M82 84c14 2 18-14 10-24-3 8 0 16-12 16Z" fill="var(--accent)" />
      {/* Cachetes/mofletes gorditos */}
      <circle cx="25" cy="72" r="9.5" fill="var(--mascota-moflete)" opacity="0.55" />
      <circle cx="75" cy="72" r="9.5" fill="var(--mascota-moflete)" opacity="0.55" />
      {/* Bigotes (con aire contra el borde del viewBox) */}
      <path d="M20 62 6 60" stroke="var(--mascota-linea)" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M19 66 5 66" stroke="var(--mascota-linea)" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M20 70 6 73" stroke="var(--mascota-linea)" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M80 62 94 60" stroke="var(--mascota-linea)" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M81 66 95 66" stroke="var(--mascota-linea)" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M80 70 94 73" stroke="var(--mascota-linea)" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      {/* Cara: SOLO esto cambia entre emociones */}
      <Cara />
    </svg>
  );
}
