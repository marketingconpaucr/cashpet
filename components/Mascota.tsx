// Mascota de CashPet — Gastón, el Gato (FICHA-ARTE.md): rechoncho, violeta, ojos
// grandes y redondos, tierno de cara — habla con sarcasmo (ver copy), pero se VE
// amigable (el usuario rechazó la primera versión de ojos entrecerrados: "está
// horrible, me imagino algo más amigable y lindo" — referencia mixta: proporciones
// simples tipo gato sentado + ojos enormes tipo gato de ojos grandes). Un solo
// componente reusado en toda la app para que sea siempre la MISMA cara base
// (16/FICHA-ARTE: "cambian ojos, boca y cejas, nunca el diseño base").
export function Mascota({ size = 100 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="Gastón, tu mascota financiera">
      {/* Orejas puntiagudas de gato */}
      <path d="M15 30 29 3 41 28Z" fill="var(--accent)" />
      <path d="M85 30 71 3 59 28Z" fill="var(--accent)" />
      <path d="M21 26 29 11 35 25Z" fill="color-mix(in oklab, var(--accent) 55%, white)" />
      <path d="M79 26 71 11 65 25Z" fill="color-mix(in oklab, var(--accent) 55%, white)" />
      {/* Cuerpo/cabeza rechoncho */}
      <circle cx="50" cy="58" r="40" fill="var(--accent)" />
      {/* Cola, dibujada DESPUÉS del cuerpo para que se note (antes quedaba tapada) */}
      <path
        d="M82 84c14 2 18-14 10-24-3 8 0 16-12 16Z"
        fill="var(--accent)"
      />
      {/* Cachetes/mofletes gorditos */}
      <circle cx="25" cy="70" r="9.5" fill="var(--mascota-moflete)" opacity="0.55" />
      <circle cx="75" cy="70" r="9.5" fill="var(--mascota-moflete)" opacity="0.55" />
      {/* Bigotes (con aire contra el borde del viewBox) */}
      <path d="M20 62 6 60" stroke="var(--mascota-linea)" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M19 66 5 66" stroke="var(--mascota-linea)" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M20 70 6 73" stroke="var(--mascota-linea)" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M80 62 94 60" stroke="var(--mascota-linea)" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M81 66 95 66" stroke="var(--mascota-linea)" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M80 70 94 73" stroke="var(--mascota-linea)" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      {/* Ojos grandes y redondos — la cara amigable, dominan el rostro */}
      <circle cx="34" cy="50" r="12.5" fill="var(--mascota-blanco)" />
      <circle cx="66" cy="50" r="12.5" fill="var(--mascota-blanco)" />
      <circle cx="34" cy="52.5" r="6.5" fill="var(--mascota-linea)" />
      <circle cx="66" cy="52.5" r="6.5" fill="var(--mascota-linea)" />
      <circle cx="30.5" cy="47.5" r="2.2" fill="var(--mascota-blanco)" />
      <circle cx="62.5" cy="47.5" r="2.2" fill="var(--mascota-blanco)" />
      {/* Naricita */}
      <path d="M46.5 64.5q3.5-3.5 7 0-3.5 4-7 0Z" fill="var(--mascota-moflete)" />
      {/* Boca de gato simple y contenta (simétrica, sin comisura levantada) */}
      <path
        d="M44 69q6 5 12 0"
        stroke="var(--mascota-linea)"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
