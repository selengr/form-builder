import React from "react";
import Link from "next/link";
import Image, {StaticImageData} from "next/image";
import {IoIosArrowBack} from "react-icons/io";

interface StaticLink {
    id: number;
    title: string;
    icon: string;
    link: string;
    order: number;
}

interface MenuItemData {
    id: number;
    title: string;
    icon: string | StaticImageData;
    link: string;
    order: number;
    isStatic: boolean;
}

interface IProps {
    menuLinks: any[];
    onItemClick?: () => void
}

const STATIC_LINKS: StaticLink[] = [
    { id: 7, title: "فرم‌های عمومی", icon: "formsMoney.svg", link: "/public-form", order: 7 },
    { id: 8, title: "آموزش", icon: "tour.svg", link: "/underconstruction", order: 8 },
    { id: 9, title: "سوالات پرتکرار", icon: "faq.svg", link: "/faq", order: 9 },
    { id: 10, title: "قوانین و مقررات", icon: "laws.svg", link: "/terms", order: 10 },
    { id: 11, title: "ارتباط با ما", icon: "contact-us.svg", link: "/underconstruction", order: 11 },
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
    icon: string | StaticImageData;
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
                <Image src={`/api/images?folder=menu&file=${icon}`} alt='icon' width={32} height={32} priority draggable={false} className={'group-hover:rotate-6 transition-all'} />
                <p className="text-[14px] text-black font-bold">{title}</p>
            </div>
            <IoIosArrowBack size="1.3rem" color="#292D32" className={"group-hover:ml-0.5 transition-all"} />
        </Link>
    </div>
);

const MenuList: React.FC<IProps> = ({ menuLinks, onItemClick }) => {
    const serverLinks = menuLinks?.map((item) => ({
        id: item.id,
        title: item.text,
        icon: item.icon,
        link: item.a_attr?.href ?? "#",
        order: parseInt(item.data.order, 10),
        isStatic: false,
    }));

    const staticLinks = STATIC_LINKS.map((item) => ({
        id: item.id,
        title: item.title,
        icon: item.icon,
        link: item.link,
        order: item.order,
        isStatic: true,
    }));

    const allLinks = [...serverLinks, ...staticLinks];

    const sortedLinks = allLinks.sort((a, b) => a.order - b.order);

    return (
        <>
            {sortedLinks.map((item) => (
                <MenuItem
                    key={item.id}
                    id={item.id}
                    href={item.link}
                    icon={item.icon}
                    title={item.title}
                    onClick={onItemClick}
                    isStatic={item.isStatic}
                />
            ))}
        </>
    );
};

export default MenuList;