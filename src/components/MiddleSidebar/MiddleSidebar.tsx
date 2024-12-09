import Image from "next/image";
import HeaderDesktop from "@/../public/images/home-page/new-mresalt-header.svg";
import { useRouter } from "next/navigation";

export default function MiddleSidebar() {
  const router = useRouter();


return (
        <div className="min-w-[400px] w-[400px] bg-[#FFFFFF] min-h-screen px-5 gap-8 flex flex-col">
            <div className="my-5 w-full flex justify-center align-middle">
                <Image
                    src={"/images/logo/LOGO.svg"}
                    alt="header"
                    width={5}
                    height={5}
                    className="w-32"
                />
            </div>
            <div className="w-full flex flex-row gap-3 bg-[#F2F4F8] h-20 rounded-2xl items-center justify-between">



                <div className="flex flex-row items-center mr-3">
                    <Image
                        src={"/images/home-page/user-octagon.svg"}
                        alt="header"
                        width={5}
                        height={5}
                        className="w-8 ml-1"
                    />
                    <span className="font-bold">شرکت فرداپ</span>
                </div>
                <span className="bg-[#96FAEE] rounded-xl text-[#00A692] w-14 text-xs p-1 flex items-center justify-center  ml-6">مدیر</span>

            </div>

            <div className="w-full flex flex-row border-b-[#DDE1E6] border-b-solid border-b-[1px] h-6 mr-3 items-center justify-between">

                <div className="flex flex-row items-center mb-7">
                    <Image
                        src={"/images/home-page/additem.svg"}
                        alt="header"
                        width={5}
                        height={5}
                        className="w-8 ml-1"
                    />
                    <span>فرم ساز</span>
                </div>

            </div>
            <div className="w-full flex flex-row border-b-[#DDE1E6] border-b-solid border-b-[1px] h-6 mr-3 items-center justify-between">

                <div className="flex flex-row items-center mb-7">
                    <Image
                        src={"/images/home-page/additem.svg"}
                        alt="header"
                        width={5}
                        height={5}
                        className="w-8 ml-1"
                    />
                    <span>فرم ساز</span>
                </div>

            </div>
            <div className="w-full flex flex-row border-b-[#DDE1E6] border-b-solid border-b-[1px] h-6 mr-3 items-center justify-between">

                <div className="flex flex-row items-center mb-7">
                    <Image
                        src={"/images/home-page/additem.svg"}
                        alt="header"
                        width={5}
                        height={5}
                        className="w-8 ml-1"
                    />
                    <span>فرم ساز</span>
                </div>

            </div>
            <div className="w-full flex flex-row border-b-[#DDE1E6] border-b-solid border-b-[1px] h-6 mr-3 items-center justify-between">

                <div className="flex flex-row items-center mb-7">
                    <Image
                        src={"/images/home-page/additem.svg"}
                        alt="header"
                        width={5}
                        height={5}
                        className="w-8 ml-1"
                    />
                    <span>فرم ساز</span>
                </div>

            </div>





            {/*         
        <button
          className="h-[56px] bg-[#1758BA] shadow-none rounded-lg text-white text-[16px] font-bold"
          onClick={() => {
            router.push("/builder");
          }}
        >
          فرم ساز
        </button> */}

        </div >
      
    );
  }