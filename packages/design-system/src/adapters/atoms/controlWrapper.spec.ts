import tokens from "@/tokens";

import { controlWrapperVariants } from "./controlWrapper";

describe("controlWrapper adapter", () => {
  test("exports all variants of the controlWrapper", () => {
    expect(controlWrapperVariants).toEqual(
      Object.keys(tokens.components.atoms.controlWrapper)
    );
  });
});
