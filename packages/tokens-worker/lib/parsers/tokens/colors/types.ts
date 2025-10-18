export interface ColorsGeneratorOptions {
  source: string;
  outDir: string;
  step?: number;
  comment?: string;
  writeMarkdownFiles?: boolean;
}

export interface MainColor {
  id: string;
  name: string;
  value: string;
  step: number;
  prefix: string;
  separator: string;
}

export interface DerivativeColor {
  id: string;
  name: string;
  fullName: string;
  value: string;
  increment: number;
  lightness: number;
  isLight: boolean;
}

export type DerivativeColors = DerivativeColor[];
