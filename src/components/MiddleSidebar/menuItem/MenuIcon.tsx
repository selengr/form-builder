import Image from "next/image";
import clsx from "clsx";

type MenuIconProps = {
  src: string;
  size?: number;
  className?: string;
};

export const MenuIcon = ({
  src,
  size,
  className,
}: MenuIconProps) => (
  <Image
    src={src}
    alt="icon"
    priority
    draggable={false}
    width={0}
    height={0}
    className={clsx(
      "h-7 w-7 sm:h-8 sm:w-8 transition-all duration-300 group-hover:rotate-6 group-active:rotate-6",
      size && `w-[${size}px] h-[${size}px]`,
      className
    )}
  />
);

export const SubMenuIcon = ({
  src,
  size,
  className
}: MenuIconProps) => (
  <Image
    src={src}
    alt="icon"
    priority
    draggable={false}
    width={0}
    height={0}
    className={clsx(
      "h-6 w-6 sm:h-6 sm:w-6 transition-all duration-300 group-hover:rotate-6 group-active:rotate-6",
      size && `w-[${size}px] h-[${size}px]`,
      className
    )}
  />
);