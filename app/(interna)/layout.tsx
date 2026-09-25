// Layout de la app interna (Sesión 5) — envuelve /inicio, /progreso, /perfil con el mismo
// fondo con profundidad del resto de la app. La navegación inferior la pone cada pantalla
// (necesita saber cuál tab está activo), no este layout.

export default function InternaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(600px 360px at 15% 0%, color-mix(in oklab, var(--accent) 5%, transparent) 0%, transparent 60%), ' +
            'radial-gradient(520px 420px at 100% 100%, color-mix(in oklab, var(--accent-2) 4%, transparent) 0%, transparent 55%)',
        }}
      />
      {/* Sin min-h-dvh acá: el div de afuera ya lo garantiza — un segundo min-h-dvh
          anidado en un hijo flex-1 puede sumar altura de más en navegadores móviles
          reales (la barra de direcciones que aparece/desaparece recalcula dvh de forma
          inconsistente) — defecto real reportado por el usuario: la pantalla crecía más
          de la cuenta y el menú de abajo quedaba fuera de alcance. flex-1 solo (sin su
          propio piso de altura) ya reparte el espacio disponible correctamente. */}
      <div className="relative flex flex-1 flex-col">{children}</div>
    </div>
  );
}
