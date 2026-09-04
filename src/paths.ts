import path from "node:path";

export const repoRoot = process.cwd();
export const workspaceDir = path.join(repoRoot, "workspace");
export const casesDir = path.join(workspaceDir, "cases");
export const preferencesDir = path.join(workspaceDir, "preferences");
export const profileDir = path.join(workspaceDir, "profile");
export const reportsDir = path.join(workspaceDir, "reports");
