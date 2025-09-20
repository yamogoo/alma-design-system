// Portions of this file were developed with the assistance of AI tools (ChatGPT).

import fs from "node:fs/promises";
import path from "node:path";
import yaml from "js-yaml";

export type JSONBuilderFormat = "json" | "ts" | "yaml";

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

    this.outDir = options.outDir ?? ".cache";
    this.format = options.format ?? "json";
    this.paths = options.paths;
    this.includeRootDirName = options.includeRootDirName ?? false;
    this.includeRootNames = options.includeRootNames ?? false;
    this.useTokensInSeparateFiles = options.useTokensInSeparateFiles ?? true;
    this.entryFilePath = options.entryFilePath;
  }

  private async isDir(p: string): Promise<boolean> {
    try {
      return (await fs.stat(p)).isDirectory();
    } catch {
      return false;
    }
  }

  private async readFileContent(filePath: string): Promise<any> {
    const ext = path.extname(filePath).toLowerCase();
    const raw = await fs.readFile(filePath, "utf-8");

    if (ext === ".json") return JSON.parse(raw);
    if (ext === ".yaml" || ext === ".yml") return yaml.load(raw);
    if (ext === ".ts") {
      const mod = await import(path.resolve(filePath));
      return mod.default ?? mod;
    }
    return raw;
  }

  private async buildTree(dir: string): Promise<Record<string, any>> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const result: Record<string, any> = {};

    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue;

      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        const subtree = await this.buildTree(fullPath);
        const indexFile = "index" in subtree ? subtree["index"] : null;
        result[entry.name] = indexFile ?? subtree;
      } else {
        const key = entry.name.replace(/\.[^.]+$/, "");
        result[key] = await this.readFileContent(fullPath);
      }
    }

    return result;
  }

  private deepMerge(target: any, source: any): any {
    if (Array.isArray(target) && Array.isArray(source)) return source;
    if (typeof target !== "object" || target === null) return source;
    if (typeof source !== "object" || source === null) return source;

    for (const key of Object.keys(source)) {
      target[key] =
        key in target ? this.deepMerge(target[key], source[key]) : source[key];
    }

    return target;
  }

  private async writeFile(filePath: string, data: any): Promise<void> {
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    let content: string;
    switch (this.format) {
      case "yaml":
        content = yaml.dump(data);
        break;
      case "ts":
        content = `export default ${JSON.stringify(data, null, 2)};\n`;
        break;
      default:
        content = JSON.stringify(data, null, 2);
    }

    await fs.writeFile(filePath, content, "utf-8");
  }

  private async buildEntryFile(): Promise<void> {
    if (!this.entryFilePath) return;

    const files = await fs.readdir(this.outDir);
    const jsonFiles = files.filter((f: string) => f.endsWith(".json"));

    const imports: string[] = [];
    const spreads: string[] = [];

    for (const file of jsonFiles) {
      const key = path.basename(file, ".json");
      const importPath = `./${path.relative(path.dirname(this.entryFilePath), path.join(this.outDir, file)).replace(/\\/g, "/")}`;
      imports.push(`import ${key} from "${importPath}";`);
      spreads.push(`...${key}`);
    }

    const content = `${imports.join("\n")}

const module = {
  ${spreads.join(",\n  ")}
};

export default module;
`;

    await fs.mkdir(path.dirname(this.entryFilePath), { recursive: true });
    await fs.writeFile(this.entryFilePath, content, "utf-8");
  }

  async build(): Promise<void> {
    for (const p of this.paths) {
      const absPath = path.resolve(p);
      if (!(await this.isDir(absPath))) continue;

      const subtree = await this.buildTree(absPath);

      if (this.useTokensInSeparateFiles) {
        for (const [key, value] of Object.entries(subtree)) {
          const outPath = path.join(this.outDir, `${key}.${this.format}`);
          const dataToWrite = this.includeRootNames ? { [key]: value } : value;
          await this.writeFile(outPath, dataToWrite);
        }
      } else {
        // Если includeRootDirName = true, оборачиваем subtree в имя root dir
        const rootKey = this.includeRootDirName ? path.basename(absPath) : null;
        const dataToMerge = rootKey ? { [rootKey]: subtree } : subtree;

        const outPath = path.join(this.outDir, `tokens.${this.format}`);

        let existingData: any = {};
        try {
          const raw = await fs.readFile(outPath, "utf-8");
          existingData =
            this.format === "json"
              ? JSON.parse(raw)
              : this.format === "yaml"
                ? yaml.load(raw)
                : raw;
        } catch {}

        const merged = this.deepMerge(existingData, dataToMerge);
        await this.writeFile(outPath, merged);
      }
    }

    await this.buildEntryFile();
  }
}
