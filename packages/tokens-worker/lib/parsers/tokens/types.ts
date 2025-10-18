// This file were developed with the assistance of AI tools.
//
import type { JSONBuilderOptions } from '../JSONBuilder.js';

export type List<T> = Array<T>;

export interface TokenObj {
  value?: string | number;
  type?: string;
  unit?: string;
  meta: {
    description?: string;
    category?: string;
    build?: {
      web?: {
        exportAsVar?: boolean;
        varName?: string;
        status?: 'unused' | 'active';
      };
      ios: {
        applyMultiplier?: boolean;
        status?: 'unused' | 'active';
      };
      android: {
        applyMultiplier?: boolean;
        status?: 'unused' | 'active';
      };
    };
  };
}

export interface IMap extends TokenObj {
  [key: string]: Value<unknown>;
}

export type Value<T> = string | number | List<T> | T | IMap;

export type ServiceField = 'value' | 'type' | 'unit' | 'meta' | 'respond';
export type IncludeServiceFields = ('*' | 'all' | 'none' | 'core' | ServiceField)[] | boolean;

export interface IncludeServiceFieldsConfig {
  includeAll: boolean;
  set: Set<ServiceField>;
}

export interface ParseValueOptions {
  prefix?: string;
  convertPxToRem: boolean;
  convertCase?: boolean;
  includeFileName?: boolean;
  scssUseDefaultFlag?: boolean;
  convertToCSSVariables?: boolean;
  includeFileNameToCSSVariables?: boolean;
  excludeCSSVariables?: string[];
  fileName?: string;
  key?: string;
  unit?: string;
  includeServiceFields?: IncludeServiceFields;
  includeSymbolsInServiceFields?: boolean;
}

export interface JSONToSCSSOptions {
  name: string;
  header: string;
  comment: string;
  options: Partial<ParseValueOptions>;
  mapOptions?: Partial<ParseValueOptions>;
}

export interface CssVarOptions {
  prefix?: string;
  convertToCSSVariables?: boolean;
  includeFileNameToCSSVariables?: boolean;
  excludeCSSVariables?: string[];
  useSeparateFile?: boolean;
  fileNamePrefix?: string;
}

export interface TokensParserOptions {
  builder?: JSONBuilderOptions;
  source?: string;
  paths?: string[];
  outDir: string;
  cssVarsOutDir?: string;
  build?: string;
  entryFilePath?: string;
  mapOptions?: Partial<ParseValueOptions>;
  cssVarOptions?: CssVarOptions;
  parseOptions?: Partial<ParseValueOptions>;
  useFileStructureLookup?: boolean;
  isModulesMergedIntoEntry?: boolean;
  themesDir?: string;
  themesOutFile?: string;
  themesIncludeRequired?: boolean;
  verbose?: boolean;
  cssVarsPrefer?: 'first' | 'last';
}
