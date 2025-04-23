import {Button} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import {ArrowLeft} from "../../../public/images/home-page/ArrowLeft";

export default function HomePage() {
  return (
    <main
      className="h-screen w-full bg-white text-right lg:pr-4 lg:pl-0 overflow-x-hidden overflow-y-auto"
      dir="rtl"
    >
      <div className="mx-auto px-4 pt-6 flex justify-center md:hidden">
        <Image
          src="/images/logo/logo2.svg"
          alt="سایا لوگو"
          width={120}
          height={40}
          priority
        />
      </div>

      <div className="flex flex-col lg:flex-row justify-center items-center md:pt-20">
        <section className="px-4 text-center lg:text-right relative">
          <div
            className="absolute -top-12 -right-4 w-52 h-64 bg-[#0066FF] rounded-full opacity-[8%] blur-xl"
            aria-hidden="true"
          />

          <h1 className="text-3xl font-bold mb-2 text-[#4A4A4A]">
            دستیار هوشمند شناخت
          </h1>
          <div className="flex flex-col justify-center lg:flex-row items-center">
            <div
              className="h-[2px] w-10 lg:w-9 rounded-full bg-[#2CDFC9] mx-auto my-3 lg:mb-5 lg:mx-2"
              aria-hidden="true"
            ></div>
            <h2 className="text-[22px] font-semibold text-[#FA4D56] mb-2">
              چه کاری انجام می‌دهیم!
            </h2>
          </div>
          <p
            className="text-[14px] text-[#4A4A4A] mx-auto lg:mx-0 text-justify leading-relaxed mb-4 px-[20px] lg:px-0  xs:max-w-5xl lg:max-w-72"
          >
            سایا سکویی برای ساخت، اجرا و تحلیل آزمون‌های روان‌شناختی است. این
            سکو با رابط کاربری ساده و یکپارچه، امکان ایجاد فرم‌های برخط و
            گزارش‌های شخصی‌سازی شده را فراهم می‌کند.
          </p>
        </section>

        <section
          className="relative w-full mt-10 lg:mt-0 px-4 lg:px-0 lg:w-[50%] h-full min-h-[250px] max-w-[500px] flex justify-center items-center">
          <div className="absolute top-0 left-0 w-24 h-24 bg-blue-600 rounded-full opacity-20 blur-lg" aria-hidden="true"/>
          <div className="absolute bottom-0 right-0 w-16 h-16 bg-purple-600 rounded-full opacity-20 blur-lg" aria-hidden="true"/>
          <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-pink-500 rounded-full opacity-20 blur-lg" aria-hidden="true"/>

          <Image
            src="/images/home-page/circle-bg.svg"
            alt="سایا لوگو"
            width={100}
            height={100}
            className="w-full h-full absolute lg:-top-6 -left-[35px] xs:-left-[30%] lg:-left-36"
          />
          <Image
            src="/images/home-page/Oval2.svg"
            alt="object"
            width={50}
            height={28}
            className="w-[60%] h-[60%] absolute -top-7 left-32"
          />
          <Image
            src="/images/home-page/Oval1.svg"
            alt="object"
            width={50}
            height={28}
            className="w-[40%] h-[40%] lg:w-[50%] lg:h-[50%] absolute -top-[65px] -left-[35px] xs:-left-[15%] lg:-left-[155px]"
          />
          <Image
            src="/images/home-page/Oval3.svg"
            alt="object"
            width={50}
            height={28}
            className="w-[60%] h-[60%] absolute -bottom-[65px] -left-[35px] xs:-left-[15%] lg:-left-[105px]"
          />
          <Image
            src="/images/home-page/Oval4.svg"
            alt="object"
            width={50}
            height={28}
            className="w-[60%] h-[60%] absolute -bottom-[100px] -right-[95px] lg:-right-[135px]"
          />
          <div className="flex flex-row gap-4 xs:gap-6 md:gap-12 justify-center items-center w-full h-full p-2 xs:p-6 bg-[#FAFAFA] rounded-[60px]">
            <FormBuilderCard/>
            <PublicFormsCard/>
          </div>
        </section>
      </div>

      <div className="flex flex-col items-center justify-center pl-4 py-12 text-center relative -mt-28">
        <div className="absolute flex flex-col items-center justify-center mr-14">
          <Image
            src="/images/logo/logo2.svg"
            alt="سایا لوگو"
            width={120}
            height={40}
            className="hidden md:block"
          />
          <span className="lg:text-lg md:text-md sm:text-sm font-semibold font-d8 ss02">
            به آموزش بیشتری نیاز دارید؟
          </span>
        </div>

        <Image
          src="/images/home-page/banner-bg2.svg"
          alt="picture"
          width={480}
          height={480}
          className="w-full h-full lg:h-[550px] max-h-[550px] items-center justify-center flex flex-col"
        />
      </div>
    </main>
  );
}

  const FormBuilderCard = () => {

    return (
    <div
      className="bg-[linear-gradient(233.47deg,_#2CDFC9_-51.3%,_#1758BA_86.56%)] text-white relative rounded-[45px] h-[190px] shadow-xl pt-8 pr-4 w-full xs:w-[170px]">
      <h3 className="text-md font-bold mb-4">فرم ساز</h3>
      <p className="mb-6 text-xs">ساخت حرفه‌ای فرم با قابلیت درگ اند دراپ</p>
      <Button className="w-full justify-center absolute -bottom-2 left-0 text-white">
        <span className="text-white text-[10px]">ورود به فرم ساز</span>
        <Link href="/builder"
              className="bg-[#fff] z-50 rounded-[8px] md:rounded-[12px] w-[26px] md:w-[30px] h-[26px] md:h-[30px] flex items-center justify-center mr-2">
          <ArrowLeft/>
        </Link>
      </Button>
    </div>
  );
}

const PublicFormsCard = () => {
  return (
    <div
      className="bg-white rounded-[45px] shadow-2xl pt-8 w-full xs:w-[170px] h-[190px] relative shadow-[0px 73px 90px -38px rgba(0, 0, 0, 0.1895)]">
      <h3 className="text-md font-bold text-[#1758BA] pr-4 mb-2">فرم‌های عمومی</h3>
      <p className="text-[#2A2A2A] mb-6 text-xs pr-3 pl-4">
        مجموعه‌ای از فرم‌های منتشر شده عمومی در سامانه امرسالت
      </p>
      <div className="w-full z-10 justify-center absolute bottom-4 left-6 text-[#1758BA]">
        <Link href="/public-form" className="text-[11px] flex flex-row items-center justify-end">
          <span className="text-[#2A2A2A] text-[10px]">مشاهده</span>
          <div
            className="bg-[#1758BA] cursor-pointer rounded-[8px] md:rounded-[12px] w-[26px] md:w-[30px] h-[26px] md:h-[30px] flex items-center justify-center mr-2">
            <ArrowLeft className="text-[#fff]" fill="#fff" stroke="#fff"/>
          </div>
        </Link>
      </div>
    </div>
  );
}
