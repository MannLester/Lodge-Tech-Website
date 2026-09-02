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
    "border-brand bg-brand text-white hover:border-brand-strong hover:bg-brand-strong",
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
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-5 py-2.5 text-sm font-semibold transition-colors ${variants[variant]} ${className}`}
      href={href}
    >
      <span>{children}</span>
      {showArrow ? <ArrowRight aria-hidden size={16} /> : null}
    </a>
  );
}
