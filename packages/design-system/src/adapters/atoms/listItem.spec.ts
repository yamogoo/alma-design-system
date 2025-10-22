import tokens from "@/tokens";

import {
  listItemVariants,
  listItemSizes,
  listItemModes,
  listItemTones,
} from "./listItem";

describe("listItem adapter", () => {
  test("exports all variants of the listItem", () => {
    expect(listItemVariants).toEqual(
      Object.keys(tokens.components.atoms.listItem)
    );
  });

  test("exports sizes for variant 'list'", () => {
    expect(listItemSizes).toEqual(
      Object.keys(tokens.components.atoms.listItem.list)
    );
  });

  test("exports modes from the light theme", () => {
    expect(listItemModes).toEqual(
      Object.keys(tokens.themes.light.components.atoms.listItem)
    );
  });

  test("exports tones for neutral", () => {
    expect(listItemTones).toEqual(
      Object.keys(tokens.themes.light.components.atoms.listItem.neutral)
    );
  });
});
