import dotenv from "dotenv";
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5042),
  dbPath: process.env.DB_PATH || "./sparkpad.sqlite",
  jwtSecret:
    process.env.JWT_SECRET || "34oijoK*&&#0_erd_enroiq3ndBKUIHOD@JDEKLW",
  corsOrigins: (process.env.CORS_ORIGINS || "*")
    .split(",")
    .map((s) => s.trim()),
  useCookieAuth: (process.env.AUTH_COOKIE || "true") === "true",
};
