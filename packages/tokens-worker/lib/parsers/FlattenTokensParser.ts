// Portions of this file were developed with the assistance of AI tools (ChatGPT).

import fs from "node:fs";
import path from "node:path";

export interface FlattenTokensParserOptions {
  source: string;
  outDir: string;
}

export interface TokenMeta {
  description?: string;
  [key: string]: any;
}

export interface TokenValueNode {
  value: string | number | boolean;
  type?: string;
  unit?: string;
  meta?: TokenMeta;
}

export type TokenNode = {
  [key: string]: TokenValueNode | TokenNode | string | number | boolean;
};

export class FlattenTokensParser {
  source: string;
  outDir: string;

  constructor(options: FlattenTokensParserOptions) {
    this.source = options.source;
    this.outDir = options.outDir;
  }

  flattenTokens(obj: TokenNode, prefix = ""): Record<string, any> {
    let result: Record<string, any> = {};

    for (const key in obj) {
      if (!obj.hasOwnProperty(key)) continue;

      const value = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (value && typeof value === "object" && "value" in value) {
        result[newKey] = {
          value: value.value,
          type: value.type || "unknown",
          unit: value.unit,
          description:
            value.meta &&
            typeof value.meta === "object" &&
            "description" in value.meta
              ? (value.meta as TokenMeta).description
              : undefined,
        };
      } else if (value && typeof value === "object") {
        Object.assign(result, this.flattenTokens(value, newKey));
      } else {
        result[newKey] = {
          value: value,
          type: typeof value,
        };
      }
    }

    return result;
  }

  async buildAndParse() {
    const files = fs.readdirSync(this.source);

    for (const file of files) {
      const filePath = path.join(this.source, file);
      if (fs.statSync(filePath).isFile() && file.endsWith(".json")) {
        const raw = fs.readFileSync(filePath, "utf-8");
        const tokens = JSON.parse(raw);
        const flatTokens = this.flattenTokens(tokens);

        const outFile = path.join(
          this.outDir,
          file.replace(".json", ".flat.json")
        );
        fs.mkdirSync(this.outDir, { recursive: true });
        fs.writeFileSync(outFile, JSON.stringify(flatTokens, null, 2));
        console.log(`[tokens-parser] ✅ Parsed: ${file}`);
      }
    }
  }
}
