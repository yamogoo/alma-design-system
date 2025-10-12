// Portions of this file were developed with the assistance of AI tools.

import fs from 'node:fs/promises';
import path from 'node:path';
import yaml from 'js-yaml';

export type JSONBuilderFormat = 'json' | 'ts' | 'yaml';

export interface JSONBuilderOptions {
  outDir?: string;
  format?: JSONBuilderFormat;
  paths: string[];
  includeRootDirName?: boolean;
  includeRootNames?: boolean;
  useTokensInSeparateFiles?: boolean;
  entryFilePath?: string;
}

export class JSONBuilder {
  private outDir: string;
  private format: JSONBuilderFormat;
  private paths: string[];
  private includeRootDirName: boolean;
  private includeRootNames: boolean;
  private useTokensInSeparateFiles: boolean;
  private entryFilePath?: string;

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

  /* ------------------------ FS helpers ------------------------ */

  private async isDir(p: string): Promise<boolean> {
    try {
      return (await fs.stat(p)).isDirectory();
    } catch {
      return false;
    }
  }

  /** Read and parse file content by extension */
  private async readFileContent(filePath: string): Promise<any> {
    const ext = path.extname(filePath).toLowerCase();
    const raw = await fs.readFile(filePath, 'utf-8');

    if (ext === '.json') return JSON.parse(raw);
    if (ext === '.yaml' || ext === '.yml') return yaml.load(raw);
    if (ext === '.ts') {
      // ESM dynamic import; expects a default export or module object
      const mod = await import(path.resolve(filePath));
      return (mod as any).default ?? mod;
    }
    return raw;
  }

  /** Should this entry be skipped (dotfiles & underscore-prefixed)? */
  private shouldSkipEntry(name: string): boolean {
    // Skip: hidden (.xxx) and underscore-prefixed (_xxx)
    return name.startsWith('.') || name.startsWith('_');
  }

  /** Build nested object tree from directory contents */
  private async buildTree(dir: string): Promise<Record<string, any>> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const result: Record<string, any> = {};

    for (const entry of entries) {
      if (this.shouldSkipEntry(entry.name)) continue;

      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        const subtree = await this.buildTree(fullPath);
        // Prefer "index" file content if present, otherwise keep the subtree
        const indexLike =
          typeof subtree === 'object' && subtree !== null && 'index' in subtree
            ? (subtree as any)['index']
            : null;
        result[entry.name] = indexLike ?? subtree;
      } else {
        const key = entry.name.replace(/\.[^.]+$/, '');
        // Skip underscore-prefixed files at file-level too (double safety)
        if (this.shouldSkipEntry(key)) continue;

        result[key] = await this.readFileContent(fullPath);
      }
    }

    return result;
  }

  /* ------------------------ Data helpers ------------------------ */

  /** Deep merge: objects are merged, arrays & primitives are overwritten by source */
  private deepMerge(target: any, source: any): any {
    if (Array.isArray(target) && Array.isArray(source)) return source;
    if (typeof target !== 'object' || target === null) return source;
    if (typeof source !== 'object' || source === null) return source;

    for (const key of Object.keys(source)) {
      target[key] = key in target ? this.deepMerge(target[key], source[key]) : source[key];
    }
    return target;
  }

  /** Write file in the selected output format */
  private async writeFile(filePath: string, data: any): Promise<void> {
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    let content: string;
    switch (this.format) {
      case 'yaml':
        content = yaml.dump(data);
        break;
      case 'ts':
        content = `export default ${JSON.stringify(data, null, 2)};\n`;
        break;
      default:
        content = JSON.stringify(data, null, 2);
    }

    await fs.writeFile(filePath, content, 'utf-8');
  }

  /** Build an index/entry file that re-exports all built JSON artifacts */
  private async buildEntryFile(): Promise<void> {
    if (!this.entryFilePath) return;

    const files = await fs.readdir(this.outDir);
    // Only JSON artifacts and skip underscore-prefixed outputs
    const jsonFiles = files
      .filter((f) => f.endsWith('.json') && !this.shouldSkipEntry(f))
      .sort((a, b) => a.localeCompare(b, 'en'));

    const imports: string[] = [];
    const spreads: string[] = [];

    for (const file of jsonFiles) {
      const key = path.basename(file, '.json');
      const importPath = `./${path
        .relative(path.dirname(this.entryFilePath), path.join(this.outDir, file))
        .replace(/\\/g, '/')}`;
      imports.push(`import ${key} from "${importPath}";`);
      spreads.push(`...${key}`);
    }

    const content = `${imports.join('\n')}

const module = {
  ${spreads.join(',\n  ')}
};

export default module;
`;

    await fs.mkdir(path.dirname(this.entryFilePath), { recursive: true });
    await fs.writeFile(this.entryFilePath, content, 'utf-8');
  }

  /* ------------------------ Public build ------------------------ */

  async build(): Promise<void> {
    // Walk through all provided paths
    for (const p of this.paths) {
      const absPath = path.resolve(p);
      if (!(await this.isDir(absPath))) continue;

      const subtree = await this.buildTree(absPath);

      if (this.useTokensInSeparateFiles) {
        // Write each top-level key to its own file (in parallel), skipping underscores
        const entries = Object.entries(subtree).filter(([key]) => !this.shouldSkipEntry(key));

        await Promise.all(
          entries.map(async ([key, value]) => {
            const outPath = path.join(this.outDir, `${key}.${this.format}`);
            const dataToWrite = this.includeRootNames ? { [key]: value } : value;
            await this.writeFile(outPath, dataToWrite);
          }),
        );
      } else {
        // Merge into a single file
        const rootKey = this.includeRootDirName ? path.basename(absPath) : null;
        const dataToMerge = rootKey ? { [rootKey]: subtree } : subtree;

        const outPath = path.join(this.outDir, `tokens.${this.format}`);

        let existingData: any = {};
        try {
          const raw = await fs.readFile(outPath, 'utf-8');
          existingData =
            this.format === 'json'
              ? JSON.parse(raw)
              : this.format === 'yaml'
                ? yaml.load(raw)
                : raw;
        } catch {
          // It's fine if the file doesn't exist yet
        }

        const merged = this.deepMerge(existingData, dataToMerge);
        await this.writeFile(outPath, merged);
      }
    }

    await this.buildEntryFile();
  }
}
