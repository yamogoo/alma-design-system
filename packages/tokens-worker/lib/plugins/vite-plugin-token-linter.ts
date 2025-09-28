// Portions of this file were developed with the assistance of AI tools (ChatGPT).

import { Plugin } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

/* * * Types & Config * * */

type Token = {
  value?: any;
  type?: string;
  unit?: string;
  meta?: { category?: string; description?: string };
  [key: string]: any;
};

const allowedTypes = [
  'number',
  'boolean',
  'string',
  'border',
  'breakpoint',
  'spacing',
  'size',
  'radius',
  'color',
  'alias',
  'fontFamily',
  'fontWeight',
  'fontStyle',
  'lineHeight',
  'letterSpacing',
  'component',
];

const allowedUnits: Record<string, string[]> = {
  spacing: ['px', 'rem', 'em', '%'],
  size: ['px', 'rem', 'em'],
  radius: ['px', 'rem', '%'],
  color: [],
  alias: [],
  fontFamily: ['font'],
  fontWeight: [''],
  fontStyle: [''],
  lineHeight: ['%', 'px', 'rem'],
  letterSpacing: ['px', 'rem', 'em'],
  component: [],
};

const expectedStates = ['normal', 'hovered', 'pressed', 'disabled'];

/* * * Pretty console * * */

const c = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  gray: '\x1b[90m',
  magenta: '\x1b[35m',
};

const icons = {
  error: '✖',
  warn: '⚠',
  info: 'ℹ',
  ok: '✔',
};

function error(msg: string) {
  console.error(`${c.red}${icons.error} [ERROR]${c.reset} ${msg}`);
}
function warn(msg: string) {
  console.warn(`${c.yellow}${icons.warn} [WARN]${c.reset} ${msg}`);
}
function info(msg: string) {
  console.log(`${c.cyan}${icons.info} [INFO]${c.reset} ${msg}`);
}
function ok(msg: string) {
  console.log(`${c.green}${icons.ok} [OK]${c.reset} ${msg}`);
}

/* * * elpers * * */

function isTokenReference(value: unknown) {
  return typeof value === 'string' && value.startsWith('{') && value.endsWith('}');
}

function isColorFunc(value: unknown) {
  if (typeof value !== 'string') return false;
  const s = value.trim().toLowerCase();
  return (
    (s.startsWith('rgba(') && s.endsWith(')')) ||
    (s.startsWith('lighten(') && s.endsWith(')')) ||
    (s.startsWith('darken(') && s.endsWith(')')) ||
    (s.startsWith('saturate(') && s.endsWith(')')) ||
    (s.startsWith('desaturate(') && s.endsWith(')'))
  );
}

function isSimpleValueObject(obj: any) {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) return false;
  const keys = Object.keys(obj);
  if (keys.length === 0) return false;
  return keys.every((k) => {
    const val = obj[k];
    return typeof val === 'string' || typeof val === 'number';
  });
}

function hasField(obj: any, field: 'value' | 'type' | 'unit' | 'meta'): boolean {
  return (
    obj &&
    (Object.prototype.hasOwnProperty.call(obj, field) ||
      Object.prototype.hasOwnProperty.call(obj, `$${field}`))
  );
}
function getField<T = any>(obj: any, field: 'value' | 'type' | 'unit' | 'meta'): T | undefined {
  if (!obj) return undefined;
  if (Object.prototype.hasOwnProperty.call(obj, field)) return obj[field];
  if (Object.prototype.hasOwnProperty.call(obj, `$${field}`)) return obj[`$${field}`];
  return undefined;
}

function typeOfValueStrict(
  v: any,
): 'number' | 'boolean' | 'string' | 'array' | 'object' | 'null' | 'undefined' {
  if (v === null) return 'null';
  if (Array.isArray(v)) return 'array';
  const t = typeof v;
  if (t === 'number' || t === 'boolean' || t === 'string' || t === 'undefined') return t as any;
  return 'object';
}

function assertPrimitiveTypeCompatibility(
  jsType: ReturnType<typeof typeOfValueStrict>,
  tokenType?: string,
): boolean {
  if (!tokenType) return true;
  if (tokenType === 'number') return jsType === 'number';
  if (tokenType === 'boolean') return jsType === 'boolean';
  if (tokenType === 'string') return jsType === 'string';
  return true;
}

function assertColorValue(v: any): boolean {
  if (isTokenReference(v)) return true;
  if (typeof v === 'string') return true; // hex, rgb(a), hsl(a), color-fns — ок
  return false;
}

/* * * Lint core * * */

type Counters = { errors: number; warnings: number };

function lintToken(token: any, pathArr: string[] = [], filePath?: string, counters?: Counters) {
  const pathStr = pathArr.join('.');
  const where = filePath
    ? `${c.gray}${filePath}${c.reset} ${c.dim}›${c.reset} ${c.magenta}${pathStr}${c.reset}`
    : pathStr;

  if (typeof token !== 'object' || token === null) return;

  if (isSimpleValueObject(token)) return;

  const isActualToken =
    hasField(token, 'value') ||
    hasField(token, 'type') ||
    hasField(token, 'unit') ||
    hasField(token, 'meta');

  if (isActualToken) {
    const typeVal = getField<string>(token, 'type');
    const unitVal = getField<string>(token, 'unit');
    const valueVal = getField<any>(token, 'value');
    const metaVal = getField<any>(token, 'meta');

    if (valueVal !== undefined && typeVal !== 'component') {
      if (!typeVal) {
        warn(`${where} - Missing ${c.bold}type${c.reset}`);
        counters && (counters.warnings += 1);
      }
      if (unitVal === undefined) {
        warn(`${where} - Missing ${c.bold}unit${c.reset}`);
        counters && (counters.warnings += 1);
      }
    }

    if (typeVal && !allowedTypes.includes(typeVal)) {
      error(`${where} - Invalid type ${c.bold}"${typeVal}"${c.reset}`);
      counters && (counters.errors += 1);
    }

    if (typeVal && unitVal !== undefined && allowedUnits[typeVal]?.length) {
      if (!allowedUnits[typeVal].includes(unitVal) && unitVal !== '' && unitVal !== 'none') {
        error(
          `${where} - Invalid unit ${c.bold}"${unitVal}"${c.reset} for type ${c.bold}"${typeVal}"${c.reset}`,
        );
        counters && (counters.errors += 1);
      }
    }

    if (valueVal !== undefined) {
      const vType = typeOfValueStrict(valueVal);

      if (isTokenReference(valueVal)) {
        // ok
      } else if (Array.isArray(valueVal)) {
        valueVal.forEach((v: any, i: number) => {
          if (
            typeof v !== 'number' &&
            typeof v !== 'string' &&
            typeof v !== 'boolean' &&
            !isTokenReference(v) &&
            !(typeof v === 'object' && v !== null)
          ) {
            error(
              `${where}[${i}] - Invalid array item value ${c.bold}${JSON.stringify(v)}${c.reset}`,
            );
            counters && (counters.errors += 1);
          }
        });
      } else if (typeof valueVal === 'object' && valueVal !== null) {
      } else {
        if (!assertPrimitiveTypeCompatibility(vType, typeVal)) {
          error(
            `${where} - Value JS type ${c.bold}${vType}${c.reset} does not match token type ${c.bold}"${typeVal}"${c.reset}`,
          );
          counters && (counters.errors += 1);
        }

        if (typeVal === 'color') {
          if (!assertColorValue(valueVal)) {
            error(`${where} - Invalid color value ${c.bold}${JSON.stringify(valueVal)}${c.reset}`);
            counters && (counters.errors += 1);
          }

          if (typeof valueVal === 'string' && !isColorFunc(valueVal)) {
          }
        }
      }
    }

    if (metaVal && !metaVal.category) {
      warn(`${where} - Missing meta.category`);
      counters && (counters.warnings += 1);
    }

    expectedStates.forEach((state) => {
      if (state in token && token[state] === undefined) {
        warn(`${where} - Missing state "${state}"`);
        counters && (counters.warnings += 1);
      }
    });
  }

  Object.entries(token).forEach(([key, val]) => {
    if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      lintToken(val, [...pathArr, key], filePath, counters);
    }
  });
}

/* * * FS utils * * */

function getAllJsonFiles(dir: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllJsonFiles(filePath));
    } else if (file.endsWith('.json')) {
      results.push(filePath);
    }
  });
  return results;
}

/* * * Vite Plugin * * */

export function VitePluginTokenLinter(options?: { source?: string }): Plugin {
  const sourcePath = options?.source || path.resolve(process.cwd(), 'tokens');

  const runForFile = (file: string) => {
    const raw = fs.readFileSync(file, 'utf-8');
    let tokens: Record<string, Token>;
    const counters: Counters = { errors: 0, warnings: 0 };

    try {
      tokens = JSON.parse(raw);
    } catch (e) {
      error(`Failed to parse JSON file ${c.bold}${file}${c.reset}: ${e}`);
      return;
    }

    info(`Linting tokens: ${c.bold}${file}${c.reset}`);
    Object.entries(tokens).forEach(([key, token]) => lintToken(token, [key], file, counters));

    // Summary

    counters.errors === 0
      ? `${c.green}${icons.ok}${c.reset} ${c.bold}No errors${c.reset}`
      : `${c.red}${icons.error}${c.reset} ${c.bold}${c.red}${c.bold}${c.red}${c.bold}${c.reset}`;

    const pad = (n: number) => String(n).padStart(3, ' ');
    const line = `${c.gray}────────────────────────────────────────────────────────────${c.reset}`;
    console.log(line);
    console.log(
      `${c.bold}Result:${c.reset} ${c.green}${icons.ok}${c.reset} ${c.bold}${pad(
        counters.warnings,
      )}${c.reset} ${c.yellow}warnings${c.reset}, ${c.bold}${pad(
        counters.errors,
      )}${c.reset} ${c.red}errors${c.reset}  ${c.dim}(${path.basename(file)})${c.reset}`,
    );
    console.log(line);

    if (counters.errors > 0) {
      error(`Found ${c.bold}${counters.errors}${c.reset} error(s) in ${c.bold}${file}${c.reset}`);
    } else if (counters.warnings > 0) {
      warn(
        `Found ${c.bold}${counters.warnings}${c.reset} warning(s) in ${c.bold}${file}${c.reset}`,
      );
    } else {
      ok(`Clean: ${file}`);
    }
  };

  return {
    name: 'vite-plugin-token-linter',
    enforce: 'pre',
    buildStart() {
      if (!fs.existsSync(sourcePath)) {
        warn(`Tokens source folder not found: ${c.bold}${sourcePath}${c.reset}`);
        return;
      }
      const files = getAllJsonFiles(sourcePath);
      if (files.length === 0) {
        warn(`No .json token files found in ${c.bold}${sourcePath}${c.reset}`);
        return;
      }
      files.forEach(runForFile);
    },
    configureServer(server) {
      if (!fs.existsSync(sourcePath)) return;
      const files = getAllJsonFiles(sourcePath);
      server.watcher.add(files);
      server.watcher.on('change', (file) => {
        if (files.includes(file)) {
          info(`Tokens file changed: ${c.bold}${file}${c.reset}, running linter…`);
          runForFile(file);
        }
      });
    },
  };
}
