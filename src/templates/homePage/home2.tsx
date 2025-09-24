'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { MyRangeSlider } from '@/components/Slider/RangeSlider';
import { BarChart } from '@mui/x-charts';
import CountUp from 'react-countup';
import { useRouter } from 'next/navigation';

export default function HomePageX() {
  const router = useRouter();
  const handleClick = () => {
    router.push('/builder?new');
  };
  const [sliderValue, setSliderValue] = useState(8.3);
  const [data, setData] = useState<number[]>([10, 30, 20, 20, 40]);
  const statistics = [
    { label: 'فرم', value: 413091 },
    { label: 'ارزیابی', value: 401680 },
    { label: 'عضو', value: 800000 },
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      const newData = Array.from({ length: data.length }, () => Math.floor(Math.random() * (40 - 10 + 1)) + 10);
      setData(newData);
    }, 3000);

    return () => clearInterval(interval);
  }, [data.length]);

  return (
    <div
      className='h-screen w-full overflow-y-scroll -mt-[60px] lg:mt-0 pb-48 overflow-x-hidden z-0'
      style={{
        background: 'linear-gradient(to bottom, #ffffff, #eff6ff, #eff6ff)',
        userSelect: 'none',
      }}>
      <main className='relative flex flex-col lg:flex-row items-center justify-between pt-20 pb-12 px-4 lg:px-8 w-full max-w-[1440px] mx-auto'>
        {/* دایره چرخشی بک‌گراند */}
        <div className='absolute top-0 right-0 w-[40vw] h-[40vw] max-w-[600px] opacity-20 md:opacity-30 -z-0 translate-x-1/4 -translate-y-1/4 pointer-events-none'>
          <Image src='/api/images?folder=home&file=circles.svg' alt='circles decoration' fill className='object-contain animate-rotate-slow' priority />
        </div>

        {/* متن سمت راست */}
        <section className='z-50 text-center lg:text-right lg:w-1/2 mb-16 lg:mb-0'>
          <h1 className='text-4xl sm:text-5xl lg:text-[3rem] text-[#183B56] font-extrabold leading-tight mb-6 font-d7'>
            <span className='relative inline-block'>
              <span className='relative z-10'>سایا</span>
              <span className='absolute bottom-0 left-0 w-full h-[50%] bg-[#2cdfc9] z-0 rounded-sm skew-x-4 -skew-y-6'></span>
            </span>
            <span>, دستیار</span>
            <span className='block'>هوشمند شناخت</span>
          </h1>
          <p className='text-lg sm:text-lgl text-gray-700 mb-8 leading-relaxed font-d7 max-w-xl mx-auto lg:mx-0'>
            سایا سکویی نوین برای طراحی، اجرا و تحلیل آزمون‌های روان‌شناختی است. این سامانه با رابط کاربری ساده، روان و یکپارچه، امکان ساخت فرم‌های آنلاین تعاملی و تولید گزارش‌های دقیق و شخصی‌سازی‌شده
            را فراهم می‌کند.
          </p>
          <div className='flex justify-center items-center h-full'>
            <button
              onClick={handleClick}
              className='bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-blue-500 via-[#1758BA] to-[#1758BA] hover:scale-x-95 hover:scale-y-90 hover:skew-x-1 transition-all duration-500 text-white font-bold py-4 px-10 rounded-3xl text-lg shadow-xl shadow-blue-700/30'>
              ایجاد فرم
            </button>
          </div>
        </section>

        {/* تصویر سمت چپ */}
        <section className='z-10 w-full lg:w-1/2 flex justify-center items-center'>
          <div className='relative w-full max-w-[500px] aspect-[9/16] lg:aspect-auto lg:h-[590px]'>
            <Image src='/api/images?folder=home&file=curvyBG.svg' alt='Decorative background shape' fill className='object-contain animate-rotate-slow pointer-events-none -z-20' priority />

            {/* گوشی موبایل */}
            <div className='absolute inset-0 w-[70%] lg:w-[90%] mx-auto aspect-[9/16] -z-10'>
              <Image src='/api/images?folder=home&file=phone.svg' alt='phone mockup' fill className='object-contain' priority draggable={false} />

              {/* باکس کشویی */}
              <div className='absolute top-[35%] left-[15%] w-[70%] floating-3d px-2 py-1'>
                <Image src='/api/images?folder=home&file=dragable.svg' alt='draggable content' width={300} height={100} className='w-full h-auto' priority />
              </div>
            </div>

            {/* باکس سوال */}
            <div className='absolute top-[3%] -right-[0%] lg:-right-[20%] bg-white p-2 lg:p-3 rounded-2xl shadow-xl flex flex-col items-center gap-1.5 lg:gap-2 text-xs lg:text-sm text-gray-700 max-w-[180px] lg:max-w-[260px] floating-3d-1 -rotate-3 scale-[0.7] lg:scale-100 origin-top-right'>
              <div className='text-center'>
                <div className='text-yellow-500 text-xl lg:text-2xl mb-0.5 lg:mb-1'>⭐</div>
                <p className='font-medium text-gray-800 text-xs lg:text-sm leading-snug'>ارزیابی شما از کیفیت خدمات سایا چقدر است؟</p>
              </div>

              <div className='w-full  px-3 pt-1.5 lg:pt-2'>
                <MyRangeSlider value={sliderValue} onChange={(e, v) => typeof v === 'number' && setSliderValue(v)} min={1} max={10} step={0.1} valueLabelDisplay='auto' size='small' />
              </div>
            </div>

            {/* چارت پایین چپ */}
            <div className='absolute bottom-[30%] lg:bottom-[5%] left-0 bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-blue-500 via-[#1758BA] to-[#1758BA] p-2 pl-0 rounded-2xl shadow-xl floating-3d-2 max-w-[260px] text-white'>
              <span className='text-xl'>
                <BarChart
                  grid={{ horizontal: false, vertical: false }}
                  series={[{ data, type: 'bar' }]}
                  borderRadius={300}
                  sx={{
                    '& .MuiChartsAxis-left .MuiChartsAxis-tickLabel': {
                      fill: '#ffffff',
                    },
                  }}
                  xAxis={[
                    {
                      data: [new Date(2020, 1, 1), new Date(2021, 1, 1), new Date(2022, 1, 1), new Date(2023, 1, 1), new Date(2024, 1, 1)],
                      colorMap: {
                        type: 'continuous',
                        min: new Date(2019, 1, 1),
                        max: new Date(2024, 1, 1),
                        color: ['#fff', '#ffffff77'],
                      },
                      categoryGapRatio: 0.5,
                      barGapRatio: 0.2,
                      disableTicks: true,
                      disableLine: true,
                      tickLabelMinGap: 100,
                      tickLabelPlacement: 'middle',
                      tickPlacement: 'middle',
                      position: 'none',
                    },
                  ]}
                  yAxis={[
                    {
                      disableTicks: true,
                      disableLine: true,
                    },
                  ]}
                  width={250}
                  height={120}
                />
              </span>
            </div>

            {/* نمره */}
            <div className='absolute top-[20%] left-0 bg-white p-2 rounded-xl shadow-xl text-sm text-gray-800 floating-3d-4 rotate-3'>
              <span className='font-medium'>میانگین نمره:</span>
              <span className='text-yellow-500 font-bold mr-1'>
                <CountUp end={7.84} decimals={2} duration={5} smartEasingAmount={0} />~
              </span>
            </div>
          </div>
          <div className='absolute inset-0 -z-50 '>
            <Image alt={''} src={`/api/images?folder=faq&file=gr.svg`} width={100} height={100} className={'w-screen h-screen animate-bounce-slow'} draggable={false} />
          </div>

//           <footer className='absolute inset-0 z-40 top-[75%] lg:top-[95%] px-4 sm:px-6 md:px-10 pb-24'>
//             <div className='max-w-[1440px] mx-auto bg-white rounded-3xl shadow-2xl shadow-blue-700/20 p-6 sm:p-8 md:p-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-center'>
//               {statistics.map((item, i) => (
//                 <div key={i} className='flex flex-col items-center'>
//                   <span className='text-[#183B56] text-3xl sm:text-4xl md:text-5xl font-bold'>
//                     <CountUp end={item.value} duration={7} separator=',' smartEasingAmount={i} />
//                     {i === 0 ? '+' : ''}
//                   </span>
//                   <span className='text-gray-600 text-sm sm:text-base mt-2'>{item.label}</span>
//                 </div>
//               ))}
//             </div>
//           </footer>
        </section>
      </main>
    </div>
  );
}
