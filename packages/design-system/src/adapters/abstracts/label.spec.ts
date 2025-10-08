import tokens from "@/tokens";

import { abstractLabelModes, abstractLabelTones } from "./label";

describe("abstracLabel adapter", () => {
  test("exports modes from the light theme", () => {
    expect(abstractLabelModes).toEqual(
      Object.keys(tokens.themes.light.contracts.interactive.label)
    );
  });
  test("exports tones for neutral", () => {
    expect(abstractLabelTones).toEqual(
      Object.keys(tokens.themes.light.contracts.interactive.label.neutral)
    );
  });
});
