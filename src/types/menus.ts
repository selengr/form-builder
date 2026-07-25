import { StaticImageData } from "next/image";

export interface IStaticLink {
  id: string | number;
  title: string;
  icon: string | StaticImageData;
  link: string;
  order: number;
}

export interface IServerMenuItem {
  id: string | number;
  text: string;
  icon: string | StaticImageData;
  a_attr?: { href?: string };
  data: {
    order: string;
    langId?: string;
  };
}

export interface IMenuItemData {
  id: string | number;
  title: string;
  icon: string | StaticImageData;
  link: string;
  order: number;
  isStatic?: boolean;
  langId?: string;
  children?: IMenuItemData[];
}

export interface IMenuItemProps {
  id: string | number;
  href: string;
  icon: string | StaticImageData;
  title: string;
  onClick?: () => void;
  isStatic?: boolean;
  hasChildren?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
  children?: IMenuItemData[];
}

export interface ISubMenuItemProps {
  id: string | number;
  href: string;
  icon: string | StaticImageData;
  title: string;
  onClick?: () => void;
}

export interface IMenuListProps {
  menuLinks: IServerMenuItem[];
  onItemClick?: () => void;
}
