// Mascota de CashPet — el personaje de FICHA-ARTE.md (orejitas, mofletes, brote que crece
// con el nivel). Un solo componente reusado en toda la app para que sea siempre la MISMA cara
// base (16/FICHA-ARTE: "cambian ojos, boca y cejas, nunca el diseño base").
export function Mascota({ size = 100 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="Tu mascota financiera">
      <circle cx="26" cy="24" r="11" fill="var(--accent)" />
      <circle cx="74" cy="24" r="11" fill="var(--accent)" />
      <circle cx="26" cy="24" r="5.5" fill="color-mix(in oklab, var(--accent) 55%, white)" />
      <circle cx="74" cy="24" r="5.5" fill="color-mix(in oklab, var(--accent) 55%, white)" />
      <path d="M50 6c-5 1-7 6-4 11 5-1 8-6 4-11Z" fill="var(--mascota-brote-1)" />
      <path d="M50 6c5 1 7 6 4 11-5-1-8-6-4-11Z" fill="var(--mascota-brote-2)" />
      <circle cx="50" cy="56" r="38" fill="var(--accent)" />
      <circle cx="24" cy="64" r="6.5" fill="var(--mascota-moflete)" opacity="0.55" />
      <circle cx="76" cy="64" r="6.5" fill="var(--mascota-moflete)" opacity="0.55" />
      <ellipse cx="36" cy="52" rx="8.5" ry="10.5" fill="var(--mascota-blanco)" />
      <ellipse cx="64" cy="52" rx="8.5" ry="10.5" fill="var(--mascota-blanco)" />
      <circle cx="37.5" cy="55.5" r="5" fill="var(--mascota-linea)" />
      <circle cx="65.5" cy="55.5" r="5" fill="var(--mascota-linea)" />
      <circle cx="35.5" cy="50.5" r="1.8" fill="var(--mascota-blanco)" />
      <circle cx="63.5" cy="50.5" r="1.8" fill="var(--mascota-blanco)" />
      <path d="M40 68q10 8 20 0" stroke="var(--mascota-linea)" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}
