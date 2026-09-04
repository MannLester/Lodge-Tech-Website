import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { InquiryForm } from "@/features/home/ui/inquiry-form";

function jsonResponse(body: unknown, status = 200) {
  return Promise.resolve(
    new Response(JSON.stringify(body), {
      headers: { "Content-Type": "application/json" },
      status,
    }),
  );
}

function fillValidForm() {
  fireEvent.change(screen.getByRole("textbox", { name: /Name/ }), {
    target: { value: "Morgan Lee" },
  });
  fireEvent.change(screen.getByRole("textbox", { name: /Work email/ }), {
    target: { value: "morgan@example.com" },
  });
  fireEvent.change(
    screen.getByRole("textbox", { name: /Property or company/ }),
    { target: { value: "Harbor Hotel" } },
  );
  fireEvent.change(screen.getByRole("combobox", { name: /Property type/ }), {
    target: { value: "hospitality" },
  });
  fireEvent.change(screen.getByRole("textbox", { name: /Project notes/ }), {
    target: { value: "We want to review HVAC and lighting savings." },
  });
}

describe("InquiryForm", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("validates required fields without sending a request", () => {
    render(<InquiryForm />);

    fireEvent.click(screen.getByRole("button", { name: "Submit Inquiry" }));

    expect(screen.getByText("Enter your name.")).toBeInTheDocument();
    expect(screen.getByText("Enter your email.")).toBeInTheDocument();
    expect(
      screen.getByText("Enter your property or company."),
    ).toBeInTheDocument();
    expect(screen.getByText("Select a property type.")).toBeInTheDocument();
    expect(
      screen.getByText("Tell us a little about the project."),
    ).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("disables submission while pending and prevents duplicate clicks", async () => {
    let resolveRequest: ((response: Response) => void) | undefined;
    vi.mocked(fetch).mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve;
      }),
    );
    render(<InquiryForm />);
    fillValidForm();

    const button = screen.getByRole("button", { name: "Submit Inquiry" });
    fireEvent.click(button);
    fireEvent.submit(
      screen.getByRole("form", { name: "Savings analysis inquiry" }),
    );

    expect(screen.getByRole("button", { name: "Submitting…" })).toBeDisabled();
    expect(fetch).toHaveBeenCalledTimes(1);

    resolveRequest?.(
      new Response(JSON.stringify({ ok: true }), {
        headers: { "Content-Type": "application/json" },
        status: 201,
      }),
    );
    await screen.findByText(
      "Thanks. Your savings analysis request has been submitted.",
    );
  });

  it("resets the form only after a persisted success", async () => {
    vi.mocked(fetch).mockReturnValue(jsonResponse({ ok: true }, 201));
    render(<InquiryForm />);
    fillValidForm();

    fireEvent.click(screen.getByRole("button", { name: "Submit Inquiry" }));

    await screen.findByText(
      "Thanks. Your savings analysis request has been submitted.",
    );
    expect(screen.getByRole("textbox", { name: /Name/ })).toHaveValue("");
    expect(fetch).toHaveBeenCalledWith(
      "/api/inquiries",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("shows server field errors and preserves values", async () => {
    vi.mocked(fetch).mockReturnValue(
      jsonResponse(
        {
          code: "VALIDATION_ERROR",
          fieldErrors: { email: "That email cannot be accepted." },
          ok: false,
        },
        400,
      ),
    );
    render(<InquiryForm />);
    fillValidForm();

    fireEvent.click(screen.getByRole("button", { name: "Submit Inquiry" }));

    await screen.findByText("That email cannot be accepted.");
    expect(screen.getByRole("textbox", { name: /Name/ })).toHaveValue(
      "Morgan Lee",
    );
  });

  it("preserves values after a network failure and can retry", async () => {
    vi.mocked(fetch)
      .mockRejectedValueOnce(new Error("offline"))
      .mockReturnValueOnce(jsonResponse({ ok: true }, 201));
    render(<InquiryForm />);
    fillValidForm();

    fireEvent.click(screen.getByRole("button", { name: "Submit Inquiry" }));

    await screen.findByText(
      "We couldn't submit your request. Your entries are still here; please try again.",
    );
    expect(screen.getByRole("textbox", { name: /Name/ })).toHaveValue(
      "Morgan Lee",
    );

    fireEvent.click(screen.getByRole("button", { name: "Submit Inquiry" }));
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
    await screen.findByText(
      "Thanks. Your savings analysis request has been submitted.",
    );
  });
});
