import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

type ButtonLinkProps = {
  children: ReactNode;
  className?: string;
  href: string;
  showArrow?: boolean;
  variant?: "primary" | "outline" | "text";
};

const variants = {
  primary:
    "border-brand-fill bg-brand-fill text-white shadow-[0_0_0_5px_var(--surface-muted)] hover:brightness-90",
  outline:
    "border-border bg-surface text-foreground hover:border-brand hover:text-brand-strong",
  text: "border-transparent bg-transparent text-foreground hover:text-brand-strong",
} as const;

export function ButtonLink({
  children,
  className = "",
  href,
  showArrow = false,
  variant = "primary",
}: ButtonLinkProps) {
  return (
    <a
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-5 py-3 text-center text-sm font-semibold transition-colors ${variants[variant]} ${className}`}
      href={href}
    >
      <span>{children}</span>
      {showArrow ? <ArrowRight aria-hidden size={16} /> : null}
    </a>
  );
}
