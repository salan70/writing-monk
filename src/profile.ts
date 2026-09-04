import fs from "node:fs/promises";
import path from "node:path";
import YAML from "yaml";
import { ensureDir, listDirectories } from "./fs.js";
import { preferencesDir, profileDir } from "./paths.js";

type Preference = {
  id: string;
  statement: string;
  status: string;
  confidence: number;
  scope: string[];
};

export async function generateProfile(): Promise<number> {
  const preferences: Preference[] = [];

  for (const scopeDir of await listDirectories(preferencesDir)) {
    const entries = await fs.readdir(scopeDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.endsWith(".yaml")) continue;
      const parsed = YAML.parse(
        await fs.readFile(path.join(scopeDir, entry.name), "utf8"),
      ) as Preference;
      if (parsed.status === "accepted") preferences.push(parsed);
    }
  }

  await ensureDir(profileDir);

  const versionFile = path.join(profileDir, "version.txt");
  let previous = 0;
  try {
    previous = Number((await fs.readFile(versionFile, "utf8")).trim()) || 0;
  } catch {
    previous = 0;
  }

  const version = previous + 1;
  const groups = new Map<string, Preference[]>();

  for (const preference of preferences) {
    for (const scope of preference.scope) {
      const items = groups.get(scope) ?? [];
      items.push(preference);
      groups.set(scope, items);
    }
  }

  let md = `# Writing Profile\n\nProfile version: ${version}\n\n`;
  for (const [scope, items] of [...groups.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    md += `## ${scope}\n\n`;
    for (const item of items.sort((a, b) => b.confidence - a.confidence)) {
      md += `- ${item.statement} (${item.id}, confidence ${item.confidence.toFixed(2)})\n`;
    }
    md += "\n";
  }

  const machine = {
    profile_version: version,
    generated_at: new Date().toISOString(),
    preferences: preferences
      .sort((a, b) => b.confidence - a.confidence)
      .map(({ id, statement, confidence, scope }) => ({
        id,
        statement,
        confidence,
        scope,
      })),
  };

  await fs.writeFile(path.join(profileDir, "writing-profile.md"), md, "utf8");
  await fs.writeFile(
    path.join(profileDir, "writing-profile.json"),
    JSON.stringify(machine, null, 2) + "\n",
    "utf8",
  );
  await fs.writeFile(versionFile, `${version}\n`, "utf8");

  return version;
}
