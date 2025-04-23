import Link from "next/link";

const formTypePersian: any = {
  TEST: "آزمون",
  QUESTION: "پرسشنامه",
  SURVEY: "نظرسنجی",
  COMPETITION: "مسابقه",
};

export default function ListCard(props: any) {
  return (
    <div className="border-[1px] flex flex-col gap-3 rounded-[20px] border-[#DDE1E6] p-4">
      <div className="flex gap-1 text-[#393939]">
        <span className="text-[14px]">نام:</span>
        <p
          className="text-[14px] font-bold"
          style={{
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
          }}
        >
          {props.data.name}
        </p>
      </div>
      <div className="flex gap-1 text-[#393939]">
        <span className="text-[14px]">نوع:</span>
        <p>{formTypePersian[props.data.type]}</p>
      </div>
      <div className="flex gap-1 text-[#393939]">
        <span className="text-[14px]">دسترسی:</span>
        <p className="text-[14px] font-bold">
          {props.data.accessType ? props.data.accessType : "عمومی"}
        </p>
      </div>
      <div className="flex gap-1 text-[#393939]">
        <span className="text-[14px]">وضعیت:</span>
        <p className="text-[14px] font-bold">انجام نشده</p>
      </div>
      <div className="flex w-full gap-2 flex-row">
      <Link href={`/stats/${props.data.id}`} >
        <button className="bg-[#1758BA] hover:bg-[#216ee1] transition-all duration-200 max-w-[200px] px-2 h-[36px] w-full text-[14px] rounded-lg text-white">
          مشاهده نتایج
        </button>
        </Link>
        <Link href={`/reports/create-solo/${props?.data?.id}`}>
          <button className="bg-[#2CDFC9]  hover:opacity-90 hover:shadow-md transition-all duration-200 max-w-[200px] px-12 h-[36px] w-full text-[14px] rounded-lg text-white">
            ساخت گزارش
          </button>
        </Link>
      </div>
    </div>
  );
}
