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
