import fs from 'node:fs';
import path from 'node:path';

import Color from 'color';

export const toKebab = (s: string) =>
  s
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z])(?=[a-z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();

export const hasField = (obj: any, key: 'value') =>
  obj &&
  (Object.prototype.hasOwnProperty.call(obj, key) ||
    Object.prototype.hasOwnProperty.call(obj, `$${key}`));

export const getField = <T = any>(obj: any, key: 'value'): T | undefined =>
  Object.prototype.hasOwnProperty.call(obj, key)
    ? (obj as any)[key]
    : Object.prototype.hasOwnProperty.call(obj, `$${key}`)
      ? (obj as any)[`$${key}`]
      : undefined;

export const isColorish = (v: unknown): v is string => {
  if (typeof v !== 'string') return false;
  try {
    Color(v);
    return true;
  } catch {
    return false;
  }
};

export const ensureDirForFile = (filePath: string) => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

export const resolveOutputPaths = (outDir: string) => {
  const dir = path.dirname(outDir);
  const base = path.basename(outDir);
  const hasJson = base.toLowerCase().endsWith('.json');

  const baseName = hasJson ? base.slice(0, -5) : base;
  const mainPath = path.join(dir, `${baseName}.json`);
  const underscoredPath = path.join(dir, `_${baseName}.json`);
  const mainMd = mainPath.replace(/\.json$/i, '.md');
  const underscoredMd = underscoredPath.replace(/\.json$/i, '.md');

  return { mainPath, underscoredPath, mainMd, underscoredMd, baseName };
};
