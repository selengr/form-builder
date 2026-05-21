import Image from "next/image";
import FaqClient from "./components/FaqClient";

export const revalidate = 3600; 

export default async function HomePage() {

  const accordionItems = [
    {
      id: "panel1",
      title: "سایا چیست؟",
      content:
        "سایا یک سامانه سنجش و اندازه‌گیری روانشناختی و اجتماعی و ساخت فرم است که به شما امکان می‌دهد فرم‌های دلخواه خود را طراحی کنید، آن‌ها را با افراد مختلف (به صورت عمومی، گروهی، فردی یا بر اساس یک جمعیت معین) به اشتراک بگذارید و داده‌های جمع‌آوری‌شده را مدیریت و تجزیه‌وتحلیل کنید.",
    },
    {
      id: "panel2",
      title: "چگونه می‌توانم در سایا فرم بسازم؟",
      content:
        "برای ساخت فرم کافی است پس از ورود به حساب کاربری خود به بخش فرم‌های من بروید و از قسمت ایجاد فرم نوع سوالات و فیلدهای موردنظر را اضافه کنید.",
    },
    {
      id: "panel3",
      title: "چه کسانی می‌توانند فرم من را ببینند؟",
      content:
        "شما می‌توانید در تنظیمات انتشار فرم مشخص کنید که این فرم برای عموم، یک گروه خاص، یک فرد یا یک جمعیت مشخص ارسال شود.",
    },
    {
      id: "panel4",
      title: "پرداخت در ازای انتشار فرم چگونه انجام می‌شود؟",
      content:
        "پس از مشخص کردن تنظیمات انتشار به سیستم پرداخت ام‌حسام منتقل می‌شوید و هزینه خدمات را پرداخت می‌کنید.",
    },
    {
      id: "panel5",
      title: "چگونه می‌توانم داده‌های فرم‌های پرشده را دریافت کنم؟",
      content:
        "از طریق منوی گزارش‌ها و بخش نتایج می‌توانید پاسخ‌های دریافتی را مشاهده و دریافت کنید.",
    },
    {
      id: "panel6",
      title: "آیا می‌توانم برای یک فرم قالب گزارش آماده کنم؟",
      content:
        "بله. در بخش گزارش‌ها می‌توانید با استفاده از متغیرها و شرط‌ها قالب گزارش ایجاد کنید.",
    },
    {
      id: "panel7",
      title: "چگونه می‌توانم محتوای نامناسب را گزارش کنم؟",
      content:
        "در صورت مشاهده محتوای نامناسب می‌توانید گزینه گزارش تخلف را انتخاب کنید.",
    },
    {
      id: "panel8",
      title: "آیا برای استفاده از سایا باید هزینه‌ای بپردازم؟",
      content:
        "ساخت فرم رایگان است اما برخی خدمات مانند جمع‌آوری داده شامل هزینه می‌شوند.",
    },
    {
      id: "panel9",
      title: "آیا اطلاعات من محرمانه می‌ماند؟",
      content:
        "سایا متعهد است اطلاعات کاربران و داده‌های جمع‌آوری‌شده را محرمانه نگه دارد.",
    },
    {
      id: "panel10",
      title: "چگونه می‌توانم با پشتیبانی سایا تماس بگیرم؟",
      content:
        "برای دریافت پشتیبانی می‌توانید از طریق بخش تماس با ما اقدام کنید.",
    },
  ];

  return (
    <div className="relative h-[calc(100vh-60px)] md:h-full max-h-screen overflow-hidden w-full" style={{ userSelect: "none" }}>
      <div className="absolute inset-0 -z-10 pointer-events-none bg-[#fcfcfe]" />

      <div className="absolute inset-0 -z-10 -top-[2%] -left-[70%] opacity-10">
        <Image
          alt=""
          src="/api/images?folder=faq&file=curvy.svg"
          width={100}
          height={100}
          className="w-full h-full"
          draggable={false}
        />
      </div>

      <div className="absolute inset-0 -z-10">
        <Image
          alt=""
          src="/api/images?folder=faq&file=gr.svg"
          width={100}
          height={100}
          className="w-screen h-screen floating-3d-f"
          draggable={false}
        />
      </div>

      <div className="flex flex-col w-full items-center justify-start h-full z-20 pt-10 md:pt-16">

        <div className="relative flex flex-col items-center justify-center mb-6 md:mb-8">

          <div className="absolute inset-0 -z-10 flex items-center justify-center blur-[5px] opacity-85">
            <Image
              alt=""
              src="/api/images?folder=faq&file=faq.svg"
              className="animate-pulse floating-3d opacity-75"
              width={500}
              height={500}
              draggable={false}
            />
          </div>

          <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-35 top-[150px] md:top-[200px]">
            <Image
              alt=""
              src="/api/images?folder=faq&file=circle-bg.svg"
              width={500}
              height={500}
              draggable={false}
            />
          </div>

          <h1 className="xs:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 font-d7 mb-6">
            سوالات پرتکرار
          </h1>

        </div>

        {/* client interactive section */}
        <FaqClient items={accordionItems} />

      </div>
    </div>
  );
}
