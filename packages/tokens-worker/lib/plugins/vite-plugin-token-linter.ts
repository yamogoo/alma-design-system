// Portions of this file were developed with the assistance of AI tools (ChatGPT).

import { Plugin } from "vite";
import fs from "node:fs";
import path from "node:path";

type Token = {
  value?: any;
  type?: string;
  unit?: string;
  meta?: { category?: string; description?: string };
  [key: string]: any;
};

const allowedTypes = [
  "number",
  "string",
  "border",
  "breakpoint",
  "spacing",
  "size",
  "radius",
  "color",
  "alias",
  "fontFamily",
  "fontWeight",
  "fontStyle",
  "lineHeight",
  "letterSpacing",
  "component",
];

const allowedUnits: Record<string, string[]> = {
  spacing: ["px", "rem", "em", "%"],
  size: ["px", "rem", "em"],
  radius: ["px", "rem", "%"],
  color: [],
  alias: [],
  fontFamily: ["font"],
  fontWeight: [""],
  fontStyle: [""],
  lineHeight: ["%", "px", "rem"],
  letterSpacing: ["px", "rem", "em"],
  component: [],
};

const expectedStates = ["normal", "hovered", "pressed", "disabled"];

function error(msg: string) {
  console.error(`\x1b[31m[ERROR]\x1b[0m ${msg}`);
}

function warn(msg: string) {
  console.warn(`\x1b[33m[WARN]\x1b[0m ${msg}`);
}

function info(msg: string) {
  console.log(`\x1b[36m[INFO]\x1b[0m ${msg}`);
}

function isTokenReference(value: string) {
  return (
    typeof value === "string" && value.startsWith("{") && value.endsWith("}")
  );
}

function isRgbaFunction(value: string) {
  return (
    typeof value === "string" &&
    value.startsWith("rgba(") &&
    value.endsWith(")")
  );
}

function isSimpleValueObject(obj: any) {
  if (typeof obj !== "object" || obj === null || Array.isArray(obj))
    return false;
  const keys = Object.keys(obj);
  if (keys.length === 0) return false;
  return keys.every((k) => {
    const val = obj[k];
    return typeof val === "string" || typeof val === "number";
  });
}

function lintToken(token: any, pathArr: string[] = [], filePath?: string) {
  const pathStr = pathArr.join(".");
  const prefix = filePath ? `${filePath} - ${pathStr}` : pathStr;
  if (typeof token !== "object" || token === null) return;

  if (isSimpleValueObject(token)) return;

  const isActualToken =
    "value" in token || "type" in token || "unit" in token || "meta" in token;

  if (isActualToken) {
    if ("value" in token && token.type !== "component") {
      if (!token.type) warn(`${prefix} - Missing type`);
      if (token.unit === undefined) warn(`${prefix} - Missing unit`);
    }

    if (token.type && !allowedTypes.includes(token.type)) {
      error(`${prefix} - Invalid type "${token.type}"`);
    }

    if (
      token.type &&
      token.unit !== undefined &&
      allowedUnits[token.type]?.length
    ) {
      if (
        !allowedUnits[token.type].includes(token.unit) &&
        token.unit !== "" &&
        token.unit !== "none"
      ) {
        error(
          `${prefix} - Invalid unit "${token.unit}" for type "${token.type}"`
        );
      }
    }

    if (token.value !== undefined) {
      if (Array.isArray(token.value)) {
        token.value.forEach((v: any, i: number) => {
          if (
            typeof v !== "number" &&
            typeof v !== "string" &&
            !isTokenReference(v) &&
            !isRgbaFunction(v) &&
            !(typeof v === "object" && v !== null)
          ) {
            error(`${prefix}[${i}] - Invalid value "${v}"`);
          }
        });
      } else if (
        typeof token.value !== "number" &&
        typeof token.value !== "string" &&
        !isTokenReference(token.value) &&
        !isRgbaFunction(token.value) &&
        !(typeof token.value === "object" && token.type === "component")
      ) {
        error(`${prefix} - Invalid value "${token.value}"`);
      }
    }

    if (token.meta && !token.meta.category)
      warn(`${prefix} - Missing meta.category`);

    expectedStates.forEach((state) => {
      if (state in token && token[state] === undefined)
        warn(`${prefix} - Missing state "${state}"`);
    });
  }

  Object.entries(token).forEach(([key, val]) => {
    if (typeof val === "object" && val !== null && !Array.isArray(val)) {
      lintToken(val, [...pathArr, key], filePath);
    }
  });
}

function getAllJsonFiles(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllJsonFiles(filePath));
    } else if (file.endsWith(".json")) {
      results.push(filePath);
    }
  });
  return results;
}

export function VitePluginTokenLinter(options?: { source?: string }): Plugin {
  const sourcePath = options?.source || path.resolve(process.cwd(), "tokens");
  return {
    name: "vite-plugin-token-linter",
    enforce: "pre",
    buildStart() {
      if (!fs.existsSync(sourcePath)) {
        warn(`Tokens source folder not found: ${sourcePath}`);
        return;
      }
      const files = getAllJsonFiles(sourcePath);
      files.forEach((file) => {
        const raw = fs.readFileSync(file, "utf-8");
        let tokens: Record<string, Token>;
        try {
          tokens = JSON.parse(raw);
        } catch (e) {
          error(`Failed to parse JSON file ${file}: ${e}`);
          return;
        }
        info(`Linting tokens: ${file}`);
        Object.entries(tokens).forEach(([key, token]) =>
          lintToken(token, [key], file)
        );
      });
    },
    configureServer(server) {
      const watcher = server.watcher;
      const files = getAllJsonFiles(sourcePath);
      watcher.add(files);
      watcher.on("change", (file) => {
        if (files.includes(file)) {
          info(`Tokens file changed: ${file}, running linter...`);
          const raw = fs.readFileSync(file, "utf-8");
          let tokens: Record<string, Token>;
          try {
            tokens = JSON.parse(raw);
          } catch (e) {
            error(`Failed to parse JSON file ${file}: ${e}`);
            return;
          }
          Object.entries(tokens).forEach(([key, token]) =>
            lintToken(token, [key], file)
          );
        }
      });
    },
  };
}
