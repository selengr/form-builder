import Link from "next/link";
import Image, {StaticImageData} from "next/image";
import {IoIosArrowBack} from "react-icons/io";
// public
import LAWS from "@/../public/images/home-page/menu/laws.svg";
import ContactUs from "@/../public/images/home-page/menu/contact-us.svg";
import FAQ from "@/../public/images/home-page/menu/faq.svg";
import Tour from "@/../public/images/home-page/menu/tour.svg";
import Forms from "@/../public/images/home-page/menu/formsMoney.svg";
import React from "react";


interface StaticLink {
    id: number;
    title: string;
    icon: StaticImageData;
    link: string;
  }


  interface IProps {
    menuLinks: any[];
    onItemClick?: () => void
  }

  const STATIC_LINKS: StaticLink[] = [
    { id: 2, title: "فرم‌های عمومی", icon: Forms, link: "/public-form" },
    { id: 5, title: "آموزش", icon: Tour, link: "/underconstruction" },
    { id: 6, title: "ارتباط با ما", icon: ContactUs, link: "/underconstruction" },
    { id: 8, title: "سوالات پرتکرار", icon: FAQ,link: "/underconstruction"},
    { id: 9, title: "قوانین و مقررات", icon: LAWS, link: "/underconstruction" },
  ];

const MenuItem = ({
                    id,
                    href,
                    icon,
                    title,
                    onClick,
                    isStatic = false,
                  }: {
  id: string | number;
  href: string;
  icon: string;
  title: string;
  onClick?: () => void;
  isStatic?: boolean;
}) => (
  <div className="gap-1 w-full border-b border-[#DDE1E6] py-2 rounded-sm duration-300 group" key={id} style={{userSelect:"none"}}>
    <Link
      href={href}
      onClick={onClick}
      className="w-full flex items-center justify-between"
    >
      <div className="flex items-center gap-2">
        <Image
          src={isStatic ? icon : `/images/home-page/menu/${icon}`}
          alt="icon"
          width={32}
          height={32}
          priority
          draggable={false}
          className={"group-hover:rotate-6 transition-all"}
        />
        <p className="text-[14px] text-black font-bold">{title}</p>
      </div>
      <IoIosArrowBack size="1.3rem" color="#292D32" className={"group-hover:ml-0.5 transition-all"} />
    </Link>
  </div>
);

const MenuList: React.FC<IProps> = ({ menuLinks, onItemClick }) => {
  return (
    <>
      {menuLinks?.map((item) => (
        <MenuItem
          key={`menu-${item.id}`}
          id={`menu-${item.id}`}
          href={item.a_attr?.href ?? "#"}
          icon={item.icon}
          title={item.text}
          onClick={onItemClick}
        />
      ))}

      {STATIC_LINKS.map((item) => (
        <MenuItem
          key={`static-${item.id}`}
          id={`static-${item.id}`}
          href={item.link}
          // @ts-ignore
          icon={item.icon}
          title={item.title}
          onClick={onItemClick}
          isStatic
        />
      ))}
    </>
  );
};

export default MenuList;
