"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import ServicesNotActive from "@/../public/images/home-page/services-not.svg";
import ServicesActive from "@/../public/images/home-page/services-active.svg";
import MessagesNotActive from "@/../public/images/home-page/messages-not.svg";
import GroupNotActive from "@/../public/images/home-page/Group-not.svg";
import SearchNotActive from "@/../public/images/home-page/search-not.svg";
import MapNotActive from "@/../public/images/home-page/map-not.svg";

const sidebarData = [
  {
    id: 2,
    title: "گفتگو",
    active: "",
    notActive: MessagesNotActive,
    link: "#",
  },
  { id: 3, title: "رسان", active: "", notActive: GroupNotActive, link: "#" },
  {
    id: 4,
    title: "جست و جو",
    active: "",
    notActive: SearchNotActive,
    link: "#",
  },
  { id: 5, title: "نقشه", active: "", notActive: MapNotActive, link: "#" },
];

export default function MenuSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const activeIcons = (link: string) => {
    const newPath = pathname.split("/");
    if (newPath[2] === link) return true;
    return false;
  };

  return (
    <div className="flex flex-col gap-8 pt-[82px] px-0">
      <div
        className="flex flex-col gap-[5px] items-center cursor-pointer"
        onClick={() => router.push("/")}
      >
        <div>
          <Image
            src={
              pathname.split("/").length === 2
                ? ServicesActive
                : ServicesNotActive
            }
            width={28}
            height={28}
            alt="logo-side-bar"
          />
        </div>
        <div>
          <p
            className={`text-[9px] text-white ${
              pathname.split("/").length === 2 ? "#2CDFC9" : "#F2F4F8"
            }`}
          >
            خانه
          </p>
        </div>
      </div>
      {sidebarData?.map((item) => {
        const { id, active, notActive, title, link } = item;
        return (
          <div
            key={id}
            className="flex flex-col gap-[5px] items-center cursor-pointer"
            onClick={() => router.push(`/${link}`)}
          >
            <div>
              <Image
                src={activeIcons(link) ? active : notActive}
                width={28}
                height={28}
                alt="logo-side-bar"
              />
            </div>
            <div>
              <p
                className={`text-[9px] text-white ${
                  activeIcons(link) ? "#2CDFC9" : "#F2F4F8"
                }`}
              >
                {title}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
