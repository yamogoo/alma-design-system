import "module-alias/register";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { config } from "./config";

import { notFound, errorHandler } from "./middleware";

import { authRoutes, groupRoutes, fileRoutes } from "./routes";

async function boot() {
  const app = express();
  app.use(express.json({ limit: "10mb" }));
  app.use(cookieParser());
  app.use(cors({ origin: (origin, cb) => cb(null, true), credentials: true }));

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.use("/api/auth", authRoutes);
  app.use("/api/groups", groupRoutes);
  app.use("/api/files", fileRoutes);

  app.use(notFound);
  app.use(errorHandler);

  app.listen(config.port, () => {
    console.log(
      `[sparkpad-server] listening on http://localhost:${config.port}`
    );
  });
}

boot().catch((e) => {
  console.error("Failed to boot server:", e);
  process.exit(1);
});
