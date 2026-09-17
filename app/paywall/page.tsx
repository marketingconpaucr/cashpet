export const metadata = { title: 'Tu plan — CashPet' };

export default function PaywallPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[var(--bg)] px-6 text-center [font-family:var(--font-body)] text-[var(--text-primary)]">
      <p className="text-[var(--text-secondary)]">
        La pantalla de planes de CashPet se construye a continuación, en esta misma sesión. Esta
        ruta existe para que el onboarding no rompa mientras tanto.
      </p>
    </main>
  );
}
