import { TReporterInformationItem } from "./type";
interface ListCardProps {
    data: TReporterInformationItem
}

const ListCard = ({data}: ListCardProps) => {
  return (
    <div className="w-full min-h-screen px-4 py-4 bg-[#f7f7f7]">
      <div className="md:container mx-auto flex p-3 flex-col justify-start items-center min-w-screen h-full bg-white rounded-xl w-full">
   

        <div className={`rounded-lg flex flex-col transition-all bg-[#F7F7FF] p-[10px] pb-[30px] relative max-w-[450px]`}>
          <div
            className={`rounded-lg p-[10px] flex justify-between w-full border-[1px] border-[#1758BA] bg-[#fff]`}
          >
            <div className="flex justify-center items-start flex-col gap-[10px] p-[5px]">
          
                  <div className="flex flex-row gap-2">
                    <span className="text-[#161616] text-sm">گزارش دهنده: </span>
                    <span className="text-[#1758BA] text-sm">محمدتقی خیرخواه</span>
                  </div>
                  <div className="flex flex-row gap-2">
                    <span className="text-[#161616] text-sm">مورد گزارش: </span>
                    <span className="text-[#1758BA] text-sm">فرم</span>
                  </div>
                  <div className="flex flex-row gap-2">
                    <span className="text-[#161616] text-sm">نوع گزارش: </span>
                    <span className="text-[#1758BA] text-sm">نقض مالکیت معنوی</span>
                  </div>
                  <div className="flex flex-row gap-2">
                    <span className="text-[#161616] whitespace-nowrap text-sm">دلیل گزارش: </span>
                    <span className="text-[#1758BA] text-sm">این فرم مالکیت معنوی صاحب فرم را نقض کرده. ممنون میشم بررسی کنید</span>
                  </div>
               
            </div>
          </div>
          <span className="text-[#1758BA] text-sm absolute left-4 bottom-1">۱۴۰۳/۱۲/۲۳</span>
         
        </div>
      </div>
    </div>
  );
};

export default ListCard;