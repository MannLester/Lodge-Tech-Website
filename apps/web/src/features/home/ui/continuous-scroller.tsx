import type { ReactNode } from "react";

type ContinuousScrollerProps = {
  children: ReactNode;
  className?: string;
};

export function ContinuousScroller({
  children,
  className = "",
}: ContinuousScrollerProps) {
  return (
    <div className={`continuous-scroller ${className}`}>
      <div className="continuous-scroller-track">
        <div className="continuous-scroller-group">{children}</div>
        <div aria-hidden="true" className="continuous-scroller-group" inert>
          {children}
        </div>
      </div>
    </div>
  );
}
