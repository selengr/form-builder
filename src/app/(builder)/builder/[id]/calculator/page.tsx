import dynamic from "next/dynamic";
import { AxiosResponse } from "axios";
import AxiosApi from "@/services/axios/AxiosApi";
import DesignerTabs from "@/templates/builder/TabComponent";
// import CalculatorList from '@/templates/calculator/CalculatorList';

const CalculatorList = dynamic(
  () => import("@/templates/calculator/CalculatorList"),
  { ssr: false }
);

export default async function Calculator({
                                           params,
                                         }: {
  params: { id: string };
}) {
  const url = `/calculation/main-list/${params.id}?searchFilterModel=%7B%22searchFilterBoxList%22%3A%5B%7B%22restrictionList%22%3A%5B%5D%7D%5D%2C%22sortList%22%3A%5B%7B%22fieldName%22%3A%22id%22%2C%22type%22%3A%22DSC%22%7D%5D%2C%22page%22%3A0%2C%22rows%22%3A1000%7D`;
  const calculators: AxiosResponse<any> = await AxiosApi.get(url);
  const {
    data: { content },
  } = calculators;

  return (
    <div className="w-full min-h-full px-4 py-4 bg-[#f7f7f7]">
      <div className="container mx-auto flex flex-col justify-start items-center h-full bg-white rounded-xl w-full">
        <DesignerTabs />
        <CalculatorList calculators={content} />
      </div>
    </div>
  );
}
