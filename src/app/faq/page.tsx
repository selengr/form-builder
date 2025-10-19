'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import CustomAccordionGroup from './components/accordion';
// import { Se } from 'react-icons/md';
import React from 'react';

const HighlightedText = ({ text, highlight }: { text: string; highlight: string }) => {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }
  const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedHighlight})`, 'gi');
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, index) =>
        regex.test(part) && highlight.trim() ? (
          <mark key={index} className="bg-yellow-200 dark:bg-yellow-400 text-black rounded px-1 mx-0.5">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
};

export default function HomePage() {
  const accordionItemsOriginal = useMemo(() => [
    {
      id: 'panel1',
      title: 'سایا چیست؟',
      content:
        'سایا یک سامانه سنجش و اندازه‌گیری روانشناختی و اجتماعی و ساخت فرم است که به شما امکان می‌دهد فرم‌های دلخواه خود را طراحی کنید، آن‌ها را با افراد مختلف (به صورت عمومی، گروهی، فردی یا بر اساس یک جمعیت معین) به اشتراک بگذارید و داده‌های جمع‌آوری‌شده را مدیریت و تجزیه‌وتحلیل کنید.',
    },
    {
      id: 'panel2',
      title: 'چگونه می‌توانم در سایا فرم بسازم؟',
      content:
        'برای ساخت فرم کافی است پس از ورود به حساب کاربری خود: به بخش "فرم‌های من" بروید و از قسمت "ایجاد فرم"، نوع سوالات و فیلدهای موردنظر را اضافه کنید و پس از آن در صورت نیاز محاسبه‌گرها و شروط مورد نظر را به آن اضافه کنید. در نهایت فرم خود را در قالبی که آماده انتشار باشد ذخیره و سپس تنظیمات انتشار را مشخص کنید. برای آنکه در مورد نحوه کار با فرم‌ساز بیشتر بدانید، بخش "آموزش" را مطالعه کنید.',
    },
    {
      id: 'panel3',
      title: 'چه کسانی می‌توانند فرم من را ببینند؟',
      content:
        'شما می‌توانید در تنظیمات انتشار فرم، مشخص کنید که این فرم آیا در دسترس عموم قرار بگیرد (از طریق صفحه عمومی سایا و برای هردوی اعضاء زیست‌بوم ام‌رسالت و کاربران غیرعضو)، فقط برای گروه خاصی که شما مشخص می‌کنید ارسال شود (انتشار گروهی)، فقط برای یک نفر ارسال شود (انتشار انفرادی) یا برای یک جمعیت معین از اعضاء ام‌رسالت ارسال شود.',
    },
    {
      id: 'panel4',
      title: 'پرداخت در ازای انتشار فرم چگونه انجام می‌شود؟',
      content:
        'پس از مشخص کردن تنظیمات انتشار، شما به سیستم پرداخت "ام‌حسام" منتقل می‌شوید و از آنجا هزینه خدمات دریافتی را به ازای تعداد انتشاری که در تنظیمات انتشار تعیین کرده‌اید پرداخت می‌کنید. بلافاصله پس از انجام پرداخت، فرم شما منتشر خواهد شد.',
    },
    {
      id: 'panel5',
      title: 'چگونه می‌توانم داده‌های فرم‌های پرشده را دریافت کنم؟',
      content:
        'پس از اتمام جمع‌آوری داده‌ها، از طریق منوی "گزارش‌ها" > "نتایج" تمام پاسخ‌های دریافتی به فرم مورد نظر تا آن لحظه، در قالب جدول شرکت‌کننده – متغیر، قابل مشاهده و بارگیری خواهد بود. همچنین شما می‌توانید با انتخاب هر شرکت‌کننده، گزارش نتایج مربوط به او (در صورت وجود) را مشاهده کنید.',
    },
    {
      id: 'panel6',
      title: 'آیا می‌توانم برای یک فرم، قالب گزارش آماده کنم؟',
      content:
        'بله. کافی است در منوی "گزارش‌ها" روی فرم مورد نظر، گزینه "ساخت گزارش" را انتخاب و در آنجا با استفاده از متغیرها، متون و شرط‌ها، خرده‌گزارشاتی را ایجاد کنید که در کنار یک دیگر یک قالب گزارش را می‌سازند. پس از ایجاد گزارش، می‌توانید در صفحه "نتایج" با انتخاب هر شرکت‌کننده، گزارش منحصر به او را مشاهده کنید. برای آنکه در مورد نحوه کار با گزارش‌ساز بیشتر بدانید، بخش "آموزش" را مطالعه کنید.',
    },
    {
      id: 'panel7',
      title: 'چگونه می‌توانم محتوای نامناسب را گزارش کنم؟',
      content:
        'اگر به عنوان شرکت‌کننده متوجه شدید که یک فرم یا گزارش نتایج حاوی محتوای نامناسب است، می‌توانید گزینه "گزارش تخلف" را انتخاب و دلیل خود را ثبت کنید. تیم سایا به سرعت مورد گزارش‌شده را بررسی خواهد کرد.',
    },
    {
      id: 'panel8',
      title: 'آیا برای استفاده از سایا باید هزینه‌ای بپردازم؟',
      content:
        'اگرچه ساخت فرم در سایا رایگان است، اما جمع‌آوری داده و استفاده از دیگر خدمات سایا مشمول هزینه است. همچنین شرکت در فرم‌ها عموما رایگان هستند مگر آنکه سازنده قصد انتفاع مالی از آن فرم را داشته باشد.',
    },
    {
      id: 'panel9',
      title: 'آیا اطلاعات من محرمانه می‌ماند؟',
      content:
        'مطمئنا. سایا متعهد است تمام اطلاعات کاربران و داده‌های جمع‌آوری‌شده را محرمانه نگه دارد و هر کاربر فقط به داده‌های فرم‌هایی که ساخته است یا در آنها شرکت‌کرده است دسترسی خواهد داشت. در مورد اول منظور پاسخ‌هایی است که به شکل آگاهانه به یک فرم داده شده است و در مورد دوم منظور پاسخ خود فرد به فرمی است که در آن شرکت کرده است.',
    },
    {
      id: 'panel10',
      title: 'چگونه می‌توانم با پشتیبانی سایا تماس بگیرم؟',
      content: 'برای دریافت پشتیبانی یا هرگونه سوال، می‌توانید از طریق بخش تماس با ما با تیم پشتیبانی در ارتباط باشید.',
    },
  ], []);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredAndHighlightedItems = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) {
      return accordionItemsOriginal;
    }

    return accordionItemsOriginal
      .filter(item =>
        item.title.toLowerCase().includes(term) ||
        item.content.toLowerCase().includes(term)
      )
      .map(item => ({
        ...item,
        title: <HighlightedText text={item.title} highlight={searchTerm} />,
        content: <HighlightedText text={item.content} highlight={searchTerm} />,
      }));
  }, [searchTerm, accordionItemsOriginal]);

  return (
    <div className='relative h-[calc(100vh-60px)] md:h-full max-h-screen overflow-hidden w-full' style={{ userSelect: 'none' }}>
      <div className='absolute inset-0 -z-10 pointer-events-none bg-[#fcfcfe]'></div>
      <div className='absolute inset-0 -z-10 -top-[2%] -left-[70%] opacity-10'>
        <Image alt={''} src={`/api/images?folder=faq&file=curvy.svg`} width={100} height={100} className={'w-full h-full '} draggable={false} />
      </div>
      <div className='absolute inset-0 -z-10 '>
        <Image alt={''} src={`/api/images?folder=faq&file=gr.svg`} width={100} height={100} className={'w-screen h-screen floating-3d-f'} draggable={false} />
      </div>

      <div className='flex flex-col w-full items-center justify-start h-full z-20 pt-10 md:pt-16'>
        <div className='relative flex flex-col items-center justify-center xs:h-auto lg:h-auto mb-6 md:mb-8'>
          <div className='absolute inset-0 -z-10 flex items-center justify-center blur-[5px] opacity-85'>
            <Image alt='' src='/api/images?folder=faq&file=faq.svg' className={'animate-pulse floating-3d opacity-75'} width={500} height={500} draggable={false} />
          </div>
          <div className='absolute inset-0 -z-10 flex items-center justify-center opacity-35 top-[150px] md:top-[200px]'>
            <Image alt={''} src={`/api/images?folder=faq&file=circle-bg.svg`} width={500} height={500} draggable={false} />
          </div>
          <h1 className='xs:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 font-d7 mb-6'>سوالات پرتکرار</h1>


        </div>
        <div className="relative w-full xs:min-w-[80vw] xs:max-w-[90vw] md:min-w-[40vw] md:max-w-[50vw] lg:min-w-[30vw] lg:max-w-[40vw] px-4">
          <input
            type="text"
            placeholder="جستجو در سوالات و پاسخ‌ها..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border
                         bg-white
                         py-3 pl-12 pr-5 text-gray-800
                         mb-3
                          focus:border-transparent transition"
            dir="rtl"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 pointer-events-none">
            {/*<Search size={20} />*/}
          </div>
        </div>
        <div className='flex-grow w-full overflow-y-auto scroll-hide px-4 pb-4'>
          {filteredAndHighlightedItems.length > 0 ? (
             <CustomAccordionGroup items={filteredAndHighlightedItems} />
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 py-10">
              <p>موردی مطابق با جستجوی شما یافت نشد.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}