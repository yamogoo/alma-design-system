// This file were developed with the assistance of AI tools.
//
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
  valuePxToRem(value: number): string;
  convertNumberByKey(value: number, key?: string, opts?: ParseValueOptions): string;
  toKebabCase(value: string): string;
  verbose: boolean;
}

export class TokenFileManager {
  private readonly opts: TokensParserOptions;
  private readonly defaultParseOptions: ParseValueOptions;
  private readonly defaultMapOptions: ParseValueOptions;
  private readonly resolver: TokenResolver;
  private readonly scssParser: SCSSParser;
  private readonly colors: ColorToolkit;
  private readonly fileCache: Record<string, any>;
  private readonly valuePxToRemFn: (value: number) => string;
  private readonly convertNumberByKeyFn: (
    value: number,
    key?: string,
    opts?: ParseValueOptions,
  ) => string;
  private readonly toKebabCaseFn: (value: string) => string;
  private readonly verbose: boolean;

  constructor(config: FileManagerConfig) {
    this.opts = config.opts;
    this.defaultParseOptions = config.defaultParseOptions;
    this.defaultMapOptions = config.defaultMapOptions;
    this.resolver = config.resolver;
    this.scssParser = config.scssParser;
    this.colors = config.colors;
    this.fileCache = config.fileCache;
    this.valuePxToRemFn = config.valuePxToRem;
    this.convertNumberByKeyFn = config.convertNumberByKey;
    this.toKebabCaseFn = config.toKebabCase;
    this.verbose = config.verbose;
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

  async listDir(source: string, output: string) {
    try {
      await this.ensureDirExists(this.opts.build);

      const fileNames = await fs.readdir(source);
      for (const fileName of fileNames) {
        if (/^(?=.).*.json$/.test(fileName)) {
          await this.resolveAndSaveJson(`${source}/${fileName}`, fileName);

          if (!this.opts.build) continue;
          await this.JSONToSCSS(
            `${this.opts.build}/${fileName}`,
            `${output}`,
            `_${fileName.replace('.json', '.scss')}`,
            {
              options: {
                ...this.defaultParseOptions,
                fileName: fileName.replace(/\.json$/, ''),
              },
              mapOptions: this.defaultMapOptions,
              name: fileName.replace('.json', ''),
            },
          );
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  async resolveAndSaveJson(inputPath: string, fileName: string): Promise<void> {
    if (!this.opts.build) return;
    const unresolvedTokens: string[] = [];
    try {
      const jsonRaw = await fs.readFile(inputPath, 'utf-8');
      const json = JSON.parse(jsonRaw);

      const resolveRecursive = (obj: any, opts: ParseValueOptions, depth = 0): any => {
        if (_.isString(obj)) {
          const regex = /{([^}]+)}/g;
          let result: any = obj;
          let match: RegExpExecArray | null;
          while ((match = regex.exec(obj)) !== null) {
            const fullMatch = match[0];
            const pathStr = match[1];
            const pathParts = pathStr.split('.');
            const fName = pathParts.shift();
            if (!fName) continue;

            try {
              let jsonFile: any;

              if (this.fileCache[fName]) {
                jsonFile = this.fileCache[fName];
              } else {
                const paths = this.opts.paths ?? ['.'];
                let fileFound = false;

                for (const p of paths) {
                  const filePath = `${p}/${fName}.json`;
                  try {
                    const file = readFileSync(filePath, 'utf-8');
                    jsonFile = JSON.parse(file);
                    this.fileCache[fName] = jsonFile;
                    fileFound = true;
                    break;
                  } catch {
                    continue;
                  }
                }

                if (!fileFound && this.opts.useFileStructureLookup) {
                  const resolved = this.resolver.resolveTokenPathRecursiveSync(pathStr);
                  if (resolved !== undefined) {
                    result = result.replace(fullMatch, resolved as any);
                    continue;
                  }
                }

                if (!fileFound) {
                  unresolvedTokens.push(fullMatch);
                  continue;
                }
              }

              let nestedValue = pathParts.reduce((acc, key) => acc?.[key], jsonFile);
              nestedValue = this.resolver.coerceTokenObjectToScalar(nestedValue);

              if (nestedValue === undefined) {
                if (this.opts.useFileStructureLookup) {
                  const resolved = this.resolver.resolveTokenPathRecursiveSync(pathStr);
                  if (resolved !== undefined) {
                    result = result.replace(fullMatch, resolved as any);
                    continue;
                  }
                }
                unresolvedTokens.push(fullMatch);
                continue;
              }

              nestedValue = resolveRecursive(nestedValue, opts, depth + 1);
              if (obj === fullMatch) return nestedValue;

              result = result.replace(fullMatch, nestedValue);
            } catch {
              unresolvedTokens.push(fullMatch);
            }
          }

          const colorMaybe = this.colors.tryParseColor(String(result), opts.unit);
          return colorMaybe ?? result;
        }

        if (_.isArray(obj)) return obj.map((v) => resolveRecursive(v, opts, depth));
        if (_.isPlainObject(obj))
          return Object.fromEntries(
            Object.entries(obj).map(([k, v]) => [k, resolveRecursive(v, opts, depth)]),
          );
        return obj;
      };

      const resolvedJson = resolveRecursive(json, {
        ...this.defaultParseOptions,
        fileName: fileName.replace(/\.json$/, ''),
      });

      const buildDir = this.opts.build!;
      await this.ensureDirExists(buildDir);

      const exists = await fs
        .access(buildDir)
        .then(() => true)
        .catch(() => false);
      if (!exists) await fs.mkdir(buildDir, { recursive: true });
      const buildPath = `${buildDir}/${fileName}`;
      await fs.writeFile(buildPath, JSON.stringify(resolvedJson, null, 2), 'utf-8');

      if (unresolvedTokens.length > 0) {
        const logPath = `${buildDir}/unresolved-tokens.log`;
        const uniqueTokens = [...new Set(unresolvedTokens)];
        await fs.writeFile(logPath, uniqueTokens.join('\n'), 'utf-8');
        if (this.verbose) console.warn('Unresolved tokens saved to', logPath);
      }
    } catch (err) {
      console.error(err);
    }
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
