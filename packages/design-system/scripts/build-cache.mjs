#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import path from "node:path";

import { TokensParser } from "@alma/tokens-worker";

import { tokensParserConfig } from "../tokens.config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
process.chdir(projectRoot);

const clone = (value) =>
  typeof structuredClone === "function"
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value));

async function main() {
  const parser = new TokensParser(clone(tokensParserConfig));
  await parser.buildAndParse();
  console.log("[tokens] cache rebuilt from src");
}

main().catch((error) => {
  console.error("[tokens] failed to rebuild cache", error);
  process.exitCode = 1;
});
