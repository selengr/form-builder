"use client";

import React, {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {IoStatsChartOutline} from "react-icons/io5";
import {LuUserRoundPlus} from "react-icons/lu";
import {MdKeyboardArrowLeft, MdKeyboardArrowRight, MdOutlineKeyboardArrowRight} from "react-icons/md";
import {ImSpinner2} from "react-icons/im";
import {IconButton, Tooltip} from "@mui/material";

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

  useEffect(() => {
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
  }, []);

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
      {/* Header */}
      <div className="w-full h-[52px] flex items-center justify-center gap-4 rounded-lg bg-[#F7F7FF] px-2 mb-4 relative">
        <IconButton
          sx={{position: "absolute", left: "8px"}}
          onClick={() => router.push("/")}
        >
          <MdOutlineKeyboardArrowRight color="#292D32"/>
        </IconButton>
        <p className="text-[16px] text-center font-bold text-[#161616]">
          تست گزارش
        </p>
      </div>

      {/* Table */}
      <div className="w-full md:max-h-[calc(100vh-155px)] max-h-[calc(100vh-220px)] overflow-auto rounded-xl border">
        {isLoading ? (
          <div className="w-full h-[300px] flex justify-center items-center">
            <ImSpinner2 className="animate-spin h-12 w-12"/>
          </div>
        ) : (
          <table className="min-w-[700px] w-full border-separate border-spacing-0">
            <thead>
            <tr>
              {headData.map((item) => (
                <th
                  key={item.questionId}
                  className="bg-[#F7F7FF] font-bold text-black text-center px-4 py-3 text-sm w-[200px] truncate"
                >
                  <div
                    className="truncate"
                    title={item.questionTitle}
                    dir="rtl"
                  >
                    {item.questionTitle}
                  </div>
                </th>
              ))}
            </tr>
            </thead>
            <tbody>
            {allData.map((row, rowIndex) => (
              <tr
                key={row.row[0]?.questionId || rowIndex}
                className={
                  rowIndex % 2 !== 0 ? "bg-[#F7F7FF]" : "bg-white"
                }
              >

                {row.row.map((data, i) => (
                  <td
                    key={i}
                    className="text-center px-3 py-2 font-semibold text-sm w-[200px]"
                  >
                    <Tooltip
                      title={data.answer.join(" - ")}
                      followCursor
                      arrow
                      placement="top"
                    >
                      <div className=" overflow-hidden text-ellipsis line-clamp-3"
                           style={{display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 3}}>
                        {data.answer
                          .map((d) => d)
                          .join(" - ")
                          .slice(0, 400)}
                        {data.answer.join(" - ").length > 400 ? "..." : ""}
                      </div>
                    </Tooltip>
                  </td>

                ))}

                {/* Actions */}
                <td className="px-4 py-2">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      className={`rounded-md p-2 ${
                        row.id === 3 ? "bg-red-500" : "bg-teal-400"
                      }`}
                    >
                      <LuUserRoundPlus className="text-white"/>
                    </button>
                    <button className="rounded-md p-2 bg-blue-700">
                      <IoStatsChartOutline className="text-white"/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination & Controls */}
      <div className="bg-[#F7F7FF] w-full flex flex-wrap justify-between items-center px-4 py-2 mt-4 gap-2 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-sm">سطر قابل نمایش در هر صفحه:</span>
          <select className="bg-white rounded-md h-9 px-2 text-sm border border-gray-300 font-iran-sans">
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value="all">همه</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-white border border-blue-700 rounded-full p-1">
            <MdKeyboardArrowRight className="text-blue-700 text-xl"/>
          </button>
          <span className="text-sm">صفحه 1 از 1</span>
          <button className="bg-white border border-blue-700 rounded-full p-1">
            <MdKeyboardArrowLeft className="text-blue-700 text-xl"/>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">{allData.length} نفر در لیست</span>
          <div className="bg-blue-700 p-2 rounded-lg">
            <LuUserRoundPlus className="text-white text-xl"/>
          </div>
        </div>
      </div>
    </div>
  );
}
