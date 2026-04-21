import Image from 'next/image';

export const MenuIcon = ({ src, size =32 }: { src: string, size?:number }) => (
  <Image
    src={src}
    alt="icon"
    width={size}
    height={size}
    loading="lazy"
    draggable={false}
    className="group-hover:rotate-6 transition-all"
  />
);
