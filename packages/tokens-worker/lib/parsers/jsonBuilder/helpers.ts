import fs from 'node:fs/promises';
import path from 'node:path';
import yaml from 'js-yaml';

import type { JSONBuilderFormat } from './types.js';

export const isDirectory = async (p: string): Promise<boolean> => {
  try {
    return (await fs.stat(p)).isDirectory();
  } catch {
    return false;
  }
};

export const readFileContent = async (filePath: string): Promise<any> => {
  const ext = path.extname(filePath).toLowerCase();
  const raw = await fs.readFile(filePath, 'utf-8');

  if (ext === '.json') return JSON.parse(raw);
  if (ext === '.yaml' || ext === '.yml') return yaml.load(raw);
  if (ext === '.ts') {
    const mod = await import(path.resolve(filePath));
    return (mod as any).default ?? mod;
  }
  return raw;
};

export const shouldSkipEntry = (name: string): boolean => {
  return name.startsWith('.') || name.startsWith('_');
};

interface BuildTreeOptions {
  readFileContent: (filePath: string) => Promise<any>;
  shouldSkipEntry: (name: string) => boolean;
}

export const buildTree = async (
  dir: string,
  { readFileContent, shouldSkipEntry }: BuildTreeOptions,
): Promise<Record<string, any>> => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const result: Record<string, any> = {};

  for (const entry of entries) {
    if (shouldSkipEntry(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      const subtree = await buildTree(fullPath, { readFileContent, shouldSkipEntry });
      const indexLike =
        typeof subtree === 'object' && subtree !== null && 'index' in subtree
          ? (subtree as any)['index']
          : null;
      result[entry.name] = indexLike ?? subtree;
    } else {
      const key = entry.name.replace(/\.[^.]+$/, '');
      if (shouldSkipEntry(key)) continue;

      result[key] = await readFileContent(fullPath);
    }
  }

  return result;
};

export const deepMerge = (target: any, source: any): any => {
  if (Array.isArray(target) && Array.isArray(source)) return source;
  if (typeof target !== 'object' || target === null) return source;
  if (typeof source !== 'object' || source === null) return source;

  for (const key of Object.keys(source)) {
    target[key] = key in target ? deepMerge(target[key], source[key]) : source[key];
  }
  return target;
};

export const writeFormattedFile = async (
  filePath: string,
  data: any,
  format: JSONBuilderFormat,
): Promise<void> => {
  await fs.mkdir(path.dirname(filePath), { recursive: true });

  let content: string;
  switch (format) {
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
};

export const buildEntryFile = async (
  outDir: string,
  entryFilePath: string,
  shouldSkipEntry: (name: string) => boolean,
) => {
  const files = await fs.readdir(outDir);
  const jsonFiles = files
    .filter((f) => f.endsWith('.json') && !shouldSkipEntry(f))
    .sort((a, b) => a.localeCompare(b, 'en'));

  const imports: string[] = [];
  const spreads: string[] = [];

  for (const file of jsonFiles) {
    const key = path.basename(file, '.json');
    const importPath = `./${path.relative(path.dirname(entryFilePath), path.join(outDir, file)).replace(/\\/g, '/')}`;
    imports.push(`import ${key} from "${importPath}";`);
    spreads.push(`...${key}`);
  }

  const content = `${imports.join('\n')}

const module = {
  ${spreads.join(',\n  ')}
};

export default module;
`;

  await fs.mkdir(path.dirname(entryFilePath), { recursive: true });
  await fs.writeFile(entryFilePath, content, 'utf-8');
};
