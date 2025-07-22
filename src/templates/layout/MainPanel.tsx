import FooterTab from "@/components/FooterTab/Footer";
import MainSidebar from "@/components/MainSidebar/MainSidebar";
import TopAppBar from "@/components/TopAppBar/TopAppBar";
import {usePathname} from "next/navigation";

export default function MainPanel({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const path = usePathname();

  return (
    <div className="flex w-full h-screen">
      <div className="hidden md:flex">
        <MainSidebar />
      </div>

      <div className="flex flex-col w-full overflow-y-auto">
        {path === "/" && (
          <div className="md:hidden block mt-[60px] ">
            <TopAppBar title="" />
          </div>
        )}

        <div className="w-full flex flex-col lg:h-auto h-full lg:flex-row overflow-y-auto">
          {children}
        </div>

        {path === "/" && (
          <div className="md:hidden block">
            <FooterTab />
          </div>
        )}
      </div>
    </div>
  );
}
