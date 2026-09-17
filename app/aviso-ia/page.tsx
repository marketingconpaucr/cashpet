export const metadata = { title: 'Aviso de IA — CashPet' };

export default function AvisoIaPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 [font-family:var(--font-body)] text-[var(--text-primary)]">
      <h1 className="text-2xl font-bold [font-family:var(--font-display)]">Aviso sobre el uso de IA</h1>
      <p className="mt-4 text-[var(--text-secondary)]">
        Las reacciones de tu mascota las genera un modelo de inteligencia artificial (Claude Haiku
        4.5, de Anthropic) a partir de los gastos que anotas. No es asesoría financiera. El detalle
        completo de esta página se termina de redactar en la Sesión 6 del proceso de construcción.
      </p>
    </main>
  );
}
