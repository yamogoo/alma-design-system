export interface IButtonEmmitedData {
  isPressed?: boolean;
}

export interface ButtonEvent extends CustomEvent<IButtonEmmitedData> {}
