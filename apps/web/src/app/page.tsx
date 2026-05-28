export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-start justify-center gap-6 px-6 py-12">
      <p className="text-sm uppercase tracking-widest text-muted">Decora · V0.1</p>
      <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
        Redesign your home with AI — built for Nigeria.
      </h1>
      <p className="text-lg text-muted">
        Photo of your room in. Photorealistic Nigerian-styled redesign out.
        Itemised in Naira. One tap to buy from local suppliers.
      </p>
      <p className="text-sm text-muted">
        This is the scaffolded landing page. The real onboarding flow is being built per{' '}
        <code className="rounded bg-surface px-1.5 py-0.5">docs/BUILD.md §9</code>.
      </p>
    </main>
  );
}
