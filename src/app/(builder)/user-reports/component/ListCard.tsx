import { TReporterInformationItem } from "./type";
interface IProps {
    data: TReporterInformationItem
}

const ListCard = ({data}: IProps) => {
  return (
        <div className={`rounded-lg flex flex-col transition-all bg-[#F7F7FF] p-[10px] pb-[30px] relative max-w-[450px]`}>
          <div
            className={`rounded-lg p-[10px] flex justify-between w-full border-[1px] border-[#1758BA] bg-[#fff]`}
          >
            <div className="flex justify-center items-start flex-col gap-[10px] p-[5px]">
          
                  <div className="flex flex-row gap-2">
                    <span className="text-[#161616] text-sm">گزارش دهنده: </span>
                    <span className="text-[#1758BA] text-sm">{data?.username}</span>
                  </div>
                  <div className="flex flex-row gap-2">
                    <span className="text-[#161616] text-sm">مورد گزارش: </span>
                    <span className="text-[#1758BA] text-sm">{data?.responseModel.value}</span>
                  </div>
                  <div className="flex flex-row gap-2">
                    <span className="text-[#161616] text-sm">نوع گزارش: </span>
                    <span className="text-[#1758BA] text-sm">{data?.typeOfReportModel?.value}</span>
                  </div>
                  <div className="flex flex-row gap-2">
                    <span className="text-[#161616] whitespace-nowrap text-sm">دلیل گزارش: </span>
                    <span className="text-[#1758BA] text-sm">{data?.description}</span>
                  </div>
               
            </div>
          </div>
          <span className="text-[#1758BA] text-sm absolute left-4 bottom-1">۱۴۰۳/۱۲/۲۳</span>
         
        </div>
  );
};

export default ListCard;