import FooterTab from "@/components/FooterTab/Footer";
import MainSidebar from "@/components/MainSidebar/MainSidebar";
import TopAppBar from "@/components/TopAppBar/TopAppBar";
import { useResponsive } from "@/hooks/useResponsive";
import { usePathname } from "next/navigation";

export default function MainPanel({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isMobile = useResponsive("down", "md");
  const path = usePathname();

  return (
    <div
      className="flex w-full"
      style={{
        height: "100vh",
      }}
    >
      {isMobile && path === "/" ? (
        <div className="w-full flex flex-col bg-[#f7f7ff]">
          <TopAppBar title="" />
          <div className="w-full">{children}</div>
          <FooterTab />
        </div>
      ) : isMobile ? (
        <div className="w-full flex flex-col bg-white">
          <div className="w-full">{children}</div>
        </div>
      ) : (
        <>
          <MainSidebar />
          <div className="w-full">{children}</div>
        </>
      )}
    </div>
  );
}
