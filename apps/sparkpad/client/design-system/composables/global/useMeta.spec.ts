import { describe, test, expect } from "vitest";
import { useMeta } from "./useMeta";

describe("useMeta", () => {
  const content = "Content";

  test("should set meta tag to html head", () => {
    useMeta("author", content);
    const isMetaExists = document.querySelector(`meta[name="author"]`);
    expect(isMetaExists).toBeTruthy();
  });

  test("should set meta content attr", () => {
    useMeta("author", content);
    const el = document.querySelector(`meta[name="author"]`);
    const contentAttr = el?.getAttribute("content");
    expect(contentAttr).toBe(content);
  });
});
