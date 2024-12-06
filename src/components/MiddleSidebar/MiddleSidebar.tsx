import Image from "next/image";
import HeaderDesktop from "@/../public/images/home-page/new-mresalt-header.svg";
import { useRouter } from "next/navigation";

export default function MiddleSidebar() {
  const router = useRouter();

  return (
    <div className="min-w-[400px] w-[400px] min-h-screen bg-[#F7F7FF] px-5 gap-8 flex flex-col">
      <div className="mt-4 w-full">
        <Image
          src={HeaderDesktop}
          alt="header"
          width={100}
          height={100}
          className="w-full"
        />
      </div>
      <div className="w-full flex flex-col gap-4">
        <button
          className="h-[56px] bg-[#1758BA] shadow-none rounded-lg text-white text-[16px] font-bold"
          onClick={() => {
            router.push("/builder");
          }}
        >
          فرم ساز
        </button>
      </div>
    </div>
  );
}
