export interface ColorsGeneratorOptions {
  source: string;
  outDir: string;
  step?: number;
  comment?: string;
  mode?: {
    colorspace?: string;
    strategy?: string;
    gamutClamp?: boolean;
    round?: { decimals?: number };
    keys?: { prefix?: string; separator?: string };
  };
  writeMarkdownFiles?: boolean;
  suffixGrid?: number;
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

export type TokenValue = { $value: string; $type: 'color'; $unit: 'hex' };

export type DerivativeColors = DerivativeColor[];
