import { getPathSegment } from "./getPathSegment";

describe("getPathSegment", () => {
  test("returns the correct segment at level 0", () => {
    expect(getPathSegment("/settings/language", 0)).toBe("settings");
  });

  test("returns the correct segment at level 1", () => {
    expect(getPathSegment("/settings/language", 1)).toBe("language");
  });

  test("returns empty string for out-of-bounds level", () => {
    expect(getPathSegment("/settings/language", 2)).toBe("");
  });

  test("returns empty string for root path", () => {
    expect(getPathSegment("/", 0)).toBe("");
  });

  test("returns empty string for empty path", () => {
    expect(getPathSegment("", 0)).toBe("");
  });

  test("handles multiple slashes", () => {
    expect(getPathSegment("//settings///language/", 1)).toBe("language");
  });

  test("returns empty string for negative level", () => {
    expect(getPathSegment("/settings/language", -1)).toBe("");
  });

  test("works with longer paths", () => {
    expect(getPathSegment("/a/b/c/d/e", 3)).toBe("d");
  });
});
