"use client";
import {useEffect, useState} from "react";
import AxiosApi from "@/services/axios/AxiosApi";
import ClientView from "./ClientView"; // اینو اضافه کن

export default function Calculator({
                                     params,
                                   }: {
  params: { id: string };
}) {
  const [calculators, setCalculators] = useState<any[]>([]); // state برای ذخیره داده‌ها
  const [loading, setLoading] = useState(true); // state برای وضعیت بارگذاری

  useEffect(() => {
    const fetchData = async () => {
      const url = `/calculation/main-list/${params.id}?searchFilterModel=%7B%22searchFilterBoxList%22%3A%5B%7B%22restrictionList%22%3A%5B%5D%7D%5D%2C%22sortList%22%3A%5B%7B%22fieldName%22%3A%22id%22%2C%22type%22%3A%22DSC%22%7D%5D%2C%22page%22%3A0%2C%22rows%22%3A1000%7D`; // همون URL خودت
      try {
        const res = await AxiosApi.get(url);
        const {
          data: {content},
        } = res;
        setCalculators(content); // داده‌ها رو در state ذخیره می‌کنیم
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false); // وقتی داده‌ها بارگذاری شد، loading رو false می‌کنیم
      }
    };

    fetchData(); // فراخوانی تابع برای گرفتن داده‌ها
  }, [params.id]); // هر وقت params.id تغییر کرد، داده‌ها دوباره بارگذاری می‌شوند

  if (loading) {
    return <div>Loading...</div>; // وقتی داده‌ها در حال بارگذاری هستن، یه چیزی نشون میده
  }

  return <ClientView calculators={calculators}/>;
}
