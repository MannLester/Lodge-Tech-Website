export default function NotFoundPage() {
  return (
    <main className="bg-background text-foreground grid min-h-screen place-items-center px-6 py-16">
      <div className="mx-auto max-w-md text-center">
        <p className="text-brand text-sm font-semibold tracking-[0.18em] uppercase">
          404
        </p>
        <h1 className="mt-4 text-3xl font-semibold">Page not found</h1>
        <p className="text-muted mt-3 text-sm leading-6">
          The page you’re looking for does not exist or has moved.
        </p>
        <a
          className="border-brand-fill bg-brand-fill hover:border-brand-strong hover:bg-brand-strong mt-8 inline-flex min-h-11 items-center justify-center rounded-md border px-5 py-2.5 text-sm font-semibold text-white transition-colors"
          href="/"
        >
          Return home
        </a>
      </div>
    </main>
  );
}
