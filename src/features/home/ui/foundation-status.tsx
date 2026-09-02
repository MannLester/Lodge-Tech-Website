import { siteConfig } from "@/shared/config/site";

export function FoundationStatus() {
  return (
    <div className="max-w-2xl text-center">
      <p className="text-sm font-semibold uppercase">{siteConfig.name}</p>
      <h1 className="mt-4 text-4xl font-semibold sm:text-6xl">
        Project foundation is ready.
      </h1>
    </div>
  );
}
