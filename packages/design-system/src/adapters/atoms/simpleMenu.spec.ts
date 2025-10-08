import tokens from "@/tokens";

import { simpleMenuVariants, simpleMenuSizes } from "./simpleMenu";

describe("simpleMenu adapter", () => {
  test("exports all variants of the simpleMenu", () => {
    expect(simpleMenuVariants).toEqual(
      Object.keys(tokens.components.atoms.simpleMenu)
    );
  });

  test("exports sizes for variant default", () => {
    expect(simpleMenuSizes).toEqual(
      Object.keys(tokens.components.atoms.simpleMenu.default)
    );
  });
});
