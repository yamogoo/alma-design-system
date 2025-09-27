import localforage from "localforage";

export type ErrorSeverity = "fatal" | "error" | "warn" | "info";

export interface FrontendErrorLog {
  id: string;
  message: string;
  name?: string;
  stack?: string;
  source?: string;
  lineno?: number;
  colno?: number;
  timestamp: string;
  url: string;
  severity: ErrorSeverity;
  tags?: Record<string, string | number | boolean>;
  extra?: Record<string, unknown>;
  user?: { id?: string; anonId?: string };
  env: {
    appVersion?: string;
    userAgent?: string;
    language?: string;
    platform?: string;
    online?: boolean;
  };
}

type QueueItem = {
  log: FrontendErrorLog;
  retries: number;
  nextAt: number; // ms timestamp: when try again
};

const LF_KEY = "error-queue-v1";
const STORE = localforage.createInstance({
  name: "app-logs",
  storeName: "errors",
});

const CONFIG = {
  ENDPOINT:
    import.meta.env.VITE_LOG_ENDPOINT || "http://localhost:5043/api/logs",
  BATCH_SIZE: Number(import.meta.env.VITE_LOG_BATCH_SIZE || 20),
  MAX_RETRY: Number(import.meta.env.VITE_LOG_MAX_RETRY || 5),
  SAMPLE_DEFAULT: Number(import.meta.env.VITE_LOG_SAMPLE_DEFAULT ?? 1),
  SAMPLE_NON_FATAL: Number(import.meta.env.VITE_LOG_SAMPLE_NON_FATAL ?? 1),
  VITE_APP_VERSION: import.meta.env.VITE_APP_VERSION || undefined,
};

const JITTER = () => Math.floor(Math.random() * 300);

function backoff(retries: number) {
  // exponential backoff with jitter: 0.5s, 1s, 2s, 4s, ...
  const base = 500 * Math.pow(2, Math.min(retries, 8));
  return base + JITTER();
}

async function loadQueue(): Promise<QueueItem[]> {
  const raw = await STORE.getItem<string>(LF_KEY);
  try {
    return raw ? (JSON.parse(raw) as QueueItem[]) : [];
  } catch {
    return [];
  }
}

async function saveQueue(q: QueueItem[]) {
  await STORE.setItem(LF_KEY, JSON.stringify(q));
}

function hashString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return String(h >>> 0);
}

function topFrame(stack?: string) {
  if (!stack) return "";
  const line = stack.split("\n").find((l) => l.includes("at "));
  return line || stack.split("\n")[0] || "";
}

function redact(text?: string) {
  if (!text) return text;
  // mask tokens, email, bearer, query params with token, password, etc.
  return text
    .replace(/Bearer\s+[A-Za-z0-9\-\._~\+\/]+=*/gi, "Bearer [REDACTED]")
    .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, "[email]")
    .replace(
      /([?&](?:token|password|secret|api_key)=[^&#]+)/gi,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (_m) => "[REDACTED_PARAM]"
    )
    .slice(0, 20_000); // limit the size
}

function shouldSample(severity: ErrorSeverity) {
  const r = Math.random();
  if (severity === "fatal" || severity === "error")
    return r < CONFIG.SAMPLE_DEFAULT;
  return r < CONFIG.SAMPLE_NON_FATAL;
}

function buildLog(
  err: unknown,
  severity: ErrorSeverity,
  extra?: Record<string, unknown>
): FrontendErrorLog {
  const e = err instanceof Error ? err : new Error(String(err));
  const msg = e.message || String(err);
  const st = e.stack;

  // dedup key
  const sig = `${msg}|${topFrame(st)}`;
  const id = hashString(sig);

  return {
    id,
    message: redact(msg)!,
    name: e.name,
    stack: redact(st),
    timestamp: new Date().toISOString(),
    url: location.href,
    severity,
    tags: { route: location.pathname },
    extra,
    env: {
      appVersion: CONFIG.VITE_APP_VERSION,
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      online: navigator.onLine,
    },
  };
}

// public API

export async function logError(
  err: unknown,
  options?: {
    severity?: ErrorSeverity;
    tags?: Record<string, any>;
    extra?: Record<string, any>;
  }
) {
  const severity = options?.severity ?? "error";
  if (!shouldSample(severity)) return;

  const base = buildLog(err, severity, options?.extra);
  base.tags = { ...base.tags, ...options?.tags };

  // Ignore browser extensions / third-party script errors
  if (
    base.stack &&
    /extensions\/|chrome-extension:|moz-extension:/.test(base.stack)
  )
    return;

  const item: QueueItem = {
    log: base,
    retries: 0,
    nextAt: Date.now(),
  };

  const q = await loadQueue();
  // deduplication of recent (do not add identical id in a row)
  const last = q[q.length - 1];
  if (!last || last.log.id !== base.id) {
    q.push(item);
    await saveQueue(q);
  }

  if (navigator.onLine) flushSoon();
}

let flushScheduled = false;
function flushSoon() {
  if (flushScheduled) return;
  flushScheduled = true;
  setTimeout(async () => {
    flushScheduled = false;
    await flush();
  }, 200);
}

async function takeBatch(now: number): Promise<QueueItem[]> {
  const q = await loadQueue();
  const ready = q.filter((it) => it.nextAt <= now).slice(0, CONFIG.BATCH_SIZE);
  return ready;
}

async function removeItems(ids: string[]) {
  const q = await loadQueue();
  const rest = q.filter((it) => !ids.includes(it.log.id));
  await saveQueue(rest);
}

async function updateItems(items: QueueItem[]) {
  // merge with queue: replace by id
  const q = await loadQueue();
  const map = new Map(q.map((it) => [it.log.id, it]));
  for (const it of items) map.set(it.log.id, it);
  await saveQueue(Array.from(map.values()));
}

async function sendBatch(logs: FrontendErrorLog[]) {
  const res = await fetch(CONFIG.ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ logs }),
    keepalive: true, // send even when the tab is closed
  });
  if (!res.ok) throw new Error(`Log endpoint ${res.status}`);
}

export async function flush(): Promise<void> {
  if (!navigator.onLine) return;

  const now = Date.now();
  const batch = await takeBatch(now);
  if (batch.length === 0) return;

  try {
    await sendBatch(batch.map((b) => b.log));
    await removeItems(batch.map((b) => b.log.id));
  } catch {
    const bumped = batch
      .map<QueueItem>((it) => {
        const retries = it.retries + 1;
        return {
          ...it,
          retries,
          nextAt: Date.now() + backoff(retries),
        };
      })
      .filter((it) => it.retries <= CONFIG.MAX_RETRY);

    await updateItems(bumped);
  } finally {
    setTimeout(flush, 1000);
  }
}

export function initErrorLogger() {
  window.onerror = (message, source, lineno, colno, error) => {
    logError(error || message, {
      severity: "error",
      extra: { source, lineno, colno },
    });
    return false;
  };

  window.addEventListener("unhandledrejection", (event) => {
    logError(event.reason, {
      severity: "error",
      tags: { type: "unhandledrejection" },
    });
  });

  window.addEventListener("online", flush);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") flushSoon();
  });

  setInterval(() => {
    if (navigator.onLine) flush();
  }, 30_000);
}

export function logWarn(err: unknown, extra?: Record<string, any>) {
  logError(err, { severity: "warn", extra });
}
export function logInfo(msg: string, extra?: Record<string, any>) {
  logError(new Error(msg), { severity: "info", extra });
}
export function logFatal(err: unknown, extra?: Record<string, any>) {
  logError(err, { severity: "fatal", extra });
}
