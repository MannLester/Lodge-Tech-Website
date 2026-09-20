import Image, { type StaticImageData } from "next/image";

type ProductVisualProps = {
  alt: string;
  image: StaticImageData;
  photo?: boolean;
};

export function ProductVisual({
  alt,
  image,
  photo = false,
}: ProductVisualProps) {
  return (
    <div
      className={`border-border bg-surface-muted relative overflow-hidden rounded-xl border ${photo ? "aspect-[4/3]" : "aspect-[6/5]"}`}
    >
      <Image
        alt={alt}
        className={
          photo ? "object-cover object-left" : "object-contain p-8 sm:p-12"
        }
        fill
        loading="eager"
        sizes="(max-width: 1023px) 92vw, 38vw"
        src={image}
      />
      {!photo && (
        <span className="bg-surface/90 text-muted absolute top-3 left-3 rounded px-3 py-1.5 text-xs font-semibold">
          Concept visual
        </span>
      )}
    </div>
  );
}
