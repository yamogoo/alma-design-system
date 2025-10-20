#!/usr/bin/env node
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { tokensParserConfig } from "../tokens.config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
process.chdir(projectRoot);

const toAbsolute = (maybePath) =>
  path.resolve(projectRoot, maybePath ?? "");

const targets = [
  toAbsolute(tokensParserConfig.paths?.cache),
  toAbsolute(tokensParserConfig.paths?.out),
];

async function main() {
  for (const dir of targets) {
    await fs.rm(dir, { recursive: true, force: true });
  }
  console.log("[tokens] cache and output directories removed");
}

main().catch((error) => {
  console.error("[tokens] failed to clean cache", error);
  process.exitCode = 1;
});
