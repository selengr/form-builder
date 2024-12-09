import Image from "next/image";
import Logo from "@/../public/images/home-page/psya-logo.svg";
import Additem from "@/../public/images/home-page/additem.svg";
import SidebarRoleSelection from "../SidebarRoleSelection/SidebarRoleSelection";
import { IoIosArrowDown } from "react-icons/io";
import Link from "next/link";

export default function MiddleSidebar() {

  return (
    <div className="min-w-[400px] w-[400px] min-h-screen bg-white px-5 gap-8 flex flex-col py-5">
      <div className="w-full flex flex-col gap-5 items-center">
        <Image priority src={Logo} width={111} height={38} alt="Psya-Logo" />
        <div className="flex flex-col items-center w-full gap-5">
          <SidebarRoleSelection />
          <div className="w-full pr-3 flex flex-col gap-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="gap-4 w-ful border-b-[1px] border-b-[#DDE1E6]"
              >
                <Link
                  href="/builder"
                  className="w-full h-full pb-3 flex items-center justify-between "
                >
                  <div className="flex items-center justify-between gap-2">
                    <Image src={Additem} alt="" width={32} height={32} />
                    <p className="text-[14px] text-black font-bold">فرم‌ساز</p>
                  </div>
                  <div>
                    <IoIosArrowDown
                      size="1.3rem"
                      color="#292D32"
                      width={32}
                      height={32}
                      className="rotate-90"
                    />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

