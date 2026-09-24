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
      <div className="relative flex min-h-dvh flex-1 flex-col">{children}</div>
    </div>
  );
}
