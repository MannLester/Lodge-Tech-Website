type SectionHeadingProps = {
  align?: "left" | "center";
  description?: string;
  eyebrow: string;
  id?: string;
  title: string;
};

export function SectionHeading({
  align = "left",
  description,
  eyebrow,
  id,
  title,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <header
      className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}
    >
      <p className="eyebrow">{eyebrow}</p>
      <h2
        className="text-foreground mt-3 text-3xl leading-tight font-semibold sm:text-4xl"
        id={id}
      >
        {title}
      </h2>
      {description ? (
        <p className="text-muted mt-4 text-base leading-7">{description}</p>
      ) : null}
    </header>
  );
}
