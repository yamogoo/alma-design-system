import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const configJson = require("./src/tokens/src/config.json");

const PREFIX = configJson.namespace?.$value || "al-";

const TOKENS_SRC = "./src/tokens/src";
const TOKENS_CACHE = "./src/tokens/.cache";
const TOKENS_OUT = "./src/tokens/output";
const TOKENS_ENTRY = "./src/tokens/index.ts";
const TOKENS_SCSS = "./src/assets/scss/abstracts";

export const colorsGeneratorConfig = {
  paths: {
    input: `${TOKENS_SRC}/baseColors.json`,
    output: `${TOKENS_SRC}/colors.json`,
  },
  generator: {
    levels: 40,
  },
};

export const tokensParserConfig = {
  paths: {
    src: TOKENS_SRC,
    cache: TOKENS_CACHE,
    out: TOKENS_OUT,
    entry: TOKENS_ENTRY,
    scssOut: TOKENS_SCSS,
  },
  include: [`${TOKENS_SRC}/**/*.json`, `${TOKENS_CACHE}/**/*.json`],
  naming: {
    prefix: "",
    caseTransform: true,
    includeFileName: true,
  },
  fields: {
    include: ["value", "respond"],
  },
  targets: {
    scssMap: {
      useDefaultFlag: true,
    },
    cssVars: {
      enabled: false,
      prefix: PREFIX,
      includeFileName: false,
      exclude: [`${TOKENS_CACHE}/themes.json`],
      separateFile: true,
      fileNamePrefix: "_runtime.",
    },
    themes: {
      enabled: true,
      input: `${TOKENS_OUT}/themes.json`,
      output: `${TOKENS_SCSS}/_runtime_themes.scss`,
      requireAll: true,
    },
  },
  builder: {
    format: "json",
    roots: [TOKENS_SRC],
    includeRootDir: false,
  },
  resolver: {
    fileLookup: true,
    mergeIntoEntry: true,
  },
};

export default {
  colorsGeneratorConfig,
  tokensParserConfig,
};
