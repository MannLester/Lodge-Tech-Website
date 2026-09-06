const DEFAULT_RETRY_DELAYS_MS = [150, 450] as const;

function isAbortedRequest(
  error: unknown,
  signal?: AbortSignal | null,
): boolean {
  return (
    signal?.aborted === true ||
    (error instanceof Error && error.name === "AbortError")
  );
}

export function createRetryingAuthFetch(
  fetcher: typeof fetch = globalThis.fetch,
  retryDelaysMs: readonly number[] = DEFAULT_RETRY_DELAYS_MS,
): typeof fetch {
  return async (input, init) => {
    for (let attempt = 0; ; attempt += 1) {
      try {
        return await fetcher(input, init);
      } catch (error) {
        const delayMs = retryDelaysMs[attempt];

        if (delayMs === undefined || isAbortedRequest(error, init?.signal)) {
          throw error;
        }

        console.warn("Retrying Supabase Auth network request", {
          attempt: attempt + 1,
          delayMs,
          errorName: error instanceof Error ? error.name : "UnknownError",
        });
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  };
}
