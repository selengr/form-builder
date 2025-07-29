'use client'
import Image from 'next/image';
import {MyRangeSlider} from "@/components/Slider/RangeSlider";
import React, {useEffect, useState} from "react";
import {BarChart} from "@mui/x-charts";

export default function HomePagex() {
    const [value, setValue] = React.useState<number>(8.3);

    const handleChange = (event: Event, newValue: any) => {
        setValue(newValue);
    };

    const [data, setData] = useState<number[]>([10, 30, 20, 20, 40]);

    useEffect(() => {
        const interval = setInterval(() => {
            // تولید عدد جدید بین 10 تا 40
            const newData = Array.from({length: data.length}, () => Math.floor(Math.random() * (40 - 10 + 1)) + 10);
            setData(newData);
        }, 3000);

        return () => clearInterval(interval);
    }, [data.length]);
    return (<div className="h-screen bg-[#FAFAFF] text-saba-text-dark font-iranSans w-full">
        <main
            className="relative flex flex-col lg:flex-row items-center justify-center pt-16 pb-8 lg:pt-24 lg:pb-16 px-4 sm:px-6 lg:px-8">

            <div className="absolute -top-[55%] left-[64%] w-1/2 aspect-square ">
                <div className="relative w-full h-full animate-rotate">
                    <Image
                        src="/api/images?folder=home&file=CIRCLES.svg"
                        alt="circles decoration"
                        layout="fill"
                        objectFit="contain"
                        priority
                    />
                </div>
            </div>

            <section className="relative z-10 text-center lg:text-right lg:w-1/2 px-4 lg:pr-16 mb-10 lg:mb-0">

                <h1 className="text-4xl sm:text-3xl lg:text-[40pt] font-[900] mb-6 text-[#183B56] font-d7 gap-1 heroTitle">
                    <p className="">سایا، دستیار</p>
                    <p className="">هوشمند شناخت</p>
                </h1>

                <p className="text-lg sm:text-lg font-d7 text-saba-text-light mb-8 max-w-xl mx-auto lg:mx-0">
                    سایا سکویی نوین برای طراحی، اجرا و تحلیل آزمون‌های روان‌شناختی است. این سامانه با رابط کاربری
                    ساده، روان و یکپارچه، امکان ساخت فرم‌های آنلاین تعاملی و تولید گزارش‌های دقیق و شخصی‌سازی‌شده را
                    فراهم می‌کند.
                </p>

                <button
                    className="bg-saba-blue hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 ease-in-out shadow-lg">
                    شروع کنید
                </button>
            </section>

            <section
                className="relative z-10 w-full max-w-md lg:w-1/2 lg:max-w-none flex justify-center items-center">
                <div
                    className="relative w-full mx-auto aspect-[9/16] lg:aspect-auto lg:h-[600px] xl:h-[700px] ">
                    <Image
                        src="/api/images?folder=home&file=curvyBG.svg"
                        alt=""
                        layout={"fill"}
                        className={'animate-rotate'}
                        objectFit="contain"
                        priority
                    />
                    <div className="relative w-full max-w-md mx-auto aspect-[9/16]">
                        <Image
                            src="/api/images?folder=home&file=phone.svg"
                            alt="phone"
                            layout="fill"
                            objectFit="contain"
                            priority
                            draggable={false}
                        />

                        <div className="absolute top-[35%] left-[22%] w-[80%] floating-3d px-4">
                            <Image
                                src="/api/images?folder=home&file=dragable.svg"
                                alt="dragable content"
                                layout="responsive"
                                width={300}
                                height={100}
                                priority
                                draggable={false}
                            />
                        </div>
                    </div>

                    {/* Additional floating elements (simplified placeholders) */}
                    <div
                        className="absolute top-[-5%] left-[5%] bg-white p-3 rounded-3xl shadow-md flex flex-col items-center gap-2 text-sm text-gray-700 w-[90%] sm:w-auto max-w-full"
                    >
                        <div className="text-center">
                            <span className="text-yellow-500">⭐</span>
                            <span className="ml-1 whitespace-nowrap">ارزیابی شما از کیفیت خدمات سایا چقدر است؟</span>
                        </div>

                        <div className="w-full min-w-[200px]">
                            <MyRangeSlider
                                value={value}
                                onChange={handleChange}
                                size="small"
                                valueLabelDisplay="auto"
                                step={0.1}
                                min={1}
                                max={10}
                                disableSwap
                            />
                        </div>
                    </div>

                    <div
                        className="floating-3d-1 absolute top-[80%] left-[63%] bg-cyan-500 p-3 pl-0 rounded-3xl shadow-md flex items-center justify-center text-gray-500 -z-30 "
                        dir={'rtl'}>
                        {/* Icon placeholder */}
                        <span className="text-xl">
                         <BarChart
                             grid={{horizontal: false, vertical: false}}
                             series={[{data, type: 'bar'}]}
                             borderRadius={300}
                             sx={{
                                 '& .MuiChartsAxis-left .MuiChartsAxis-tickLabel': {
                                     fill: '#ffffff',
                                 },
                             }}
                             xAxis={[{
                                 data: [new Date(2020, 1, 1), new Date(2021, 1, 1), new Date(2022, 1, 1), new Date(2023, 1, 1), new Date(2024, 1, 1),],
                                 valueFormatter: (value: Date) => value.getFullYear().toString(),
                                 colorMap: {
                                     type: 'continuous',
                                     min: new Date(2019, 1, 1),
                                     max: new Date(2024, 1, 1),
                                     color: ['#fff', '#ffffff77']
                                 },
                                 categoryGapRatio: 0.5,
                                 barGapRatio: 0.2,
                                 disableTicks: true,
                                 disableLine: true,
                                 tickLabelMinGap: 100,
                                 tickLabelPlacement: "middle",
                                 tickPlacement: "middle",
                                 position: 'none'

                             }]}
                             yAxis={[{
                                 disableTicks: true, disableLine: true,
                             }]}
                             width={250}
                             height={120}
                         />
                        </span>
                    </div>

                    <div
                        className="absolute bottom-[10%] left-[10%] bg-white p-3 rounded-full shadow-md flex items-center justify-center text-gray-500">
                        {/* Icon placeholder */}
                        <span className="text-xl">✅</span>
                    </div>

                    <div
                        className="floating-3d-2 absolute top-[30%] left-[20%] bg-white p-2 rounded-xl shadow-md flex items-center text-sm text-gray-700">
                        <span>میانگین نمره</span>
                        <span className="text-yellow-500 ml-1">۷.۸۲~</span>
                    </div>

                </div>
            </section>
        </main>

        {/* Footer / Stats Section */}
        <footer className="relative z-10 bg-white py-8 border-t border-gray-100 mt-10 lg:mt-20">
            <div
                className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center">
                    <span className="text-saba-blue text-4xl sm:text-5xl font-bold">۸۰۰۰۰۰+</span>
                    <span className="text-saba-text-light text-lg mt-2">عضو</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-saba-blue text-4xl sm:text-5xl font-bold">۴۱۳۰۹۱</span>
                    <span className="text-saba-text-light text-lg mt-2">فرم</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-saba-blue text-4xl sm:text-5xl font-bold">۴۰۱۶۸۰</span>
                    <span className="text-saba-text-light text-lg mt-2">ارزیابی</span>
                </div>
            </div>
        </footer>
    </div>);
}