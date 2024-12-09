import Image from "next/image";
import HeaderDesktop from "@/../public/images/home-page/new-mresalt-header.svg";
import { useRouter } from "next/navigation";

export default function MiddleSidebar() {
  const router = useRouter();

  return (
    <div className="min-w-[400px] w-[400px] min-h-screen bg-[#F7F7FF] px-5 gap-8 flex flex-col">
      <div className="my-5 w-full flex justify-center align-middle">
        <Image
          src={"/images/logo/LOGO.svg"}
          alt="header"
          width={5}
          height={5}
          className="w-32"
        />
      </div>
      <div className="w-full flex flex-col gap-3 bg-[#F2F4F8] h-20 rounded-2xl">
        <span>شرکت فرداپ</span>

        {/*         
        <button
          className="h-[56px] bg-[#1758BA] shadow-none rounded-lg text-white text-[16px] font-bold"
          onClick={() => {
            router.push("/builder");
          }}
        >
          فرم ساز
        </button> */}
      </div>
    </div>
  );
}
