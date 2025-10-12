// Portions of this file were developed with the assistance of AI tools.

import fs from 'node:fs/promises';
import fssync from 'node:fs';
import path from 'node:path';

/* * * padding expansion core * * */

type AnyObject = Record<string, any>;

const hasAltField = (obj: AnyObject, key: string) =>
  obj &&
  (Object.prototype.hasOwnProperty.call(obj, key) ||
    Object.prototype.hasOwnProperty.call(obj, `$${key}`));

const getAltField = <T = any>(obj: AnyObject, key: string): T | undefined =>
  Object.prototype.hasOwnProperty.call(obj, key)
    ? (obj as any)[key]
    : Object.prototype.hasOwnProperty.call(obj, `$${key}`)
      ? (obj as any)[`$${key}`]
      : undefined;

/** Expand CSS-like box shorthand (1–4 values) to [top, right, bottom, left] */
export function expandBox(values: any[]): [any, any, any, any] {
  const len = values.length;
  if (len === 1) {
    const [v] = values;
    return [v, v, v, v];
  }
  if (len === 2) {
    const [v, h] = values;
    return [v, h, v, h];
  }
  if (len === 3) {
    const [t, h, b] = values;
    return [t, h, b, h];
  }
  const [t, r, b, l] = values;
  return [t, r, b, l];
}

function isPaddingArray(v: any): v is any[] {
  return Array.isArray(v) && v.length >= 1 && v.length <= 4;
}

const PADDING_PROPS = ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'] as const;

function expandPaddingEntry(target: AnyObject, key: string, raw: any): AnyObject {
  // raw can be an array, or a token-like object with value/$value array
  let arr: any[] | undefined;

  if (Array.isArray(raw)) {
    arr = raw;
  } else if (raw && typeof raw === 'object' && hasAltField(raw, 'value')) {
    const v = getAltField<any>(raw, 'value');
    if (Array.isArray(v)) arr = v;
  }

  if (!arr || !isPaddingArray(arr)) return target;

  const [t, r, b, l] = expandBox(arr);
  const [topKey, rightKey, bottomKey, leftKey] = PADDING_PROPS;

  // Remove shorthand
  delete target[key];

  // Preserve token object shape per-side if the original was a token object
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    const cloneFor = (sideVal: any) => {
      const obj = { ...raw };
      if (Object.prototype.hasOwnProperty.call(obj, 'value')) obj.value = sideVal;
      else obj.$value = sideVal;
      return obj;
    };
    target[topKey] = cloneFor(t);
    target[rightKey] = cloneFor(r);
    target[bottomKey] = cloneFor(b);
    target[leftKey] = cloneFor(l);
  } else {
    target[topKey] = t;
    target[rightKey] = r;
    target[bottomKey] = b;
    target[leftKey] = l;
  }

  return target;
}

/** Recursively expand padding/$padding at all levels */
export function expandPaddingInObject<T extends AnyObject>(input: T): T {
  const walk = (node: AnyObject): AnyObject => {
    if (!node || typeof node !== 'object' || Array.isArray(node)) return node;

    if (Object.prototype.hasOwnProperty.call(node, 'padding')) {
      expandPaddingEntry(node, 'padding', node.padding);
    } else if (Object.prototype.hasOwnProperty.call(node, '$padding')) {
      expandPaddingEntry(node, '$padding', node.$padding);
    }

    for (const [k, v] of Object.entries(node)) {
      if (v && typeof v === 'object' && !Array.isArray(v)) {
        node[k] = walk(v);
      }
    }
    return node;
  };

  // shallow clone top level to avoid mutating external reference
  const root = Array.isArray(input) ? (input as any) : { ...(input as AnyObject) };
  return walk(root) as T;
}

/* * * directory walker + IO * * */

export interface FigmaTokensParserOptions {
  source: string; // directory to read .json files from (recursive)
  outDir: string; // directory to write transformed .json files into (mirrors structure)
  ignoreUnderscored?: boolean; // skip files/dirs starting with "_" (default: true)
  ignoreDotfiles?: boolean; // skip files/dirs starting with "." (default: true)
}

function shouldSkip(
  name: string,
  { ignoreUnderscored = true, ignoreDotfiles = true }: FigmaTokensParserOptions,
) {
  if (ignoreDotfiles && name.startsWith('.')) return true;
  if (ignoreUnderscored && name.startsWith('_')) return true;
  return false;
}

async function ensureDir(dirPath: string) {
  if (!fssync.existsSync(dirPath)) {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

/** Recursively list all .json files under a directory, honoring skip rules */
async function listJsonFiles(rootDir: string, opts: FigmaTokensParserOptions): Promise<string[]> {
  const out: string[] = [];
  async function walk(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      if (shouldSkip(e.name, opts)) continue;
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        await walk(full);
        continue;
      }
      if (e.isFile() && e.name.toLowerCase().endsWith('.json')) {
        out.push(full);
      }
    }
  }
  await walk(rootDir);
  return out;
}

/** Transform one file and write it to outDir mirroring structure */
export async function transformFile(
  filePath: string,
  opts: FigmaTokensParserOptions,
): Promise<void> {
  const rel = path.relative(opts.source, filePath);
  const outPath = path.join(opts.outDir, rel);

  const raw = await fs.readFile(filePath, 'utf-8');
  let json: any;
  try {
    json = JSON.parse(raw);
  } catch (e) {
    console.warn(`[FigmaTokensParser] Skip invalid JSON: ${filePath}\n  ${e}`);
    return;
  }

  const transformed = expandPaddingInObject(json);

  await ensureDir(path.dirname(outPath));
  await fs.writeFile(outPath, JSON.stringify(transformed, null, 2), 'utf-8');
  console.log(`✅ Parsed: ${rel}`);
}

/** Main entry: parse all .json files from source and output to outDir */
export async function runFigmaTokensParser(opts: FigmaTokensParserOptions): Promise<void> {
  const sourceAbs = path.resolve(opts.source);
  const outAbs = path.resolve(opts.outDir);

  await ensureDir(outAbs);
  const files = await listJsonFiles(sourceAbs, opts);
  await Promise.all(
    files.map((f) => transformFile(f, { ...opts, source: sourceAbs, outDir: outAbs })),
  );
  console.log(`✅ Done. Processed ${files.length} file(s)`);
}
