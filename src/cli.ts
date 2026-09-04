#!/usr/bin/env node
import { createCase } from "./new-case.js";
import { generateProfile } from "./profile.js";
import { computeStats } from "./stats.js";
import { validateWorkspace } from "./validate.js";

function usage(): never {
  console.log(`writing-monk

Usage:
  pnpm monk new
  pnpm monk validate
  pnpm monk profile
  pnpm monk stats
`);
  process.exit(1);
}

const command = process.argv[2];

switch (command) {
  case "new": {
    const id = await createCase();
    console.log(id);
    break;
  }

  case "validate": {
    const errors = await validateWorkspace();
    if (errors.length === 0) {
      console.log("workspace is valid");
      break;
    }

    for (const error of errors) {
      console.error(`${error.file}: ${error.message}`);
    }
    process.exitCode = 1;
    break;
  }

  case "profile": {
    const version = await generateProfile();
    console.log(`generated profile version ${version}`);
    break;
  }

  case "stats": {
    console.log(JSON.stringify(await computeStats(), null, 2));
    break;
  }

  default:
    usage();
}
