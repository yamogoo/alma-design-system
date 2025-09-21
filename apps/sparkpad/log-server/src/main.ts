import express from "express";
import cors from "cors";
import helmet from "helmet";
import * as dotenv from "dotenv";

import { postLogs } from "./logs";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "256kb" }));

app.post("/api/logs", postLogs);

const PORT = process.env.PORT || 5043;

app.listen(PORT, () => {
  console.log("log server listening on port", PORT);
});
