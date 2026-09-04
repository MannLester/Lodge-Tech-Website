import { readdir, readFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { cwd } from "node:process";
import { describe, expect, it } from "vitest";

const featuresDirectory = join(cwd(), "apps/web/src/features");
const appDirectory = join(cwd(), "apps/web/src/app");

async function filesUnder(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? filesUnder(path) : [path];
    }),
  );
  return files.flat().filter((path) => /\.[cm]?[jt]sx?$/.test(path));
}

async function importsIn(path: string) {
  const source = await readFile(path, "utf8");
  return [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
}

describe("feature architecture", () => {
  it("gives every feature a public index", async () => {
    const entries = await readdir(featuresDirectory, { withFileTypes: true });
    const featureDirectories = entries.filter((entry) => entry.isDirectory());

    for (const feature of featureDirectories) {
      await expect(
        readFile(join(featuresDirectory, feature.name, "index.ts"), "utf8"),
      ).resolves.toBeDefined();
    }
  });

  it("keeps app routes on feature public APIs", async () => {
    const appFiles = await filesUnder(appDirectory);
    const deepImports: string[] = [];

    for (const file of appFiles) {
      for (const specifier of await importsIn(file)) {
        if (/^@\/features\/[^/]+\//.test(specifier)) {
          deepImports.push(`${relative(process.cwd(), file)} -> ${specifier}`);
        }
      }
    }

    expect(deepImports).toEqual([]);
  });

  it("keeps cross-feature imports on public APIs", async () => {
    const featureFiles = await filesUnder(featuresDirectory);
    const deepImports: string[] = [];

    for (const file of featureFiles) {
      const feature = relative(featuresDirectory, file).split(sep)[0];
      for (const specifier of await importsIn(file)) {
        const match = specifier.match(/^@\/features\/([^/]+)(\/.*)?$/);
        if (match && match[1] !== feature && match[2]) {
          deepImports.push(`${relative(process.cwd(), file)} -> ${specifier}`);
        }
      }
    }

    expect(deepImports).toEqual([]);
  });
});
