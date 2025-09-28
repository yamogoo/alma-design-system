export interface IButtonEmmitedData {
  isPressed?: boolean;
}

export type ButtonEvent = CustomEvent<IButtonEmmitedData>;
