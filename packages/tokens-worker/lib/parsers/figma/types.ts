export interface FigmaTokensParserOptions {
  source: string;
  outDir: string;
  includeGlobs?: string[];
  excludeGlobs?: string[];
  flatten?: boolean;
  resolveReferences?: boolean;
  keepServiceFields?: boolean;
  pretty?: boolean;
  ignoreUnderscored?: boolean;
  ignoreDotfiles?: boolean;
  verbose?: boolean;
}
