"use client";

import React, {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {ReportHeader, ReportPagination, ReportTable} from "@/app/(builder)/stats/[id]/component";

export default function StatsPage() {
  const [headData, setHeadData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allData, setAllData] = useState<any[]>([]);
  const {id} = useParams();
  const router = useRouter();

  const fakeDataGenerator = (count: number) => {
    return Array.from({length: count}, (_, i) => ({
      id: i + 1,
      row: [
        {
          questionId: 1,
          questionTitle: "نام",
          answer: [`کاربر ${i + 1}`],
        },
        {
          questionId: 2,
          questionTitle: "سن",
          answer: [`${18 + (i % 30)}`],
        },
        {
          questionId: 3,
          questionTitle: "شهر",
          answer: [`لورم ایپسوم بسیار طولانی ${i}`],
        },
        {
          questionId: 4,
          questionTitle: "شغل",
          answer: [`برنامه‌نویس ${i}`],
        },
        {
          questionId: 5,
          questionTitle: "تحصیلات",
          answer: [`لیسانس نرم‌افزار`],
        },
        {
          questionId: 6,
          questionTitle: "وضعیت تاهل",
          answer: [i % 2 === 0 ? "مجرد" : "متأهل"],
        },
        {
          questionId: 7,
          questionTitle: "علاقه‌مندی",
          answer: [`کدنویسی، موسیقی`],
        },
        {
          questionId: 8,
          questionTitle: "تجربه کاری",
          answer: [`${i % 10} سال`],
        },
        {
          questionId: 9,
          questionTitle: "کشور",
          answer: [`ایران`],
        },
        {
          questionId: 10,
          questionTitle: "نظر",
          answer: [`این راست نیست که هرچه عاشق‌ تر باشی بهتر درک می‌کنی. همه‌ی آنچه عشق و عاشقی از من می‌ خواهد فقط درکِ این حکمت است: دیگری نشناختنی است؛ ماتیِ او پرده‌ی ابهامی به روی یک راز نیست، بل گواهی است که در آن بازیِ بود و نمود هیچ‌ جایی ندارد. پس من در مسرتِ عشق ورزیدن به یک ناشناس غرق می‌شوم، کسی که تا ابد ناشناس خواهد ماند. سِیری عارفانه: من آن‌چه را نمی‌شناسم می‌شناسم...!`],
        },
      ],
    }));
  };


  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       setIsLoading(true);
  //       const res = await AxiosApi.get(
  //         `/report/solo/answers-data-sheet/${id}?searchFilterModel=%7B%22searchFilterBoxList%22%3A%5B%7B%22restrictionList%22%3A%5B%5D%7D%5D%2C%22sortList%22%3A%5B%7B%22fieldName%22%3A%22id%22%2C%22type%22%3A%22DSC%22%7D%5D%2C%22page%22%3A0%2C%22rows%22%3A100000%7D`
  //       );
  //       setHeadData([
  //         ...res.data.content[0].row,
  //         { questionId: Math.random(), questionTitle: "عملیات" },
  //       ]);
  //       setAllData(res.data.content);
  //     } catch (err) {
  //       console.error(err);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }
  //
  //   fetchData();
  // }, []);

/*  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const res = await AxiosApi.get(
          `/report/solo/answers-data-sheet/${id}?searchFilterModel=%7B%22searchFilterBoxList%22%3A%5B%7B%22restrictionList%22%3A%5B%5D%7D%5D%2C%22sortList%22%3A%5B%7B%22fieldName%22%3A%22id%22%2C%22type%22%3A%22DSC%22%7D%5D%2C%22page%22%3A0%2C%22rows%22%3A100000%7D`
        );
        setHeadData([
          ...res.data.content[0].row,
          { questionId: Math.random(), questionTitle: "عملیات" },
        ]);
        setAllData(res.data.content);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);*/

  useEffect(() => {
    setHeadData([
      {questionId: 1, questionTitle: "نام"},
      {questionId: 2, questionTitle: "سن"},
      {questionId: 3, questionTitle: "شهر"},
      {questionId: 4, questionTitle: "شغل"},
      {questionId: 5, questionTitle: "تحصیلات"},
      {questionId: 6, questionTitle: "وضعیت تاهل"},
      {questionId: 7, questionTitle: "علاقه‌مندی"},
      {questionId: 8, questionTitle: "تجربه کاری"},
      {questionId: 9, questionTitle: "کشور"},
      {questionId: 10, questionTitle: "نظر"},
      {questionId: Math.random(), questionTitle: "عملیات"},
    ]);
    setAllData(fakeDataGenerator(100));
  }, []);


  return (
    <div className="w-full p-4 bg-white">
      <ReportHeader title="تست گزارش" onBack={() => router.push("/")} />
      <ReportTable
        headData={headData}
        allData={allData}
        isLoading={isLoading}
      />
      <ReportPagination totalItems={allData.length} />
    </div>
  );
}
