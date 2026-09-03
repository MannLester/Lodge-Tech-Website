import { ImageIcon } from "lucide-react";

type MediaPlaceholderProps = {
  className?: string;
  label: string;
};

export function MediaPlaceholder({
  className = "",
  label,
}: MediaPlaceholderProps) {
  return (
    <div
      aria-label={`${label} placeholder`}
      className={`border-border bg-surface-muted text-muted relative grid min-h-40 place-items-center overflow-hidden rounded-lg border ${className}`}
      role="img"
    >
      <div className="grid justify-items-center gap-3 px-5 text-center">
        <ImageIcon aria-hidden className="text-brand" size={34} />
        <span className="max-w-48 text-xs font-semibold uppercase">
          {label}
        </span>
      </div>
    </div>
  );
}
