import type { InputType } from "storybook/internal/types";

export const enumOptions = <T>(arr: readonly T[]): InputType => ({
  control: "select",
  options: arr,
});

export const booleanOptions = (defaultValue: boolean): InputType => ({
  control: "boolean",
  type: "boolean",
  defaultValue,
});
