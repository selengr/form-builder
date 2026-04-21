import Image from 'next/image';

export const MenuIcon = ({ src }: { src: string }) => (
  <Image
    src={src}
    alt="icon"
    width={32}
    height={32}
    loading="lazy"
    draggable={false}
    className="group-hover:rotate-6 transition-all"
  />
);
