import Image from "next/image";

import AboutClient from "./components/AboutClient";

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
      "برای ساخت فرم کافی است پس از ورود به حساب کاربری خود به بخش فرم‌های من بروید و از قسمت ایجاد فرم، نوع سوالات و فیلدهای موردنظر را اضافه کنید.",
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
      "پس از مشخص کردن تنظیمات انتشار، به سیستم پرداخت ام‌حسام منتقل می‌شوید و هزینه خدمات را پرداخت می‌کنید.",
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
      "بله. در بخش گزارش‌ها می‌توانید با استفاده از متغیرها و شرط‌ها، قالب گزارش ایجاد کنید.",
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
      "ساخت فرم رایگان است، اما برخی خدمات مانند جمع‌آوری داده شامل هزینه می‌شوند.",
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
] as const;

export const dynamic = "force-static";

export default function AboutUsPage() {
  return (
    <main
      className="relative flex h-[calc(100vh-60px)] w-full select-none flex-col items-center overflow-hidden bg-[#fcfcfe] md:h-full"
      dir="rtl"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <Image
          src="/api/images?folder=faq&file=gr.svg"
          alt=""
          fill
          priority
          unoptimized
          className="floating-3d-f object-cover"
          aria-hidden="true"
        />
      </div>

      {/* Decorative curve */}
      <div className="pointer-events-none absolute -left-[70%] -top-[2%] -z-10 h-full w-full opacity-10">
        <Image
          src="/api/images?folder=faq&file=curvy.svg"
          alt=""
          fill
          unoptimized
          className="object-contain"
          aria-hidden="true"
        />
      </div>

      {/* Header */}
      <header className="relative z-10 flex flex-col items-center justify-center pb-6 pt-10 md:pb-8 md:pt-16">
        {/* Glow */}
        <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center opacity-85 blur-[5px]">
          <Image
            src="/api/images?folder=faq&file=faq.svg"
            alt=""
            width={500}
            height={500}
            unoptimized
            className="floating-3d animate-pulse opacity-75"
            aria-hidden="true"
          />
        </div>

        {/* Circle */}
        <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center opacity-35 top-[150px] md:top-[200px]">
          <Image
            src="/api/images?folder=faq&file=circle-bg.svg"
            alt=""
            width={500}
            height={500}
            unoptimized
            aria-hidden="true"
          />
        </div>

        <h1 className="font-d7 mb-0 text-4xl font-bold text-gray-800 md:text-5xl lg:text-6xl">
          سوالات پرتکرار
        </h1>
      </header>

      {/* FAQ */}
      <section className="relative z-10 w-full flex-1 overflow-y-auto px-4 pb-10 md:px-6">
        <AboutClient items={accordionItems} />
      </section>
    </main>
  );
}