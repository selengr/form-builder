import { useRouter } from "next/navigation";

const formTypePersian: any = {
  TEST: "آزمون",
  QUESTION: "پرسشنامه",
  SURVEY: "نظرسنجی",
  COMPETITION: "مسابقه",
};

const formStatusPersian: any = {
  CREATE: "ساخته شده",
  PUBLISH: "انتشار یافته",
};

export default function ListCard(props: any) {
  const router = useRouter();

  return (
    <>
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
          <p className="text-[14px] font-bold">
            {formStatusPersian[props.data.status]}
          </p>
        </div>
        <div className="flex w-full gap-2">
          <button
            className="bg-[#1758BA] hover:bg-[#216ee1] transition-all duration-200 max-w-[200px] px-2 h-[36px] w-full text-[14px] rounded-lg text-white"
            onClick={() => {
              router.push(`/form/${props.data.id}`);
            }}
          >
            شرکت در آزمون
          </button>
        </div>
      </div>
    </>
  );
}
