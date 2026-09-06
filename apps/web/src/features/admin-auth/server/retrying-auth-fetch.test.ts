import { afterEach, describe, expect, it, vi } from "vitest";

import { createRetryingAuthFetch } from "@/features/admin-auth/server/retrying-auth-fetch";

describe("createRetryingAuthFetch", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("retries thrown network failures before returning a response", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const response = new Response(null, { status: 200 });
    const fetcher = vi
      .fn<typeof fetch>()
      .mockRejectedValueOnce(new TypeError("fetch failed"))
      .mockRejectedValueOnce(new TypeError("fetch failed"))
      .mockResolvedValue(response);

    await expect(
      createRetryingAuthFetch(fetcher, [0, 0])("https://example.com"),
    ).resolves.toBe(response);
    expect(fetcher).toHaveBeenCalledTimes(3);
  });

  it("returns HTTP failures without replaying the request", async () => {
    const response = new Response(null, { status: 503 });
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(response);

    await expect(
      createRetryingAuthFetch(fetcher)("https://example.com"),
    ).resolves.toBe(response);
    expect(fetcher).toHaveBeenCalledOnce();
  });

  it("does not retry aborted requests", async () => {
    const controller = new AbortController();
    controller.abort();
    const error = new DOMException("aborted", "AbortError");
    const fetcher = vi.fn<typeof fetch>().mockRejectedValue(error);

    await expect(
      createRetryingAuthFetch(fetcher)("https://example.com", {
        signal: controller.signal,
      }),
    ).rejects.toBe(error);
    expect(fetcher).toHaveBeenCalledOnce();
  });
});
