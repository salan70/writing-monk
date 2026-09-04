import fs from "node:fs/promises";
import path from "node:path";
import { ensureDir } from "./fs.js";
import { casesDir } from "./paths.js";

function stamp(): string {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  const d = String(now.getUTCDate()).padStart(2, "0");
  const hh = String(now.getUTCHours()).padStart(2, "0");
  const mm = String(now.getUTCMinutes()).padStart(2, "0");
  const ss = String(now.getUTCSeconds()).padStart(2, "0");
  return `${y}${m}${d}-${hh}${mm}${ss}`;
}

export async function createCase(): Promise<string> {
  const id = `case-${stamp()}`;
  const dir = path.join(casesDir, id);

  await ensureDir(path.join(dir, "artifacts"));
  await ensureDir(path.join(dir, "analysis"));

  const createdAt = new Date().toISOString();
  const caseYaml = `schema_version: 1
id: ${id}
created_at: ${createdAt}
status: active

task:
  type: writing
  purpose: ""
  topic: ""

generation_context:
  profile_version: 0
  applied_preferences: []

tags: []
`;

  await fs.writeFile(path.join(dir, "case.yaml"), caseYaml, "utf8");
  await fs.writeFile(path.join(dir, "events.jsonl"), "", "utf8");

  return id;
}
