import type { Request, Response } from "express";
import { z } from "zod";
import { appendFile } from "fs/promises";
import path from "path";

const LogSchema = z.object({
  id: z.string(),
  message: z.string(),
  name: z.string().optional(),
  stack: z.string().optional(),
  timestamp: z.string(),
  url: z.string(),
  severity: z.enum(["fatal", "error", "warn", "info"]),
  tags: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
  extra: z.record(z.any()).optional(),
  user: z
    .object({ id: z.string().optional(), anonId: z.string().optional() })
    .optional(),
  env: z.object({
    appVersion: z.string().optional(),
    userAgent: z.string().optional(),
    language: z.string().optional(),
    platform: z.string().optional(),
    online: z.boolean().optional(),
  }),
});

const BodySchema = z.object({
  logs: z.array(LogSchema).min(1).max(500),
});

const LOG_FILE = path.resolve(process.cwd(), "logs.txt");

export async function postLogs(req: Request, res: Response) {
  const parsed = BodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const logs = parsed.data.logs;

  // Jitter filter
  const filtered = logs.filter(
    (l) =>
      !(
        l.stack &&
        /(extensions\/|chrome-extension:|moz-extension:)/.test(l.stack)
      )
  );

  try {
    const lines = filtered.map((l) => JSON.stringify(l)).join("\n") + "\n";
    await appendFile(LOG_FILE, lines, "utf-8");

    for (const l of filtered) {
      console.log(`[${l.severity}] ${l.timestamp} ${l.message}`);
    }

    res.status(204).end();
  } catch (err) {
    console.error("Failed to write logs to file:", err);
    res.status(500).json({ error: "Failed to save logs" });
  }
}
