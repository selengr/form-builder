"use client";

import Image from "next/image";
import CustomAccordionGroup from "./components/accordion";

export default function HomePage() {
    const accordionItems = [
        {
            id: "panel1",
            title: "سایا دقیقا چیست و چه کاربردی دارد؟",
            content:
                "سایا یک سامانه فرم‌ساز هوشمند است که به شما اجازه می‌دهد با درگ و دراپ فرم‌های پیچیده، شرطی و محاسبه‌گر بسازید. این ابزار به‌صورت ویژه برای روان‌درمانگران، پژوهشگران حوزه روان‌شناسی و علوم شناختی طراحی شده است.",
        },
        {
            id: "panel2",
            title: "آیا می‌توانم فیلدهای شرطی در فرم‌ها تعریف کنم؟",
            content:
                "بله. سایا به شما امکان می‌دهد که برای نمایش یا مقداردهی فیلدها منطق شرطی (if/else) تعریف کنید. این قابلیت باعث می‌شود فرم‌ها متناسب با پاسخ‌های کاربر تغییر کنند.",
        },
        {
            id: "panel3",
            title: "آیا امکان انجام محاسبات درون فرم وجود دارد؟",
            content:
                "بله، در سایا می‌توانید برای فیلدهای عددی یا امتیازی فرمول بنویسید و از خروجی آن‌ها در شرط‌ها یا گزارش‌ها استفاده کنید.",
        },
        {
            id: "panel4",
            title: "چگونه می‌توانم گزارشی از پاسخ‌ها دریافت کنم؟",
            content:
                "شما می‌توانید با استفاده از گزارش‌ساز سایا، گزارش‌های شرطی و تحلیلی ایجاد کرده و داده‌ها را به‌صورت خلاصه یا جزئی مشاهده یا خروجی بگیرید.",
        },
        {
            id: "panel5",
            title: "آیا فرم‌های ساخته‌شده قابل اشتراک‌گذاری هستند؟",
            content:
                "بله. بعد از طراحی فرم، لینکی برای شما تولید می‌شود که می‌توانید آن را با دیگران به اشتراک بگذارید یا در وب‌سایت خود قرار دهید.",
        },
        {
            id: "panel6",
            title: "چطور می‌توانم پاسخ‌دهندگان فرم را مدیریت کنم؟",
            content:
                "سایا یک جدول پیشرفته برای مدیریت و مشاهده پاسخ‌دهندگان در اختیار شما می‌گذارد که شامل فیلتر، جستجو و مشاهده جزئیات هر پاسخ است.",
        },
        {
            id: "panel7",
            title: "آیا می‌توانم محتوای نامناسب یا تخلف را گزارش دهم؟",
            content:
                "بله، در صورتی که محتوای یک فرم یا گزارش مغایر با قوانین باشد، می‌توانید از سیستم گزارش تخلف سایا استفاده کنید تا بررسی و رسیدگی انجام شود.",
        },
        {
            id: "panel8",
            title: "آیا فرم‌ها با موبایل و تبلت هم سازگار هستند؟",
            content:
                "کاملاً. فرم‌های سایا ریسپانسیو هستند و روی همه دستگاه‌ها از جمله موبایل و تبلت به‌درستی نمایش داده می‌شوند.",
        },
        {
            id: "panel9",
            title: "آیا امکان تعریف سطوح دسترسی برای همکاران وجود دارد؟",
            content:
                "در نسخه‌های پیشرفته سایا می‌توانید همکاران را دعوت کرده و برای هرکدام سطح دسترسی تعریف کنید (مثلاً فقط مشاهده، ویرایش، گزارش‌گیری و ...).",
        },
        {
            id: "panel10",
            title: "آیا داده‌ها در سایا امن هستند؟",
            content:
                "بله. سایا با رمزنگاری داده‌ها و ذخیره‌سازی امن، اطمینان حاصل می‌کند که اطلاعات کاربران و پاسخ‌دهندگان محفوظ و محرمانه باقی بمانند.",
        },
        {
            id: "panel11",
            title: "آیا می‌توانم فرم‌ها را با برند یا لوگوی خودم منتشر کنم؟",
            content:
                "بله. شما می‌توانید از قابلیت سفارشی‌سازی ظاهر فرم استفاده کنید تا لوگو، رنگ‌بندی و سبک دلخواه خود را روی فرم‌ها اعمال کنید.",
        },
        {
            id: "panel12",
            title: "سایا چه تفاوتی با پرس‌لاین و ابزارهای مشابه دارد؟",
            content:
                "برخلاف ابزارهایی مثل پرس‌لاین، سایا تمرکز ویژه‌ای روی ساخت فرم‌های شرطی پیچیده، گزارش‌سازی هوشمند، و پشتیبانی از نیازهای تخصصی روان‌شناسی و علوم شناختی دارد.",
        },
    ];

    return (
        <div className="relative h-[calc(100vh-60px)] md:h-full max-h-screen overflow-hidden w-full"
             style={{userSelect: "none"}}>
            <div className="absolute inset-0 -z-10 pointer-events-none bg-[#fcfcfe]">

            </div>

            <div className="absolute inset-0 -z-10 -top-[2%] -left-[70%] opacity-10">
                <Image alt={""} src={`/api/images?folder=faq&file=curvy.svg`} width={100} height={100}
                       className={"w-full h-full "} draggable={false}/>
            </div>
            <div className="absolute inset-0 -z-10 ">
                <Image alt={""} src={`/api/images?folder=faq&file=gr.svg`} width={100} height={100}
                       className={"w-screen h-screen floating-3d-f"} draggable={false}/>
            </div>

            <div className="flex flex-col w-full items-center justify-center h-full z-20">
                <div className="relative flex items-center justify-center xs:h-1/5 lg:h-2/5">
                    <div className="absolute inset-0 -z-10 flex items-center justify-center blur-[5px] opacity-85">
                        <Image
                            alt=""
                            src="/api/images?folder=faq&file=faq.svg"
                            className={"animate-pulse floating-3d opacity-75"}
                            width={500}
                            height={500}
                            draggable={false}
                        />
                    </div>
                    <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-35 top-[380px]">

                        <Image alt={""} src={`/api/images?folder=faq&file=circle-bg.svg`}
                               width={500}
                               height={500}
                               draggable={false}/>
                    </div>
                    <h1 className="xs:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 font-d7">سوالات
                        پرتکرار</h1>
                </div>
                <div className="p-4 overflow-y-scroll  scroll-hide">
                    <CustomAccordionGroup items={accordionItems}/>
                </div>
            </div>
        </div>
    );
}

