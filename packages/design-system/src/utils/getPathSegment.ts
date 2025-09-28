export const getPathSegment = <T extends string>(
  path: T,
  level: number | [number, number]
): string => {
  if (!path) return "";

  const segments = path.split("/").filter(Boolean);

  if (typeof level === "number") {
    if (level < 0) return "";
    return segments[level] ?? "";
  }

  const [start, end] = level;
  if (start < 0 || end < start) return "";

  return segments.slice(start, end + 1).join("/");
};
