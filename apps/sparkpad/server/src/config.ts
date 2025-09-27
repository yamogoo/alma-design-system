import dotenv from "dotenv";
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5042),
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-me",
  corsOrigins: (process.env.CORS_ORIGINS || "*")
    .split(",")
    .map((s) => s.trim()),
  useCookieAuth: (process.env.AUTH_COOKIE || "true") === "true",
  dbFile: process.env.DB_FILE || "./sparkpad.sqlite",
};
