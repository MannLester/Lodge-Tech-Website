import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { InquiryForm } from "./inquiry-form";

describe("InquiryForm", () => {
  it("validates required fields and shows a success state", () => {
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

    fireEvent.change(screen.getByRole("textbox", { name: /Name/ }), {
      target: { value: "Morgan Lee" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: /Work email/ }), {
      target: { value: "morgan@example.com" },
    });
    fireEvent.change(
      screen.getByRole("textbox", { name: /Property or company/ }),
      {
        target: { value: "Harbor Hotel" },
      },
    );
    fireEvent.change(screen.getByRole("combobox", { name: /Property type/ }), {
      target: { value: "Hospitality" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: /Project notes/ }), {
      target: { value: "We want to review HVAC and lighting savings." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Submit Inquiry" }));

    expect(
      screen.getByText(
        "Thanks. Your savings analysis request is ready for follow-up.",
      ),
    ).toBeInTheDocument();
  });
});
