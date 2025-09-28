import type locales from "@/locales";

export type Locale = keyof typeof locales.app;

export type LocaleSchema = typeof locales.app.en;
