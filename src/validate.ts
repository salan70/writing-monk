import fs from "node:fs/promises";
import path from "node:path";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import YAML from "yaml";
import { casesDir, preferencesDir, repoRoot } from "./paths.js";
import { listDirectories, pathExists, readJsonLines } from "./fs.js";

type ValidationError = {
  file: string;
  message: string;
};

async function loadSchema(name: string): Promise<Record<string, unknown>> {
  const file = path.join(repoRoot, "schemas", name);
  return JSON.parse(await fs.readFile(file, "utf8"));
}

export async function validateWorkspace(): Promise<ValidationError[]> {
  const errors: ValidationError[] = [];

  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);

  const caseSchema = await loadSchema("case.schema.json");
  const eventSchema = await loadSchema("event.schema.json");
  const preferenceSchema = await loadSchema("preference.schema.json");

  const validateCase = ajv.compile(caseSchema);
  const validateEvent = ajv.compile(eventSchema);
  const validatePreference = ajv.compile(preferenceSchema);

  for (const caseDir of await listDirectories(casesDir)) {
    const caseFile = path.join(caseDir, "case.yaml");
    const eventFile = path.join(caseDir, "events.jsonl");

    if (!(await pathExists(caseFile))) {
      errors.push({ file: caseFile, message: "missing case.yaml" });
      continue;
    }

    const parsed = YAML.parse(await fs.readFile(caseFile, "utf8"));
    if (!validateCase(parsed)) {
      errors.push({
        file: caseFile,
        message: ajv.errorsText(validateCase.errors),
      });
    }

    if (!(await pathExists(eventFile))) {
      errors.push({ file: eventFile, message: "missing events.jsonl" });
      continue;
    }

    const events = await readJsonLines(eventFile);
    const ids = new Set<string>();

    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      if (!validateEvent(event)) {
        errors.push({
          file: `${eventFile}:${i + 1}`,
          message: ajv.errorsText(validateEvent.errors),
        });
        continue;
      }

      const id = (event as { id: string }).id;
      if (ids.has(id)) {
        errors.push({
          file: `${eventFile}:${i + 1}`,
          message: `duplicate event id: ${id}`,
        });
      }
      ids.add(id);
    }
  }

  for (const scopeDir of await listDirectories(preferencesDir)) {
    const entries = await fs.readdir(scopeDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.endsWith(".yaml")) continue;
      const file = path.join(scopeDir, entry.name);
      const parsed = YAML.parse(await fs.readFile(file, "utf8"));
      if (!validatePreference(parsed)) {
        errors.push({
          file,
          message: ajv.errorsText(validatePreference.errors),
        });
      }
    }
  }

  return errors;
}
