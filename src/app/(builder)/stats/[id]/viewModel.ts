import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import statsService from '@/services/statsService';

export const useStatsViewModel = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState<any>({});
  const [headData, setHeadData] = useState<any[]>([]);
  const [allData, setAllData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFormData = async () => {
    try {
      setIsLoading(true);
      const data = await statsService.getFormData(id.toString());
      setFormData(data);
    } catch (error) {
      console.error('Error fetching form data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStatsData = async () => {
    try {
      setIsLoading(true);
      const data = await fetch(`/api/stats/${id}`).then(res => res.json());

      setHeadData([
        ...data.content[0].row,
        { questionId: Math.random(), questionTitle: "عملیات" },
      ]);
      setAllData(data.content);
    } catch (error) {
      console.error('Error fetching stats data:', error);
      setHeadData(generateHeaders());
      setAllData(generateFakeData(100));
    } finally {
      setIsLoading(false);
    }
  };

  const generateHeaders = () => [
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
  ];

  const generateFakeData = (count: number) => {
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

  useEffect(() => {
    (async () => {
      await fetchFormData();
      await fetchStatsData();
    })();
  }, [id]);


  return {
    formData,
    headData,
    allData,
    isLoading,
  };
};
