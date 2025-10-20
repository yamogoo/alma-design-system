#!/usr/bin/env node
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import os from "node:os";
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

const resolveFromRoot = (relativePath) => path.resolve(projectRoot, relativePath ?? "");

const cacheDir = resolveFromRoot(tokensParserConfig.paths?.cache);
const outDir = resolveFromRoot(tokensParserConfig.paths?.out);

async function ensureCache() {
  const parser = new TokensParser(clone(tokensParserConfig));
  await parser.buildAndParse();
}

async function compareJsonFiles(sourceDir, targetDir) {
  const listJson = async (dir) =>
    (await fs.readdir(dir))
      .filter((file) => file.endsWith(".json"))
      .sort((a, b) => a.localeCompare(b, "en"));

  const sourceFiles = await listJson(sourceDir);
  const targetFiles = await listJson(targetDir);

  if (sourceFiles.length !== targetFiles.length) {
    throw new Error(
      `[tokens] verification failed: expected ${sourceFiles.length} files but found ${targetFiles.length} in verification build`,
    );
  }

  for (let i = 0; i < sourceFiles.length; i += 1) {
    const expectedFile = sourceFiles[i];
    const actualFile = targetFiles[i];

    if (expectedFile !== actualFile) {
      throw new Error(
        `[tokens] verification failed: file mismatch at position ${i}: ${expectedFile} vs ${actualFile}`,
      );
    }

    const expectedContent = await fs.readFile(path.join(sourceDir, expectedFile), "utf-8");
    const actualContent = await fs.readFile(path.join(targetDir, actualFile), "utf-8");

    if (expectedContent !== actualContent) {
      throw new Error(`[tokens] verification failed: ${expectedFile} differs from cached build output`);
    }
  }
}

async function verifyBuildWithoutResolve() {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "tokens-cache-verify-"));
  const tempBuild = path.join(tempRoot, "build");
  const tempScss = path.join(tempRoot, "scss");
  const tempEntry = path.join(tempRoot, "entry.ts");

  const verifyConfig = clone(tokensParserConfig);
  verifyConfig.paths = {
    ...verifyConfig.paths,
    src: verifyConfig.paths.cache,
    cache: verifyConfig.paths.cache,
    out: tempBuild,
    entry: tempEntry,
    scssOut: tempScss,
  };
  verifyConfig.cacheDir = verifyConfig.paths.cache;
  verifyConfig.build = tempBuild;
  verifyConfig.outDir = tempScss;
  verifyConfig.cssVarsOutDir = tempScss;

  if (verifyConfig.targets?.cssVars) {
    verifyConfig.targets.cssVars = {
      ...verifyConfig.targets.cssVars,
      enabled: false,
    };
  }
  if (verifyConfig.targets?.themes) {
    verifyConfig.targets.themes = {
      ...verifyConfig.targets.themes,
      input: `${tempBuild}/themes.json`,
      output: path.join(tempScss, "_runtime_themes.scss"),
    };
  }

  try {
    const parser = new TokensParser(verifyConfig);
    await parser.buildAndParse();
    await compareJsonFiles(outDir, tempBuild);
  } finally {
    await fs.rm(tempRoot, { recursive: true, force: true });
  }
}

async function ensureNoUnresolvedLog() {
  const logPath = path.join(cacheDir, "unresolved-tokens.log");
  try {
    const content = await fs.readFile(logPath, "utf-8");
    if (content.trim().length > 0) {
      throw new Error("[tokens] unresolved references detected. See .cache/unresolved-tokens.log");
    }
    await fs.rm(logPath, { force: true });
  } catch (error) {
    if ((error?.code ?? error?.name) === "ENOENT") return;
    throw error;
  }
}

async function main() {
  await ensureCache();
  await ensureNoUnresolvedLog();
  await verifyBuildWithoutResolve();
  console.log("[tokens] cache verified. Build matches .cache without re-resolving tokens");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
