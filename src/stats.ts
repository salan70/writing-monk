import fs from "node:fs/promises";
import path from "node:path";
import YAML from "yaml";
import { casesDir } from "./paths.js";
import { listDirectories, pathExists, readJsonLines } from "./fs.js";

export type WorkspaceStats = {
  cases: number;
  acceptedCases: number;
  feedbackEvents: number;
  revisionEvents: number;
  acceptedFirstDraftRate: number | null;
  averageRevisionCount: number | null;
};

export async function computeStats(): Promise<WorkspaceStats> {
  const dirs = await listDirectories(casesDir);
  let acceptedCases = 0;
  let feedbackEvents = 0;
  let revisionEvents = 0;
  let acceptedFirstDraft = 0;
  let totalRevisions = 0;

  for (const dir of dirs) {
    const caseFile = path.join(dir, "case.yaml");
    const eventFile = path.join(dir, "events.jsonl");
    if (!(await pathExists(caseFile)) || !(await pathExists(eventFile))) continue;

    const meta = YAML.parse(await fs.readFile(caseFile, "utf8")) as { status?: string };
    const events = await readJsonLines(eventFile) as Array<{ type?: string }>;

    const revisions = events.filter((e) => e.type === "revision").length;
    const generations = events.filter((e) => e.type === "generation").length;
    const feedback = events.filter((e) => e.type === "feedback").length;

    feedbackEvents += feedback;
    revisionEvents += revisions;
    totalRevisions += revisions;

    if (meta.status === "accepted") {
      acceptedCases += 1;
      if (generations === 1 && revisions === 0) acceptedFirstDraft += 1;
    }
  }

  return {
    cases: dirs.length,
    acceptedCases,
    feedbackEvents,
    revisionEvents,
    acceptedFirstDraftRate:
      acceptedCases === 0 ? null : acceptedFirstDraft / acceptedCases,
    averageRevisionCount:
      dirs.length === 0 ? null : totalRevisions / dirs.length,
  };
}
