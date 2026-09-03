import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: "primary" | "outline" | "text";
};

const variants = {
  primary:
    "border-brand-fill bg-brand-fill text-white hover:border-brand-strong hover:bg-brand-strong",
  outline:
    "border-border bg-surface text-foreground hover:border-brand hover:text-brand-strong",
  text: "border-transparent bg-transparent text-foreground hover:text-brand-strong",
} as const;

export function Button({
  asChild = false,
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : "button";

  return (
    <Component
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-5 py-2.5 text-sm font-semibold transition-colors ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
