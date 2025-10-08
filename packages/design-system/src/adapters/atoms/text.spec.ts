import tokens from "@/tokens";

import { textVariants, textModes, textTones, textStates } from "./text";

describe("text adapter", () => {
  test("exports all variants of the text", () => {
    expect(textVariants).toEqual(Object.keys(tokens.typography.styles));
  });

  test("exports modes from the light theme", () => {
    expect(textModes).toEqual(
      Object.keys(tokens.themes.light.contracts.interactive.label)
    );
  });

  test("exports tones for neutral (interactive.label)", () => {
    expect(textTones).toEqual(
      Object.keys(tokens.themes.light.contracts.interactive.label.neutral)
    );
  });

  test("exports states for primary (interactive.label)", () => {
    expect(textStates).toEqual(
      Object.keys(
        tokens.themes.light.contracts.interactive.label.neutral.primary
      )
    );
  });
});
