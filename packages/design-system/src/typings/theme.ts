import tokenThemes from "@/tokens/output/themes.json";

export type Theme = keyof typeof tokenThemes;
export type Themes = Array<Theme>;

export type SystemTheme = "light" | "dark";
