// This file were developed with the assistance of AI tools.

import fs from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import nodePath from 'node:path';

import * as _ from 'lodash-es';

import type { JSONToSCSSOptions, ParseValueOptions, TokensParserOptions } from '../types.js';
import { SCSSParser } from '../emit/scss.js';
import { TokenResolver } from '../core/resolver.js';
import { ColorToolkit } from '../core/color.js';

interface FileManagerConfig {
  opts: TokensParserOptions;
  defaultParseOptions: ParseValueOptions;
  defaultMapOptions: ParseValueOptions;
  resolver: TokenResolver;
  scssParser: SCSSParser;
  colors: ColorToolkit;
  fileCache: Record<string, any>;
  toKebabCase(value: string): string;
  verbose: boolean;
}

type ResolveIssue = {
  reference: string;
  fromFile: string;
  reason: string;
  trace?: string;
};

type WalkParams = {
  sourceDir: string;
  cacheDir: string;
  issues: ResolveIssue[];
  relativeDir?: string;
};

type ResolveJsonOptions = {
  absolutePath: string;
  relativePath: string;
};

type ResolveResult = {
  data: any;
  issues: ResolveIssue[];
};

const isJsonFile = (name: string): boolean => name.endsWith('.json') && !name.startsWith('.');

const sortDirents = <T extends { name: string }>(entries: T[]): T[] =>
  entries.sort((a, b) => a.name.localeCompare(b.name, 'en'));

const toPosix = (value: string): string => value.split(nodePath.sep).join('/');

export class TokenFileManager {
  private readonly opts: TokensParserOptions;
  private readonly defaultParseOptions: ParseValueOptions;
  private readonly defaultMapOptions: ParseValueOptions;
  private readonly resolver: TokenResolver;
  private readonly scssParser: SCSSParser;
  private readonly colors: ColorToolkit;
  private readonly fileCache: Record<string, any>;
  private readonly toKebabCaseFn: (value: string) => string;
  private readonly verbose: boolean;
  private readonly unresolvedLogFile = 'unresolved-tokens.log';

  constructor(config: FileManagerConfig) {
    this.opts = config.opts;
    this.defaultParseOptions = config.defaultParseOptions;
    this.defaultMapOptions = config.defaultMapOptions;
    this.resolver = config.resolver;
    this.scssParser = config.scssParser;
    this.colors = config.colors;
    this.fileCache = config.fileCache;
    this.toKebabCaseFn = config.toKebabCase;
    this.verbose = config.verbose;
  }

  private async resetDir(dir?: string) {
    if (!dir) return;
    await fs.rm(dir, { recursive: true, force: true });
    await fs.mkdir(dir, { recursive: true });
  }

  async ensureDirExists(dir?: string) {
    if (!dir) return;
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch {
      /* no-op */
    }
  }

  async writeCSSFile(filePath: string, cssContent: string) {
    await fs.mkdir(nodePath.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, cssContent, 'utf-8');
  }

  async buildArtifacts(options: {
    sourceDir: string;
    cacheDir: string;
    buildDir?: string;
    scssDir?: string;
  }): Promise<{ issues: ResolveIssue[] }> {
    const { sourceDir, cacheDir, buildDir, scssDir } = options;

    const issues: ResolveIssue[] = [];

    if (!sourceDir || !cacheDir) {
      return { issues };
    }

    Object.keys(this.fileCache).forEach((key) => delete this.fileCache[key]);

    await this.resetDir(cacheDir);
    if (buildDir) await this.resetDir(buildDir);

    await this.walkSourceDirectory({ sourceDir, cacheDir, issues });

    await this.writeResolveLog(cacheDir, issues);

    if (buildDir) {
      await this.emitBuildArtifacts({ cacheDir, buildDir, scssDir });
    }

    return { issues };
  }

  private async walkSourceDirectory({ sourceDir, cacheDir, issues, relativeDir }: WalkParams) {
    const absSourceDir = relativeDir
      ? nodePath.join(sourceDir, relativeDir)
      : sourceDir;

    let entries = await fs.readdir(absSourceDir, { withFileTypes: true });
    entries = sortDirents(entries).filter((entry) => !entry.name.startsWith('.'));

    for (const entry of entries) {
      const relPath = relativeDir ? nodePath.join(relativeDir, entry.name) : entry.name;
      const absPath = nodePath.join(absSourceDir, entry.name);

      if (entry.isDirectory()) {
        await fs.mkdir(nodePath.join(cacheDir, relPath), { recursive: true });
        await this.walkSourceDirectory({
          sourceDir,
          cacheDir,
          issues,
          relativeDir: relPath,
        });
        continue;
      }

      if (!entry.isFile() || !isJsonFile(entry.name)) continue;

      try {
        const result = await this.resolveJsonFile({
          absolutePath: absPath,
          relativePath: toPosix(relPath),
        });

        if (result.issues.length > 0) {
          issues.push(...result.issues);
          continue;
        }

        const targetPath = nodePath.join(cacheDir, relPath);
        await fs.mkdir(nodePath.dirname(targetPath), { recursive: true });
        await fs.writeFile(targetPath, JSON.stringify(result.data, null, 2), 'utf-8');
      } catch (err) {
        if (this.verbose) console.error('Failed to resolve token file', relPath, err);
        issues.push({
          reference: '<file>',
          fromFile: toPosix(relPath),
          reason: 'JSON parse error',
        });
      }
    }
  }

  private async resolveJsonFile(options: ResolveJsonOptions): Promise<ResolveResult> {
    const { absolutePath, relativePath } = options;
    const issues: ResolveIssue[] = [];
    const issueSet = new Set<string>();

    const raw = await fs.readFile(absolutePath, 'utf-8');
    const json = JSON.parse(raw);

    const parseOptions: ParseValueOptions = {
      ...this.defaultParseOptions,
      fileName: relativePath.replace(/\.json$/i, ''),
    };

    const resolveRecursive = (
      value: any,
      opts: ParseValueOptions,
      pathStack: string[] = [],
      depth = 0,
    ): any => {
      if (depth > 100) return value;

      if (_.isString(value)) {
        let parsed = this.resolver.parseNestedValue(value, opts);

        if (!_.isString(parsed)) {
          return resolveRecursive(parsed, opts, pathStack, depth + 1);
        }

        let normalized = parsed;
        let safety = 0;
        while (typeof normalized === 'string' && normalized.includes('{') && safety < 20) {
          const next = this.resolver.parseNestedValue(normalized, opts);
          if (next === normalized) break;
          normalized = next;
          safety += 1;
          if (!_.isString(normalized)) {
            return resolveRecursive(normalized, opts, pathStack, depth + 1);
          }
        }

        const finalValue = this.colors.tryParseColor(normalized, opts.unit) ?? normalized;

        const unresolved = finalValue.match(/{([^}]+)}/g) ?? [];
        for (const raw of unresolved) {
          this.addIssue(issues, issueSet, {
            reference: raw,
            fromFile: relativePath,
            reason: 'Unresolved reference',
            trace: this.buildTrace(pathStack, raw.slice(1, -1)),
          });
        }

        return finalValue;
      }

      if (_.isArray(value)) {
        return value.map((item, index) =>
          resolveRecursive(item, opts, [...pathStack, String(index)], depth + 1),
        );
      }

      if (_.isPlainObject(value)) {
        return Object.fromEntries(
          Object.entries(value).map(([key, val]) => [
            key,
            resolveRecursive(val, opts, [...pathStack, key], depth + 1),
          ]),
        );
      }

      return value;
    };

    const data = resolveRecursive(json, parseOptions);

    return { data, issues };
  }

  private addIssue(issues: ResolveIssue[], seen: Set<string>, issue: ResolveIssue) {
    const key = `${issue.fromFile}|${issue.reference}|${issue.reason}|${issue.trace ?? ''}`;
    if (seen.has(key)) return;
    seen.add(key);
    issues.push(issue);
  }

  private buildTrace(pathStack: string[], refPath: string): string | undefined {
    const current = pathStack.length ? pathStack.join('.') : '';
    return current ? `${current} -> ${refPath}` : refPath;
  }

  private async writeResolveLog(baseDir: string, issues: ResolveIssue[]): Promise<void> {
    const logPath = nodePath.join(baseDir, this.unresolvedLogFile);

    if (!issues.length) {
      await fs.rm(logPath, { force: true });
      return;
    }

    const grouped = new Map<string, ResolveIssue[]>();
    for (const issue of issues) {
      if (!grouped.has(issue.fromFile)) grouped.set(issue.fromFile, []);
      grouped.get(issue.fromFile)!.push(issue);
    }

    const chunks: string[] = [];
    for (const [file, fileIssues] of grouped.entries()) {
      chunks.push(`[${file}]`);
      for (const item of fileIssues) {
        const trace = item.trace ? ` @ ${item.trace}` : '';
        chunks.push(`- ${item.reference} (${item.reason})${trace}`);
      }
      chunks.push('');
    }

    await fs.writeFile(logPath, chunks.join('\n').trimEnd() + '\n', 'utf-8');

    if (this.verbose) console.warn('Unresolved tokens saved to', logPath);
  }

  private async emitBuildArtifacts(options: {
    cacheDir: string;
    buildDir: string;
    scssDir?: string;
  }): Promise<void> {
    const { cacheDir, buildDir, scssDir } = options;

    let entries = await fs.readdir(cacheDir, { withFileTypes: true });
    entries = sortDirents(entries).filter((entry) => !entry.name.startsWith('.'));

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const aggregated = await this.buildCacheTree(nodePath.join(cacheDir, entry.name));
        const baseName = entry.name;
        const outPath = nodePath.join(buildDir, `${baseName}.json`);
        await fs.writeFile(outPath, JSON.stringify(aggregated, null, 2), 'utf-8');

        if (scssDir) {
          await this.JSONToSCSS(outPath, scssDir, `_${baseName}.scss`, {
            options: {
              ...this.defaultParseOptions,
              fileName: baseName,
            },
            mapOptions: this.defaultMapOptions,
            name: baseName,
          });
        }

        continue;
      }

      if (!entry.isFile() || !isJsonFile(entry.name)) continue;
      const baseName = entry.name.replace(/\.json$/i, '');
      const sourcePath = nodePath.join(cacheDir, entry.name);
      const destPath = nodePath.join(buildDir, entry.name);

      await fs.mkdir(nodePath.dirname(destPath), { recursive: true });
      const data = await fs.readFile(sourcePath, 'utf-8');
      await fs.writeFile(destPath, data, 'utf-8');

      if (scssDir) {
        await this.JSONToSCSS(destPath, scssDir, `_${baseName}.scss`, {
          options: {
            ...this.defaultParseOptions,
            fileName: baseName,
          },
          mapOptions: this.defaultMapOptions,
          name: baseName,
        });
      }
    }
  }

  private async buildCacheTree(dir: string): Promise<Record<string, any>> {
    let entries = await fs.readdir(dir, { withFileTypes: true });
    entries = sortDirents(entries).filter((entry) => !entry.name.startsWith('.'));

    const result: Record<string, any> = {};

    for (const entry of entries) {
      const absPath = nodePath.join(dir, entry.name);

      if (entry.isDirectory()) {
        result[entry.name] = await this.buildCacheTree(absPath);
        continue;
      }

      if (!entry.isFile() || !isJsonFile(entry.name)) continue;

      const key = entry.name.replace(/\.json$/i, '');
      const raw = await fs.readFile(absPath, 'utf-8');
      result[key] = JSON.parse(raw);
    }

    return result;
  }

  async JSONToSCSS(
    inputPath: string,
    outputDir: string,
    outputFileName: string,
    opts?: Partial<JSONToSCSSOptions>,
  ): Promise<void> {
    const {
      header = '// Generated by tokensParser. ‼️ DO NOT MODIFY THIS FILE ‼️ /\n',
      name = '',
      comment = '',
      options,
      mapOptions,
    } = { ...(opts || {}) } as JSONToSCSSOptions;

    const baseOptions: ParseValueOptions = {
      ...this.defaultParseOptions,
      fileName: options?.fileName || '',
      ...(options || {}),
    };

    const parseMapOptions: ParseValueOptions = {
      ...baseOptions,
      ...(mapOptions || {}),
    };

    try {
      await this.ensureDirExists(outputDir);

      const cssFile = await fs.readFile(inputPath, 'utf-8');
      const json = JSON.parse(cssFile);

      this.scssParser.clearCssVars();
      const parsed = (this.scssParser.parseMap as any)(json, parseMapOptions, [
        this.toKebabCaseFn(name),
      ]);

      const outputPath = nodePath.join(outputDir, outputFileName);

      let content = `${header}${comment}\n$${name}: ${parsed};\n`;

      if (this.opts.cssVarOptions?.useSeparateFile) {
        const cssVarsBlock = this.scssParser.getCssVarsBlock();
        if (cssVarsBlock) {
          const cssOpts = this.opts.cssVarOptions ?? {};
          const prefix = cssOpts.fileNamePrefix ?? '__';
          const baseName =
            parseMapOptions.fileName || outputFileName.replace(/^_/, '').replace(/\.scss$/, '');
          const cssFileName = `${prefix}${baseName}.css`;

          const cssOutDir = this.opts.cssVarsOutDir || outputDir;
          const cssOutPath = `${cssOutDir}/${cssFileName}`;

          await fs.mkdir(cssOutDir, { recursive: true });
          await fs.writeFile(cssOutPath, cssVarsBlock.trimStart());
          console.log(`CSS variables written to ${cssOutPath}`);
        }
      } else {
        content += this.scssParser.getCssVarsBlock();
      }

      await fs.writeFile(outputPath, content);
      console.log(`${name} parsed to ${outputPath}`);
    } catch (err) {
      console.error(err);
    }
  }

  async generateEntryFile() {
    const { build, entryFilePath } = this.opts;
    if (!build || !entryFilePath) return;

    try {
      await this.ensureDirExists(build);
      const entryDir = nodePath.dirname(entryFilePath);
      await this.ensureDirExists(entryDir);

      const exists = await fs
        .access(build)
        .then(() => true)
        .catch(() => false);
      if (!exists) {
        await fs.mkdir(build, { recursive: true });
      }

      const files = await fs.readdir(build).catch(() => []);
      const jsonFiles = (files || []).filter((f: string) => f.endsWith('.json')).sort();
      const moduleKeys = jsonFiles.map((file: string) => file.replace('.json', ''));

      if (jsonFiles.length === 0) {
        const emptyContent = `export default {};\n`;
        await fs.writeFile(entryFilePath, emptyContent, 'utf-8');
        console.log(`ℹ️ No JSON files in "${build}". Empty entry generated at ${entryFilePath}`);
        return;
      }

      const relativeImportPath = nodePath.relative(nodePath.dirname(entryFilePath), build);

      const imports = jsonFiles
        .map((file: string) => {
          const name = file.replace('.json', '');
          let importPath = nodePath.join(relativeImportPath, file).replace(/\\/g, '/');
          if (!importPath.startsWith('.') && !importPath.startsWith('/'))
            importPath = './' + importPath;
          return `import ${name} from "${importPath}";`;
        })
        .join('\n');

      const moduleBody = this.opts.isModulesMergedIntoEntry
        ? moduleKeys.join(',\n  ')
        : moduleKeys.map((name) => `...${name}`).join(',\n  ');

      const content = `${imports}

const module = {
  ${moduleBody}
};

export default module;
`;

      await fs.writeFile(entryFilePath, content, 'utf-8');
      console.log(`✅ TypeScript entry file generated at ${entryFilePath}`);
    } catch (err) {
      console.error('❌ Failed to generate TypeScript entry file', err);
    }
  }
}
