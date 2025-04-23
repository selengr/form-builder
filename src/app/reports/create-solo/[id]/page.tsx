import Link from "next/link";
import dynamic from "next/dynamic";
import { AxiosResponse } from "axios";
import { IconButton } from "@mui/material";
import AxiosApi from "@/services/axios/AxiosApi";
import { IoIosArrowForward } from "react-icons/io";

const ConditionList = dynamic(
  () => import("@/templates/reports/condition/ConditionList"),
  { ssr: false }
);

export default async function Calculator({
  params,
}: {
  params: { id: string };
}) {
  const url = `/report/solo/main-list/${params.id}?searchFilterModel=%7B%22searchFilterBoxList%22%3A%5B%7B%22restrictionList%22%3A%5B%5D%7D%5D%2C%22sortList%22%3A%5B%7B%22fieldName%22%3A%22id%22%2C%22type%22%3A%22DSC%22%7D%5D%2C%22page%22%3A0%2C%22rows%22%3A1000%7D`;
  const conditions: AxiosResponse<any> = await AxiosApi.get(url);
  const {
    data: { content },
  } = conditions;

  return (
    <div className="w-full min-h-screen px-4 py-4 bg-[#f7f7f7]">
      <div className="container mx-auto flex p-3 flex-col justify-start items-center min-w-screen h-full bg-white rounded-xl w-full">
        <div className="relative flex w-full justify-center items-center h-[52px] rounded-lg bg-[#F7F7FF]">
          <Link href={`/reports`} className="absolute right-4">
            <IconButton
              sx={{
                borderRadius: "9999px",
              }}
            >
              <IoIosArrowForward fontSize="1.1rem" color="#000" />
            </IconButton>
          </Link>
          ساخت گزارش
        </div>
        <ConditionList conditions={content} />
      </div>
    </div>
  );    
}
