import Image, { type StaticImageData } from "next/image";

type MediaImageProps = {
  alt: string;
  className?: string;
  imageClassName?: string;
  sizes: string;
  src: StaticImageData;
};

export function MediaImage({
  alt,
  className = "",
  imageClassName = "object-cover",
  sizes,
  src,
}: MediaImageProps) {
  return (
    <div
      className={`border-border bg-surface-muted relative overflow-hidden rounded-lg border ${className}`}
    >
      <Image
        alt={alt}
        className={imageClassName}
        fill
        placeholder="blur"
        sizes={sizes}
        src={src}
      />
    </div>
  );
}
