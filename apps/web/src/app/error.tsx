"use client";

export default function ErrorPage({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  return (
    <main className="bg-background text-foreground grid min-h-screen place-items-center px-6 py-16">
      <div className="mx-auto max-w-md text-center">
        <p className="text-brand text-sm font-semibold tracking-[0.18em] uppercase">
          Error
        </p>
        <h1 className="mt-4 text-3xl font-semibold">Something went wrong</h1>
        <p className="text-muted mt-3 text-sm leading-6">
          {error.message ||
            "An unexpected error occurred while loading the page."}
        </p>
        <button
          className="border-brand-fill bg-brand-fill hover:border-brand-strong hover:bg-brand-strong mt-8 inline-flex min-h-11 items-center justify-center rounded-md border px-5 py-2.5 text-sm font-semibold text-white transition-colors"
          onClick={reset}
          type="button"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
