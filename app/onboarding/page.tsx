export const metadata = { title: 'Onboarding — CashPet' };

export default function OnboardingPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[var(--bg)] px-6 text-center [font-family:var(--font-body)] text-[var(--text-primary)]">
      <p className="text-[var(--text-secondary)]">
        El onboarding de CashPet se construye en la próxima sesión. Esta ruta existe para que el
        botón de la landing no rompa mientras tanto.
      </p>
    </main>
  );
}
