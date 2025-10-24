import type { IconComponentProps } from "@/components/atoms/icons/Icon";
import type { ListItemProps } from "@/components/atoms/list/ListItem";

export interface IMenuitem<T> extends Partial<IconComponentProps> {
  id: string;
  label: string;
  value: T;
}

export type MenuItemProps = Omit<ListItemProps, "variant">;
