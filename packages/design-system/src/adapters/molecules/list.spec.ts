import { surfaceModes, surfaceTones } from "@/adapters/atoms/surface";

import { listVariants, listSizes, listModes, listTones } from "./list";
import { groupSizes, groupVariants } from "@/adapters/molecules/group";

describe("list adapter", () => {
  test("exports all variants of the list", () => {
    expect(listVariants).toEqual(groupVariants);
  });

  test("exports sizes for variant default", () => {
    expect(listSizes).toEqual(groupSizes);
  });

  test("exports modes from surface modes", () => {
    expect(listModes).toEqual(surfaceModes);
  });

  test("exports tones from surface tones", () => {
    expect(listTones).toEqual(surfaceTones);
  });
});
