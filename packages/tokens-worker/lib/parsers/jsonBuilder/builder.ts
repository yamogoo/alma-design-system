import path from 'node:path';

import type { JSONBuilderFormat, JSONBuilderOptions } from './types.js';
import {
  isDirectory,
  readFileContent,
  shouldSkipEntry,
  buildTree,
  deepMerge,
  writeFormattedFile,
  buildEntryFile,
} from './helpers.js';

export class JSONBuilder {
  private readonly outDir: string;
  private readonly format: JSONBuilderFormat;
  private readonly paths: string[];
  private readonly includeRootDirName: boolean;
  private readonly includeRootNames: boolean;
  private readonly useTokensInSeparateFiles: boolean;
  private readonly entryFilePath?: string;

  constructor(options: JSONBuilderOptions) {
    if (!options.paths?.length) {
      throw new Error("JSONBuilder requires at least one path in 'paths'.");
    }

    this.outDir = options.outDir ?? '.cache';
    this.format = options.format ?? 'json';
    this.paths = options.paths;
    this.includeRootDirName = options.includeRootDirName ?? false;
    this.includeRootNames = options.includeRootNames ?? false;
    this.useTokensInSeparateFiles = options.useTokensInSeparateFiles ?? true;
    this.entryFilePath = options.entryFilePath;
  }

  private async buildEntryFile(): Promise<void> {
    if (!this.entryFilePath) return;
    await buildEntryFile(this.outDir, this.entryFilePath, shouldSkipEntry);
  }

  private async writeFile(filePath: string, data: any): Promise<void> {
    await writeFormattedFile(filePath, data, this.format);
  }

  private async buildTree(dir: string): Promise<Record<string, any>> {
    return buildTree(dir, { readFileContent, shouldSkipEntry });
  }

  async build(): Promise<void> {
    for (const sourcePath of this.paths) {
      const absPath = path.resolve(sourcePath);
      if (!(await isDirectory(absPath))) continue;

      const subtree = await this.buildTree(absPath);

      if (this.useTokensInSeparateFiles) {
        const entries = Object.entries(subtree).filter(([key]) => !shouldSkipEntry(key));

        await Promise.all(
          entries.map(async ([key, value]) => {
            const outPath = path.join(this.outDir, `${key}.${this.format}`);
            const dataToWrite = this.includeRootNames ? { [key]: value } : value;
            await this.writeFile(outPath, dataToWrite);
          }),
        );
      } else {
        const rootKey = this.includeRootDirName ? path.basename(absPath) : null;
        const dataToMerge = rootKey ? { [rootKey]: subtree } : subtree;
        const outPath = path.join(this.outDir, `tokens.${this.format}`);

        let existingData: any = {};
        try {
          const mergedSource = await readFileContent(outPath);
          existingData = mergedSource ?? {};
        } catch {
          // file might not exist yet
        }

        const merged = deepMerge(existingData, dataToMerge);
        await this.writeFile(outPath, merged);
      }
    }

    await this.buildEntryFile();
  }
}
