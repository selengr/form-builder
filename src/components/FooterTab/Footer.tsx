import Image from "next/image";
import { FooterData } from "./Footer.constant";
import { usePathname, useRouter } from "next/navigation";
import ServicesNotActive from "@/../public/images/home-page/services-not.svg";
import ServicesActive from "@/../public/images/home-page/services-active.svg";

function FooterTab() {
  const pathname = usePathname();
  const router = useRouter();
  const activeIcons = (link: string) => {
    const newPath = pathname.split("/");
    if (newPath[2] === link) return true;
    return false;
  };

  return (
    <div>
      <div className="w-[90%] h-[77px] bg-[#070433] text-white flex justify-center items-center py-2 fixed bottom-10 left-1/2 transform -translate-x-1/2 rounded-[28px] shadow-lg z-50">
        <div className="flex justify-around w-full px-[17px]">
          <div
            className="flex flex-col justify-center items-center gap-[5px]"
            onClick={() => router.push("/")}
          >
            <div>
              <Image
                src={
                  pathname.split("/").length === 2
                    ? ServicesActive
                    : ServicesNotActive
                }
                width={24}
                height={24}
                alt="footer-img"
              />
            </div>
            <div className="text-center">
              <p
                className={`text-[11px] text-[${
                  pathname.split("/").length === 2 ? "#2CDFC9" : "#F2F4F8"
                }]`}
              >
                خانه
              </p>
            </div>
          </div>
          {FooterData?.map((item) => {
            const { id, active, notActive, title, link } = item;
            return (
              <div
                key={id}
                className="flex flex-col items-center justify-center gap-[5px]"
                onClick={() => router.push(`/${link}`)}
              >
                <div>
                  <Image
                    src={activeIcons(link) ? active : notActive}
                    width={24}
                    height={24}
                    alt="footer-img"
                  />
                </div>
                <div className="text-center">
                  <p
                    className={`text-[11px] text-[${
                      pathname.split("/").length === 2 ? "#2CDFC9" : "#F2F4F8"
                    }]`}
                  >
                    {title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default FooterTab;
